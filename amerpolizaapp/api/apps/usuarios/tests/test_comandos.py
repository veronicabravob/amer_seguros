"""Tareas 4.7 y 4.8 — los comandos `seed` y `purgar_sesiones`."""

from datetime import timedelta
from io import StringIO

import pytest
from django.core.management import call_command
from django.core.management.base import CommandError
from django.utils import timezone

from apps.usuarios import services
from apps.usuarios.management.commands.seed import PASSWORD_DEMO
from apps.usuarios.models import SesionToken, Usuario


def _seed():
    call_command("seed", stdout=StringIO())


# --- 4.7 seed -----------------------------------------------------------------


def test_crea_las_cuatro_cuentas(db):
    _seed()

    assert Usuario.objects.count() == 4


def test_crea_una_cuenta_por_rol(db):
    _seed()

    roles = set(Usuario.objects.values_list("rol", flat=True))
    assert roles == {"Administrador", "Asesor comercial", "Cobros", "Recepción"}


def test_incluye_la_cuenta_inactiva_para_probar_ca3(db):
    _seed()

    paula = Usuario.objects.por_correo("paula.ruiz@amerseguros.com")
    assert paula.estado == Usuario.Estado.INACTIVO


def test_las_cuentas_ingresan_con_la_contrasena_documentada(db):
    _seed()

    usuario = services.autenticar("laura.gomez@amerseguros.com", PASSWORD_DEMO)

    assert usuario.nombre == "Laura Gómez"


def test_ejecutarlo_dos_veces_no_duplica_usuarios(db):
    _seed()
    _seed()

    assert Usuario.objects.count() == 4


def test_la_segunda_ejecucion_repone_los_datos_cambiados(db):
    _seed()
    laura = Usuario.objects.por_correo("laura.gomez@amerseguros.com")
    laura.sede = "Sogamoso"
    laura.save()

    _seed()

    laura.refresh_from_db()
    assert laura.sede == "Duitama"


def test_se_niega_a_correr_en_produccion(db, settings):
    settings.DEBUG = False
    settings.SETTINGS_MODULE = "config.settings.prod"

    with pytest.raises(CommandError, match="producción"):
        call_command("seed", stdout=StringIO())


def test_admite_otra_contrasena(db):
    call_command("seed", "--password", "OtraClave*2026", stdout=StringIO())

    assert services.autenticar("carlos.rincon@amerseguros.com", "OtraClave*2026")


# --- 4.8 purgar_sesiones ------------------------------------------------------


def test_borra_las_sesiones_revocadas_hace_mucho(usuario):
    _, sesion = services.emitir_token(usuario)
    services.cerrar_sesion(sesion.jti)
    SesionToken.objects.filter(pk=sesion.pk).update(revocado_en=timezone.now() - timedelta(days=40))

    call_command("purgar_sesiones", stdout=StringIO())

    assert not SesionToken.objects.filter(pk=sesion.pk).exists()


def test_borra_las_sesiones_caducadas_hace_mucho(usuario):
    _, sesion = services.emitir_token(usuario)
    SesionToken.objects.filter(pk=sesion.pk).update(ultimo_uso=timezone.now() - timedelta(days=40))

    call_command("purgar_sesiones", stdout=StringIO())

    assert not SesionToken.objects.filter(pk=sesion.pk).exists()


def test_conserva_las_sesiones_recientes(usuario):
    _, viva = services.emitir_token(usuario)
    _, revocada_hoy = services.emitir_token(usuario)
    services.cerrar_sesion(revocada_hoy.jti)

    call_command("purgar_sesiones", stdout=StringIO())

    assert SesionToken.objects.filter(pk=viva.pk).exists()
    assert SesionToken.objects.filter(pk=revocada_hoy.pk).exists()


def test_admite_otro_plazo_de_retencion(usuario):
    _, sesion = services.emitir_token(usuario)
    SesionToken.objects.filter(pk=sesion.pk).update(ultimo_uso=timezone.now() - timedelta(days=3))

    call_command("purgar_sesiones", "--dias", "2", stdout=StringIO())

    assert not SesionToken.objects.filter(pk=sesion.pk).exists()


def test_informa_cuantas_borro(usuario):
    _, sesion = services.emitir_token(usuario)
    SesionToken.objects.filter(pk=sesion.pk).update(ultimo_uso=timezone.now() - timedelta(days=40))
    salida = StringIO()

    call_command("purgar_sesiones", stdout=salida)

    assert "Sesiones borradas: 1" in salida.getvalue()
