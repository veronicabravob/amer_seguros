"""Lógica de negocio de la sesión (HU-001).

Los endpoints de `api.py` validan la entrada y llaman aquí; no deciden nada por su cuenta.
"""

import uuid
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta

import jwt
from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password
from django.utils import timezone

from apps.core.excepciones import AccesoNegado, DemasiadosIntentos, NoAutenticado

from .models import IntentoIngreso, SesionToken, Usuario, normalizar_correo

ALGORITMO = "HS256"

MENSAJE_CREDENCIALES = "Correo o contraseña incorrectos"
MENSAJE_INACTIVA = "Tu cuenta está inactiva, contacta al administrador"
MENSAJE_BLOQUEO = "Demasiados intentos. Intenta de nuevo en 15 minutos"
MENSAJE_SIN_SESION = "Sesión no válida"

# Hash de descarte: se verifica contra él cuando el correo no existe, para que responder
# "correo inexistente" cueste lo mismo que responder "contraseña incorrecta" y el tiempo
# de respuesta no revele cuál de los dos falló.
_HASH_FICTICIO = make_password("contrasena-que-nadie-usa")


@dataclass
class SesionActiva:
    """Resultado de validar un token en una petición."""

    usuario: Usuario
    sesion: SesionToken
    reemitir: bool = False


# --- Emisión y validación ----------------------------------------------------


def emitir_token(usuario: Usuario, user_agent: str = "") -> tuple[str, SesionToken]:
    """Emite un JWT y registra su sesión, que es lo que permite revocarlo."""
    ahora = timezone.now()
    jti = uuid.uuid4()
    sesion = SesionToken.objects.create(
        jti=jti,
        usuario=usuario,
        ultimo_uso=ahora,
        user_agent=(user_agent or "")[:255],
    )
    token = jwt.encode(
        {
            "sub": str(usuario.pk),
            "jti": str(jti),
            "iat": int(ahora.timestamp()),
            "exp": int((ahora + settings.SESION_INACTIVIDAD).timestamp()),
        },
        settings.SECRET_KEY,
        algorithm=ALGORITMO,
    )
    return token, sesion


def reemitir_token(sesion: SesionToken) -> str:
    """Renueva la vigencia del JWT de una sesión viva, conservando su `jti`.

    Es lo que convierte el `exp` absoluto del JWT en la caducidad por inactividad de RN-3:
    mientras la sesión se use, el token se renueva antes de vencer.
    """
    ahora = timezone.now()
    return jwt.encode(
        {
            "sub": str(sesion.usuario_id),
            "jti": str(sesion.jti),
            "iat": int(ahora.timestamp()),
            "exp": int((ahora + settings.SESION_INACTIVIDAD).timestamp()),
        },
        settings.SECRET_KEY,
        algorithm=ALGORITMO,
    )


def validar_token(token: str, ahora: datetime | None = None) -> SesionActiva:
    """Valida firma, vigencia, revocación, estado de la cuenta e inactividad (RN-3, RN-4)."""
    ahora = ahora or timezone.now()

    if not token:
        raise NoAutenticado("sin_sesion", MENSAJE_SIN_SESION)

    try:
        datos = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITMO])
    except jwt.PyJWTError as exc:
        raise NoAutenticado("sin_sesion", MENSAJE_SIN_SESION) from exc

    try:
        jti = uuid.UUID(str(datos.get("jti")))
    except (ValueError, TypeError) as exc:
        raise NoAutenticado("sin_sesion", MENSAJE_SIN_SESION) from exc

    sesion = SesionToken.objects.select_related("usuario").filter(jti=jti).first()
    if sesion is None or sesion.esta_revocada:
        raise NoAutenticado("sin_sesion", MENSAJE_SIN_SESION)

    if str(sesion.usuario_id) != str(datos.get("sub")):
        raise NoAutenticado("sin_sesion", MENSAJE_SIN_SESION)

    # La cuenta pudo desactivarse con la sesión abierta.
    if not sesion.usuario.esta_activo:
        raise NoAutenticado("sin_sesion", MENSAJE_SIN_SESION)

    # RN-3: la caducidad se mide sobre la inactividad, no sobre la emisión.
    if ahora - sesion.ultimo_uso > settings.SESION_INACTIVIDAD:
        raise NoAutenticado("sin_sesion", MENSAJE_SIN_SESION)

    # Amortiguación: como mucho un UPDATE por minuto (design.md D1).
    if ahora - sesion.ultimo_uso > settings.SESION_AMORTIGUACION_USO:
        sesion.ultimo_uso = ahora
        sesion.save(update_fields=["ultimo_uso"])
    else:
        sesion.ultimo_uso = ahora

    expira_en = datetime.fromtimestamp(datos["exp"], tz=UTC)
    reemitir = (expira_en - ahora) < settings.SESION_MARGEN_REEMISION

    return SesionActiva(usuario=sesion.usuario, sesion=sesion, reemitir=reemitir)


