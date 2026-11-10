"""Usuario, sesión e intentos de ingreso (HU-001)."""

from django.conf import settings
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.password_validation import MinimumLengthValidator
from django.core.exceptions import ValidationError
from django.db import models


def normalizar_correo(correo: str) -> str:
    """Un correo siempre se compara en minúsculas y sin espacios sobrantes."""
    return (correo or "").strip().lower()


class UsuarioManager(models.Manager):
    """Alta de usuarios con el correo como identificador."""

    use_in_migrations = True

    def _crear(self, correo, password, **extra):
        correo = normalizar_correo(correo)
        if not correo:
            raise ValueError("El correo es obligatorio.")
        usuario = self.model(correo=correo, **extra)
        usuario.fijar_password(password)
        usuario.save(using=self._db)
        return usuario

    def create_user(self, correo, password=None, **extra):
        extra.setdefault("is_staff", False)
        extra.setdefault("is_superuser", False)
        return self._crear(correo, password, **extra)

    def create_superuser(self, correo, password=None, **extra):
        extra.setdefault("is_staff", True)
        extra.setdefault("is_superuser", True)
        extra.setdefault("rol", Usuario.Rol.ADMINISTRADOR)
        extra.setdefault("estado", Usuario.Estado.ACTIVO)
        if extra.get("is_staff") is not True or extra.get("is_superuser") is not True:
            raise ValueError("Un superusuario debe tener is_staff e is_superuser en True.")
        return self._crear(correo, password, **extra)

    def por_correo(self, correo):
        """Busca por correo normalizado; devuelve None si no existe."""
        return self.filter(correo=normalizar_correo(correo)).first()


class Usuario(AbstractBaseUser, PermissionsMixin):
    """Persona del equipo de la agencia.

    El identificador es el correo, no un nombre de usuario. `rol` y `sede` son texto con
    opciones fijas en esta HU; HU-007 y HU-020 los convertirán en relaciones.
    """

    class Rol(models.TextChoices):
        ADMINISTRADOR = "Administrador", "Administrador"
        ASESOR = "Asesor comercial", "Asesor comercial"
        COBROS = "Cobros", "Cobros"
        RECEPCION = "Recepción", "Recepción"

    class Estado(models.TextChoices):
        ACTIVO = "Activo", "Activo"
        INACTIVO = "Inactivo", "Inactivo"

    correo = models.EmailField("correo", unique=True, max_length=254)
    nombre = models.CharField("nombre", max_length=120)
    rol = models.CharField("rol", max_length=30, choices=Rol.choices, default=Rol.ASESOR)
    sede = models.CharField("sede", max_length=80, blank=True)
    estado = models.CharField(
        "estado", max_length=10, choices=Estado.choices, default=Estado.ACTIVO
    )

    is_staff = models.BooleanField("acceso al admin", default=False)
    creado_en = models.DateTimeField("creado en", auto_now_add=True)
    actualizado_en = models.DateTimeField("actualizado en", auto_now=True)

    objects = UsuarioManager()

    USERNAME_FIELD = "correo"
    REQUIRED_FIELDS = ["nombre"]

    class Meta:
        verbose_name = "usuario"
        verbose_name_plural = "usuarios"
        ordering = ["nombre"]

    def __str__(self):
        return f"{self.nombre} <{self.correo}>"

    def save(self, *args, **kwargs):
        self.correo = normalizar_correo(self.correo)
        return super().save(*args, **kwargs)

    @property
    def esta_activo(self) -> bool:
        """Estado del dominio (RN de la HU), distinto de `is_active` de Django."""
        return self.estado == self.Estado.ACTIVO

    @property
    def is_active(self) -> bool:
        return self.esta_activo

    @property
    def iniciales(self) -> str:
        partes = [p for p in self.nombre.split() if p]
        return "".join(p[0].upper() for p in partes[:2])

    def fijar_password(self, password: str) -> None:
        """Guarda la contraseña con hash tras validar la longitud mínima (RN-1)."""
        if password is None:
            self.set_unusable_password()
            return
        MinimumLengthValidator(settings.PASSWORD_LONGITUD_MINIMA).validate(password)
        self.set_password(password)

    def clean(self):
        super().clean()
        self.correo = normalizar_correo(self.correo)
        if not self.nombre.strip():
            raise ValidationError({"nombre": "El nombre es obligatorio."})


class SesionToken(models.Model):
    """Una sesión viva. El `jti` del JWT apunta aquí (design.md D1).

    Existe para lo que el JWT solo no puede: caducar por inactividad (RN-3) y quedar
    invalidada al cerrar sesión (CA-5).
    """

    jti = models.UUIDField("identificador", unique=True, db_index=True)
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="usuario",
        on_delete=models.CASCADE,
        related_name="sesiones",
    )
    creado_en = models.DateTimeField("creado en", auto_now_add=True)
    ultimo_uso = models.DateTimeField("último uso")
    revocado_en = models.DateTimeField("revocado en", null=True, blank=True)
    user_agent = models.CharField("agente", max_length=255, blank=True)

    class Meta:
        verbose_name = "sesión"
        verbose_name_plural = "sesiones"
        ordering = ["-creado_en"]
        indexes = [models.Index(fields=["usuario", "revocado_en"])]

    def __str__(self):
        return f"Sesión {self.jti} de {self.usuario_id}"

    @property
    def esta_revocada(self) -> bool:
        return self.revocado_en is not None


class IntentoIngreso(models.Model):
    """Registro de cada intento de ingreso, para el bloqueo de RN-2.

    El contador es por correo, tal como dice RN-2. La IP se guarda sólo para diagnóstico
    y no interviene en la decisión (design.md D3).
    """

    correo_normalizado = models.EmailField("correo", max_length=254)
    exito = models.BooleanField("éxito", default=False)
    creado_en = models.DateTimeField("creado en", auto_now_add=True)
    ip = models.GenericIPAddressField("IP", null=True, blank=True)

    class Meta:
        verbose_name = "intento de ingreso"
        verbose_name_plural = "intentos de ingreso"
        ordering = ["-creado_en"]
        indexes = [models.Index(fields=["correo_normalizado", "creado_en"])]

    def __str__(self):
        resultado = "éxito" if self.exito else "fallo"
        return f"{self.correo_normalizado} · {resultado}"
