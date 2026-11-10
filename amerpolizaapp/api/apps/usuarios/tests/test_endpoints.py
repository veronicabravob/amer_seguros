"""Tareas 4.1 a 4.6 — los tres endpoints de sesión."""

import json
from datetime import timedelta

import jwt
import pytest
from django.conf import settings
from django.utils import timezone

from apps.usuarios import services
from apps.usuarios.models import SesionToken, Usuario
from apps.usuarios.schemas import UsuarioOut

PASSWORD = "Amer2026*demo"
CORREO = "laura.gomez@amerseguros.com"
COOKIE = settings.SESION_COOKIE_NOMBRE


def _login(client, correo=CORREO, password=PASSWORD):
    return client.post(
        "/api/auth/login",
        data=json.dumps({"correo": correo, "password": password}),
        content_type="application/json",
    )


# --- 4.1 esquemas -------------------------------------------------------------


def test_el_esquema_de_salida_no_expone_la_contrasena():
    campos = set(UsuarioOut.model_fields)

    assert "password" not in campos
    assert not any("password" in c or "hash" in c for c in campos)
    assert {"nombre", "correo", "rol", "sede", "estado"} <= campos


def test_el_login_no_devuelve_la_contrasena_en_el_cuerpo(client, usuario):
    respuesta = _login(client)

    assert "password" not in json.dumps(respuesta.json())


# --- 4.2 login ----------------------------------------------------------------


def test_login_correcto_devuelve_token_y_usuario(client, usuario):
    respuesta = _login(client)
    cuerpo = respuesta.json()

    assert respuesta.status_code == 200
    assert cuerpo["token"]
    assert cuerpo["usuario"]["nombre"] == "Laura Gómez"
    assert cuerpo["usuario"]["rol"] == "Administrador"
    assert cuerpo["usuario"]["sede"] == "Duitama"


def test_login_correcto_fija_la_cookie_de_sesion(client, usuario):
    respuesta = _login(client)
    cookie = respuesta.cookies[COOKIE]

    assert cookie.value
    assert cookie["httponly"] is True
    assert cookie["samesite"] == "Lax"
    assert cookie["path"] == "/"


def test_en_desarrollo_la_cookie_no_exige_https(client, usuario, settings):
    settings.SESION_COOKIE_SECURE = False

    respuesta = _login(client)

    assert respuesta.cookies[COOKIE]["secure"] == ""


def test_fuera_de_desarrollo_la_cookie_exige_https(client, usuario, settings):
    settings.SESION_COOKIE_SECURE = True

    respuesta = _login(client)

    assert respuesta.cookies[COOKIE]["secure"] is True


def test_la_cookie_caduca_con_la_sesion(client, usuario):
    respuesta = _login(client)

    assert respuesta.cookies[COOKIE]["max-age"] == int(settings.SESION_INACTIVIDAD.total_seconds())


def test_login_con_correo_inexistente_responde_401(client, db):
    respuesta = _login(client, correo="nadie@amerseguros.com")

    assert respuesta.status_code == 401
    assert respuesta.json()["mensaje"] == "Correo o contraseña incorrectos"
    assert COOKIE not in respuesta.cookies


def test_login_con_contrasena_mala_responde_401_con_el_mismo_mensaje(client, usuario):
    respuesta = _login(client, password="mala")

    assert respuesta.status_code == 401
    assert respuesta.json()["mensaje"] == "Correo o contraseña incorrectos"


def test_login_de_cuenta_inactiva_responde_403(client, usuario_inactivo):
    respuesta = _login(client, correo=usuario_inactivo.correo)

    assert respuesta.status_code == 403
    assert respuesta.json()["mensaje"] == "Tu cuenta está inactiva, contacta al administrador"
    assert COOKIE not in respuesta.cookies


def test_login_bloqueado_responde_429(client, usuario):
    for _ in range(5):
        _login(client, password="mala")

    respuesta = _login(client)

    assert respuesta.status_code == 429
    assert respuesta.json()["mensaje"] == "Demasiados intentos. Intenta de nuevo en 15 minutos"


def test_el_login_no_exige_sesion(client, usuario):
    """Es el único endpoint abierto del API."""
    assert _login(client).status_code == 200


def test_el_correo_se_normaliza_en_el_login(client, usuario):
    respuesta = _login(client, correo="  LAURA.Gomez@AmerSeguros.COM  ")

    assert respuesta.status_code == 200


# --- 4.3 autenticador ---------------------------------------------------------


def test_la_cookie_autentica(client, usuario):
    _login(client)

    respuesta = client.get("/api/auth/me")

    assert respuesta.status_code == 200


def test_el_encabezado_bearer_autentica(client, usuario):
    token, _ = services.emitir_token(usuario)

    respuesta = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})

    assert respuesta.status_code == 200
    assert respuesta.json()["correo"] == CORREO


