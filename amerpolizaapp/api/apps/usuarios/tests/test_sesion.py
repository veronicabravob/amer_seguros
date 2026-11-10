"""Tareas 3.1, 3.2 y 3.5 — emisión, validación y cierre de la sesión (RN-3, RN-4, CA-5)."""

import uuid
from datetime import timedelta

import jwt
import pytest
from django.conf import settings
from django.utils import timezone

from apps.core.excepciones import NoAutenticado
from apps.usuarios import services
from apps.usuarios.models import SesionToken, Usuario

# --- 3.1 emisión --------------------------------------------------------------


def test_el_token_lleva_los_cuatro_claims(usuario):
    token, _ = services.emitir_token(usuario)

    datos = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])

    assert datos["sub"] == str(usuario.pk)
    assert uuid.UUID(datos["jti"])
    assert "iat" in datos
    assert "exp" in datos


def test_emitir_deja_una_sesion_activa(usuario):
    _, sesion = services.emitir_token(usuario)

    assert SesionToken.objects.filter(jti=sesion.jti, revocado_en__isnull=True).exists()
    assert sesion.usuario == usuario


def test_el_exp_del_token_son_ocho_horas(usuario):
    antes = timezone.now()
    token, _ = services.emitir_token(usuario)

    datos = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    duracion = datos["exp"] - int(antes.timestamp())

    assert abs(duracion - settings.SESION_INACTIVIDAD.total_seconds()) < 5


def test_se_guarda_el_agente_del_navegador(usuario):
    _, sesion = services.emitir_token(usuario, user_agent="Playwright/1.61")

    assert sesion.user_agent == "Playwright/1.61"


def test_cada_emision_crea_una_sesion_distinta(usuario):
    _, una = services.emitir_token(usuario)
    _, otra = services.emitir_token(usuario)

    assert una.jti != otra.jti


# --- 3.2 validación -----------------------------------------------------------


def test_un_token_valido_devuelve_al_usuario(usuario):
    token, _ = services.emitir_token(usuario)

    activa = services.validar_token(token)

    assert activa.usuario == usuario


def test_un_token_con_la_firma_alterada_se_rechaza(usuario):
    token, _ = services.emitir_token(usuario)
    manipulado = token[:-3] + ("aaa" if not token.endswith("aaa") else "bbb")

    with pytest.raises(NoAutenticado):
        services.validar_token(manipulado)


def test_un_token_firmado_con_otra_clave_se_rechaza(usuario):
    _, sesion = services.emitir_token(usuario)
    ajeno = jwt.encode(
        {
            "sub": str(usuario.pk),
            "jti": str(sesion.jti),
            "iat": int(timezone.now().timestamp()),
            "exp": int((timezone.now() + timedelta(hours=1)).timestamp()),
        },
        "otra-clave-distinta-de-al-menos-32-bytes",
        algorithm="HS256",
    )

    with pytest.raises(NoAutenticado):
        services.validar_token(ajeno)


@pytest.mark.parametrize("basura", ["", "no-es-un-token", "a.b.c"])
def test_un_token_mal_formado_se_rechaza(db, basura):
    with pytest.raises(NoAutenticado):
        services.validar_token(basura)


def test_una_sesion_revocada_se_rechaza(usuario):
    token, sesion = services.emitir_token(usuario)
    services.cerrar_sesion(sesion.jti)

    with pytest.raises(NoAutenticado):
        services.validar_token(token)


def test_una_sesion_que_ya_no_existe_se_rechaza(usuario):
    token, sesion = services.emitir_token(usuario)
    SesionToken.objects.filter(jti=sesion.jti).delete()

    with pytest.raises(NoAutenticado):
        services.validar_token(token)


def test_un_usuario_desactivado_pierde_la_sesion_abierta(usuario):
    token, _ = services.emitir_token(usuario)

    usuario.estado = Usuario.Estado.INACTIVO
    usuario.save()

    with pytest.raises(NoAutenticado):
        services.validar_token(token)


def test_nueve_horas_sin_usar_caducan_la_sesion(usuario):
    token, sesion = services.emitir_token(usuario)
    SesionToken.objects.filter(pk=sesion.pk).update(ultimo_uso=timezone.now() - timedelta(hours=9))

    with pytest.raises(NoAutenticado):
        services.validar_token(token)