def cerrar_sesion(jti) -> None:
    """Invalida una sesión concreta (CA-5). Las demás sesiones del usuario siguen vivas."""
    SesionToken.objects.filter(jti=jti, revocado_en__isnull=True).update(revocado_en=timezone.now())


def purgar_sesiones(dias: int | None = None) -> int:
    """Borra sesiones revocadas o caducadas hace más de `dias`. Devuelve cuántas borró."""
    dias = settings.SESION_RETENCION_DIAS if dias is None else dias
    corte = timezone.now() - timedelta(days=dias)
    borradas, _ = SesionToken.objects.filter(revocado_en__lt=corte).delete()
    caducadas, _ = SesionToken.objects.filter(
        revocado_en__isnull=True, ultimo_uso__lt=corte
    ).delete()
    return borradas + caducadas


# --- Intentos fallidos (RN-2) ------------------------------------------------


def _inicio_ventana(ahora: datetime) -> datetime:
    return ahora - settings.INGRESO_VENTANA_BLOQUEO


def contar_intentos_fallidos(correo: str, ahora: datetime | None = None) -> int:
    """Fallos del correo dentro de la ventana y posteriores al último ingreso exitoso."""
    ahora = ahora or timezone.now()
    correo = normalizar_correo(correo)
    intentos = IntentoIngreso.objects.filter(
        correo_normalizado=correo, creado_en__gte=_inicio_ventana(ahora)
    )
    ultimo_exito = intentos.filter(exito=True).order_by("-creado_en").first()
    if ultimo_exito is not None:
        intentos = intentos.filter(creado_en__gt=ultimo_exito.creado_en)
    return intentos.filter(exito=False).count()


def esta_bloqueado(correo: str, ahora: datetime | None = None) -> bool:
    return contar_intentos_fallidos(correo, ahora) >= settings.INGRESO_MAX_INTENTOS


def registrar_intento(correo: str, exito: bool, ip: str | None = None) -> IntentoIngreso:
    return IntentoIngreso.objects.create(
        correo_normalizado=normalizar_correo(correo), exito=exito, ip=ip or None
    )


# --- Ingreso -----------------------------------------------------------------


def autenticar(correo: str, password: str, ip: str | None = None) -> Usuario:
    """Comprueba bloqueo, credenciales y estado de la cuenta, en ese orden."""
    correo = normalizar_correo(correo)

    # El bloqueo se comprueba antes que nada: ni siquiera se mira la contraseña.
    # El intento bloqueado no se registra, para que la ventana de 15 minutos cuente
    # desde el bloqueo y no se alargue sola con cada reintento.
    if esta_bloqueado(correo):
        raise DemasiadosIntentos("demasiados_intentos", MENSAJE_BLOQUEO)

    usuario = Usuario.objects.por_correo(correo)

    if usuario is None:
        check_password(password, _HASH_FICTICIO)
        registrar_intento(correo, exito=False, ip=ip)
        raise NoAutenticado("credenciales_invalidas", MENSAJE_CREDENCIALES)

    if not usuario.check_password(password):
        registrar_intento(correo, exito=False, ip=ip)
        raise NoAutenticado("credenciales_invalidas", MENSAJE_CREDENCIALES)

    if not usuario.esta_activo:
        # No se registra intento: las credenciales eran correctas, así que esto no es un
        # tanteo de contraseñas y no debe contar para RN-2 ni reiniciar su contador.
        raise AccesoNegado("cuenta_inactiva", MENSAJE_INACTIVA)

    registrar_intento(correo, exito=True, ip=ip)
    return usuario
