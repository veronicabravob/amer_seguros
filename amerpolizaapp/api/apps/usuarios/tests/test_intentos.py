"""Tareas 2.5, 3.3 y 3.4 — bloqueo por intentos (RN-2) y reglas de ingreso."""

import time
from datetime import timedelta

import pytest
from django.utils import timezone

from apps.core.excepciones import AccesoNegado, DemasiadosIntentos, NoAutenticado
from apps.usuarios import services
from apps.usuarios.models import IntentoIngreso

PASSWORD = "Amer2026*demo"
CORREO = "laura.gomez@amerseguros.com"


def _envejecer(correo, minutos):
    """Mueve hacia atrás los intentos de un correo, para simular el paso del tiempo."""
    IntentoIngreso.objects.filter(correo_normalizado=correo).update(
        creado_en=timezone.now() - timedelta(minutes=minutos)
    )


def _fallar(veces, correo=CORREO):
    for _ in range(veces):
        with pytest.raises(NoAutenticado):
            services.autenticar(correo, "contrasena-mala")


# --- 2.5 registro de intentos -------------------------------------------------


def test_un_ingreso_exitoso_queda_registrado(usuario):
    services.autenticar(CORREO, PASSWORD, ip="127.0.0.1")

    intento = IntentoIngreso.objects.get()
    assert intento.correo_normalizado == CORREO
    assert intento.exito is True
    assert intento.ip == "127.0.0.1"


def test_un_ingreso_fallido_queda_registrado(usuario):
    _fallar(1)

    intento = IntentoIngreso.objects.get()
    assert intento.exito is False


def test_un_correo_inexistente_tambien_queda_registrado(db):
    with pytest.raises(NoAutenticado):
        services.autenticar("nadie@amerseguros.com", PASSWORD)

    assert IntentoIngreso.objects.filter(correo_normalizado="nadie@amerseguros.com").count() == 1


def test_el_correo_del_intento_se_guarda_normalizado(usuario):
    with pytest.raises(NoAutenticado):
        services.autenticar("  LAURA.GOMEZ@AmerSeguros.com ", "mala")

    assert IntentoIngreso.objects.get().correo_normalizado == CORREO


# --- 3.3 conteo y bloqueo (RN-2) ---------------------------------------------


def test_cuatro_fallos_no_bloquean(usuario):
    _fallar(4)

    assert services.contar_intentos_fallidos(CORREO) == 4
    assert services.esta_bloqueado(CORREO) is False


def test_cinco_fallos_bloquean(usuario):
    _fallar(5)

    assert services.esta_bloqueado(CORREO) is True
    with pytest.raises(DemasiadosIntentos):
        services.autenticar(CORREO, "otra-mala")


def test_bloqueado_ni_siquiera_entra_con_la_contrasena_correcta(usuario):
    _fallar(5)

    with pytest.raises(DemasiadosIntentos):
        services.autenticar(CORREO, PASSWORD)


def test_el_bloqueo_vence_a_los_dieciseis_minutos(usuario):
    _fallar(5)
    _envejecer(CORREO, 16)

    usuario_autenticado = services.autenticar(CORREO, PASSWORD)

    assert usuario_autenticado == usuario


def test_a_los_catorce_minutos_sigue_bloqueado(usuario):
    _fallar(5)
    _envejecer(CORREO, 14)

    with pytest.raises(DemasiadosIntentos):
        services.autenticar(CORREO, PASSWORD)


def test_un_ingreso_exitoso_reinicia_el_contador(usuario):
    _fallar(3)
    services.autenticar(CORREO, PASSWORD)
    time.sleep(0.05)
    _fallar(4)

    assert services.contar_intentos_fallidos(CORREO) == 4
    assert services.esta_bloqueado(CORREO) is False


def test_el_bloqueo_es_por_correo_y_no_toca_a_los_demas(usuario, crear_usuario):
    otro_correo = "carlos.rincon@amerseguros.com"
    crear_usuario(correo=otro_correo, nombre="Carlos Rincón")
    _fallar(5)

    assert services.esta_bloqueado(CORREO) is True
    assert services.esta_bloqueado(otro_correo) is False
    assert services.autenticar(otro_correo, PASSWORD).correo == otro_correo


def test_un_intento_bloqueado_no_alarga_la_ventana(usuario):
    """Insistir mientras está bloqueado no debe reiniciar los 15 minutos."""
    _fallar(5)
    total_tras_el_bloqueo = IntentoIngreso.objects.count()

    for _ in range(3):
        with pytest.raises(DemasiadosIntentos):
            services.autenticar(CORREO, "mas-intentos")

    assert IntentoIngreso.objects.count() == total_tras_el_bloqueo


def test_los_fallos_viejos_salen_de_la_ventana(usuario):
    _fallar(5)
    _envejecer(CORREO, 20)

    assert services.contar_intentos_fallidos(CORREO) == 0


# --- 3.4 orden de las comprobaciones -----------------------------------------


def test_el_mensaje_es_el_mismo_para_correo_inexistente_y_contrasena_mala(usuario):
    with pytest.raises(NoAutenticado) as inexistente:
        services.autenticar("nadie@amerseguros.com", PASSWORD)
    with pytest.raises(NoAutenticado) as contrasena:
        services.autenticar(CORREO, "mala")

    assert inexistente.value.mensaje == contrasena.value.mensaje == services.MENSAJE_CREDENCIALES
    assert inexistente.value.codigo == contrasena.value.codigo == "credenciales_invalidas"


def test_una_cuenta_inactiva_se_rechaza_con_su_propio_mensaje(usuario_inactivo):
    with pytest.raises(AccesoNegado) as exc:
        services.autenticar(usuario_inactivo.correo, PASSWORD)

    assert exc.value.estado == 403
    assert exc.value.codigo == "cuenta_inactiva"
    assert exc.value.mensaje == services.MENSAJE_INACTIVA


def test_la_cuenta_inactiva_no_suma_intentos_fallidos(usuario_inactivo):
    for _ in range(6):
        with pytest.raises(AccesoNegado):
            services.autenticar(usuario_inactivo.correo, PASSWORD)

    assert services.esta_bloqueado(usuario_inactivo.correo) is False


def test_la_cuenta_inactiva_con_contrasena_mala_da_credenciales_invalidas(usuario_inactivo):
    """Primero se comprueban las credenciales: así no se revela que la cuenta existe."""
    with pytest.raises(NoAutenticado) as exc:
        services.autenticar(usuario_inactivo.correo, "mala")

    assert exc.value.codigo == "credenciales_invalidas"


def test_el_bloqueo_manda_sobre_la_cuenta_inactiva(usuario_inactivo):
    _fallar(5, correo=usuario_inactivo.correo)

    with pytest.raises(DemasiadosIntentos):
        services.autenticar(usuario_inactivo.correo, PASSWORD)


def test_el_correo_se_normaliza_al_autenticar(usuario):
    autenticado = services.autenticar("  LAURA.Gomez@AmerSeguros.COM  ", PASSWORD)

    assert autenticado == usuario