def test_siete_horas_sin_usar_no_caducan_la_sesion(usuario):
    token, sesion = services.emitir_token(usuario)
    SesionToken.objects.filter(pk=sesion.pk).update(ultimo_uso=timezone.now() - timedelta(hours=7))

    activa = services.validar_token(token)

    assert activa.usuario == usuario


def test_usar_la_sesion_renueva_el_plazo_de_inactividad(usuario):
    token, sesion = services.emitir_token(usuario)
    SesionToken.objects.filter(pk=sesion.pk).update(ultimo_uso=timezone.now() - timedelta(hours=7))

    services.validar_token(token)
    sesion.refresh_from_db()

    assert timezone.now() - sesion.ultimo_uso < timedelta(minutes=1)


def test_la_escritura_de_ultimo_uso_esta_amortiguada(usuario):
    """Dos peticiones seguidas no deben provocar dos UPDATE."""
    token, sesion = services.emitir_token(usuario)
    marca_inicial = SesionToken.objects.get(pk=sesion.pk).ultimo_uso

    services.validar_token(token)

    assert SesionToken.objects.get(pk=sesion.pk).ultimo_uso == marca_inicial


def test_pasada_la_amortiguacion_si_se_escribe(usuario):
    token, sesion = services.emitir_token(usuario)
    hace_dos_minutos = timezone.now() - timedelta(minutes=2)
    SesionToken.objects.filter(pk=sesion.pk).update(ultimo_uso=hace_dos_minutos)

    services.validar_token(token)

    assert SesionToken.objects.get(pk=sesion.pk).ultimo_uso > hace_dos_minutos


def test_un_token_de_otro_usuario_para_la_misma_sesion_se_rechaza(usuario, crear_usuario):
    otro = crear_usuario(correo="otro@amerseguros.com", nombre="Otro")
    _, sesion = services.emitir_token(usuario)
    suplantado = jwt.encode(
        {
            "sub": str(otro.pk),
            "jti": str(sesion.jti),
            "iat": int(timezone.now().timestamp()),
            "exp": int((timezone.now() + timedelta(hours=1)).timestamp()),
        },
        settings.SECRET_KEY,
        algorithm="HS256",
    )

    with pytest.raises(NoAutenticado):
        services.validar_token(suplantado)


def test_marca_para_reemitir_cuando_al_token_le_queda_menos_de_una_hora(usuario):
    _, sesion = services.emitir_token(usuario)
    por_vencer = jwt.encode(
        {
            "sub": str(usuario.pk),
            "jti": str(sesion.jti),
            "iat": int(timezone.now().timestamp()),
            "exp": int((timezone.now() + timedelta(minutes=20)).timestamp()),
        },
        settings.SECRET_KEY,
        algorithm="HS256",
    )

    assert services.validar_token(por_vencer).reemitir is True


def test_no_marca_para_reemitir_un_token_recien_emitido(usuario):
    token, _ = services.emitir_token(usuario)

    assert services.validar_token(token).reemitir is False


def test_el_token_reemitido_conserva_el_jti(usuario):
    _, sesion = services.emitir_token(usuario)

    nuevo = services.reemitir_token(sesion)
    datos = jwt.decode(nuevo, settings.SECRET_KEY, algorithms=["HS256"])

    assert datos["jti"] == str(sesion.jti)
    assert datos["exp"] > int(timezone.now().timestamp())


# --- 3.5 cierre de sesión (CA-5) ---------------------------------------------


def test_cerrar_sesion_invalida_el_token(usuario):
    token, sesion = services.emitir_token(usuario)

    services.cerrar_sesion(sesion.jti)

    sesion.refresh_from_db()
    assert sesion.esta_revocada
    with pytest.raises(NoAutenticado):
        services.validar_token(token)


def test_cerrar_una_sesion_no_afecta_a_la_otra(usuario):
    token_uno, sesion_uno = services.emitir_token(usuario)
    token_dos, _ = services.emitir_token(usuario)

    services.cerrar_sesion(sesion_uno.jti)

    with pytest.raises(NoAutenticado):
        services.validar_token(token_uno)
    assert services.validar_token(token_dos).usuario == usuario


def test_cerrar_dos_veces_no_cambia_la_marca_de_revocacion(usuario):
    _, sesion = services.emitir_token(usuario)
    services.cerrar_sesion(sesion.jti)
    sesion.refresh_from_db()
    primera_marca = sesion.revocado_en

    services.cerrar_sesion(sesion.jti)
    sesion.refresh_from_db()

    assert sesion.revocado_en == primera_marca
