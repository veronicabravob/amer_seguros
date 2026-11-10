"""Tareas 2.1, 2.2 y 2.3 — el modelo de usuario y la contraseña (RN-1)."""

import pytest
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db.utils import IntegrityError

from apps.usuarios.models import Usuario, normalizar_correo

PASSWORD = "Amer2026*demo"


# --- 2.1 correo como identificador -------------------------------------------


def test_el_correo_se_guarda_en_minusculas(crear_usuario):
    usuario = crear_usuario(correo="Laura.Gomez@AmerSeguros.com")

    assert usuario.correo == "laura.gomez@amerseguros.com"


def test_el_correo_se_guarda_sin_espacios_sobrantes(crear_usuario):
    usuario = crear_usuario(correo="  laura.gomez@amerseguros.com  ")

    assert usuario.correo == "laura.gomez@amerseguros.com"


def test_el_correo_es_unico_sin_distinguir_mayusculas(crear_usuario):
    crear_usuario(correo="laura.gomez@amerseguros.com")

    with pytest.raises(IntegrityError):
        crear_usuario(correo="LAURA.GOMEZ@amerseguros.com")


def test_se_busca_por_correo_sin_distinguir_mayusculas(crear_usuario):
    creado = crear_usuario(correo="laura.gomez@amerseguros.com")

    encontrado = Usuario.objects.por_correo("  LAURA.Gomez@AmerSeguros.COM ")

    assert encontrado == creado


def test_buscar_un_correo_inexistente_devuelve_none(db):
    assert Usuario.objects.por_correo("nadie@amerseguros.com") is None


def test_el_identificador_de_sesion_es_el_correo():
    assert Usuario.USERNAME_FIELD == "correo"


def test_el_correo_es_obligatorio(db):
    with pytest.raises(ValueError):
        Usuario.objects.create_user(correo="", password=PASSWORD, nombre="Sin correo")


@pytest.mark.parametrize(
    ("nombre", "esperadas"),
    [("Laura Gómez", "LG"), ("Carlos Andrés Rincón Díaz", "CA"), ("Ana", "A")],
)
def test_las_iniciales_salen_del_nombre(crear_usuario, nombre, esperadas):
    usuario = crear_usuario(nombre=nombre)

    assert usuario.iniciales == esperadas


def test_estado_activo_e_inactivo(crear_usuario):
    activo = crear_usuario()
    inactivo = crear_usuario(correo="otra@amerseguros.com", estado=Usuario.Estado.INACTIVO)

    assert activo.esta_activo is True
    assert inactivo.esta_activo is False


def test_el_nombre_no_puede_quedar_vacio(crear_usuario):
    usuario = crear_usuario()
    usuario.nombre = "   "

    with pytest.raises(ValidationError):
        usuario.clean()


def test_normalizar_correo_tolera_none():
    assert normalizar_correo(None) == ""


# --- 2.2 hash de la contraseña (RN-1) ----------------------------------------


def test_la_contrasena_no_se_guarda_en_texto_plano(crear_usuario):
    usuario = crear_usuario(password=PASSWORD)

    assert usuario.password != PASSWORD
    assert PASSWORD not in usuario.password


def test_la_contrasena_se_guarda_con_argon2(crear_usuario):
    usuario = crear_usuario(password=PASSWORD)

    assert usuario.password.startswith("argon2")


def test_argon2_es_el_primer_hasher_configurado():
    assert settings.PASSWORD_HASHERS[0].endswith("Argon2PasswordHasher")


def test_check_password_valida_la_contrasena_correcta(crear_usuario):
    usuario = crear_usuario(password=PASSWORD)

    assert usuario.check_password(PASSWORD) is True
    assert usuario.check_password("otra-cosa-distinta") is False


def test_dos_usuarios_con_la_misma_contrasena_tienen_hashes_distintos(crear_usuario):
    uno = crear_usuario(correo="uno@amerseguros.com", password=PASSWORD)
    otro = crear_usuario(correo="otro@amerseguros.com", password=PASSWORD)

    assert uno.password != otro.password


# --- 2.3 longitud mínima (RN-1) ----------------------------------------------


def test_una_contrasena_de_siete_caracteres_se_rechaza(db):
    usuario = Usuario(correo="corta@amerseguros.com", nombre="Corta")

    with pytest.raises(ValidationError):
        usuario.fijar_password("1234567")


def test_una_contrasena_de_ocho_caracteres_se_acepta(db):
    usuario = Usuario(correo="justa@amerseguros.com", nombre="Justa")

    usuario.fijar_password("12345678")

    assert usuario.check_password("12345678") is True


def test_el_minimo_configurado_son_ocho_caracteres():
    assert settings.PASSWORD_LONGITUD_MINIMA == 8


def test_crear_usuario_con_contrasena_corta_falla(db):
    with pytest.raises(ValidationError):
        Usuario.objects.create_user(
            correo="corta@amerseguros.com", password="corta12", nombre="Corta"
        )
