"""Tarea 1.4 — el API está montado en /api y exige sesión por defecto (RN-4)."""

import pytest


def test_la_documentacion_responde(client):
    respuesta = client.get("/api/docs")

    assert respuesta.status_code == 200


def test_el_esquema_openapi_responde(client):
    respuesta = client.get("/api/openapi.json")
    esquema = respuesta.json()

    assert respuesta.status_code == 200
    assert "/api/auth/login" in esquema["paths"]
    assert "/api/auth/logout" in esquema["paths"]
    assert "/api/auth/me" in esquema["paths"]


@pytest.mark.django_db
def test_un_endpoint_protegido_sin_token_responde_401(client):
    respuesta = client.get("/api/auth/me")

    assert respuesta.status_code == 401
    assert respuesta.json()["codigo"] == "sin_sesion"


def test_el_api_exige_sesion_por_defecto():
    """La instancia nace protegida: un router nuevo no queda abierto por descuido."""
    from config.api import api

    assert api.auth is not None