def test_sin_cookie_ni_encabezado_responde_401(client, db):
    respuesta = client.get("/api/auth/me")

    assert respuesta.status_code == 401
    assert respuesta.json()["codigo"] == "sin_sesion"


def test_un_token_manipulado_responde_401_y_no_filtra_datos(client, usuario):
    token, _ = services.emitir_token(usuario)
    manipulado = token[:-4] + "xxxx"

    respuesta = client.get("/api/auth/me", headers={"Authorization": f"Bearer {manipulado}"})

    assert respuesta.status_code == 401
    assert "correo" not in respuesta.json()


def test_una_cookie_con_basura_responde_401(client, usuario):
    client.cookies[COOKIE] = "no-es-un-token"

    respuesta = client.get("/api/auth/me")

    assert respuesta.status_code == 401


def test_la_sesion_caducada_responde_401(client, usuario):
    token, sesion = services.emitir_token(usuario)
    SesionToken.objects.filter(pk=sesion.pk).update(ultimo_uso=timezone.now() - timedelta(hours=9))

    respuesta = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})

    assert respuesta.status_code == 401


def test_la_cuenta_desactivada_con_la_sesion_abierta_responde_401(client, usuario):
    token, _ = services.emitir_token(usuario)

    usuario.estado = Usuario.Estado.INACTIVO
    usuario.save()

    respuesta = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})

    assert respuesta.status_code == 401


# --- 4.4 me y logout ----------------------------------------------------------


def test_me_devuelve_al_usuario_del_token(client, usuario):
    _login(client)

    cuerpo = client.get("/api/auth/me").json()

    assert cuerpo["correo"] == CORREO
    assert cuerpo["nombre"] == "Laura Gómez"
    assert cuerpo["rol"] == "Administrador"
    assert cuerpo["estado"] == "Activo"
    assert cuerpo["iniciales"] == "LG"


def test_me_no_devuelve_la_contrasena(client, usuario):
    _login(client)

    cuerpo = client.get("/api/auth/me").json()

    assert "password" not in cuerpo


def test_logout_responde_200_y_borra_la_cookie(client, usuario):
    _login(client)

    respuesta = client.post("/api/auth/logout")

    assert respuesta.status_code == 200
    assert respuesta.cookies[COOKIE].value == ""


def test_el_token_usado_deja_de_servir_tras_el_logout(client, usuario):
    token, _ = services.emitir_token(usuario)
    encabezado = {"Authorization": f"Bearer {token}"}

    client.post("/api/auth/logout", headers=encabezado)

    assert client.get("/api/auth/me", headers=encabezado).status_code == 401


def test_logout_no_toca_la_otra_sesion_del_mismo_usuario(client, usuario):
    token_uno, _ = services.emitir_token(usuario)
    token_dos, _ = services.emitir_token(usuario)

    client.post("/api/auth/logout", headers={"Authorization": f"Bearer {token_uno}"})

    respuesta = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token_dos}"})
    assert respuesta.status_code == 200


def test_logout_sin_sesion_responde_401(client, db):
    assert client.post("/api/auth/logout").status_code == 401


# --- 4.5 reemisión de la cookie ----------------------------------------------


def test_no_reemite_la_cookie_en_una_peticion_recien_autenticada(client, usuario):
    token, _ = services.emitir_token(usuario)

    respuesta = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})

    assert COOKIE not in respuesta.cookies


def test_reemite_la_cookie_cuando_al_token_le_queda_menos_de_una_hora(client, usuario):
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

    respuesta = client.get("/api/auth/me", headers={"Authorization": f"Bearer {por_vencer}"})

    assert COOKIE in respuesta.cookies
    nuevo = respuesta.cookies[COOKIE].value
    datos = jwt.decode(nuevo, settings.SECRET_KEY, algorithms=["HS256"])
    assert datos["jti"] == str(sesion.jti)
    assert datos["exp"] > int((timezone.now() + timedelta(hours=7)).timestamp())


def test_el_logout_no_reemite_la_cookie(client, usuario):
    """Al cerrar sesión la cookie se borra; no debe volver a fijarse."""
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

    respuesta = client.post("/api/auth/logout", headers={"Authorization": f"Bearer {por_vencer}"})

    assert respuesta.cookies[COOKIE].value == ""


# --- 4.6 cabeceras ------------------------------------------------------------


@pytest.mark.parametrize("ruta", ["/api/auth/me", "/api/auth/logout"])
def test_las_respuestas_del_api_no_se_guardan_en_cache(client, usuario, ruta):
    _login(client)

    respuesta = client.get(ruta) if ruta.endswith("me") else client.post(ruta)

    assert respuesta["Cache-Control"] == "no-store"


def test_la_respuesta_del_login_tampoco_se_guarda_en_cache(client, usuario):
    assert _login(client)["Cache-Control"] == "no-store"
