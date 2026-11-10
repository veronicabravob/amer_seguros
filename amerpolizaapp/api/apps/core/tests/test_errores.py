"""Tarea 1.3 — las excepciones de negocio se traducen a la respuesta correcta."""

import json

import pytest
from django.test import RequestFactory

from apps.core.excepciones import AccesoNegado, DemasiadosIntentos, NoAutenticado, ReglaDeNegocio
from config.api import entrada_invalida, regla_de_negocio


@pytest.fixture
def peticion():
    return RequestFactory().post("/api/lo-que-sea")


def test_regla_de_negocio_responde_409_con_codigo_mensaje_y_campo(peticion):
    excepcion = ReglaDeNegocio("prima_negativa", "La prima no puede ser negativa", "prima")

    respuesta = regla_de_negocio(peticion, excepcion)
    cuerpo = json.loads(respuesta.content)

    assert respuesta.status_code == 409
    assert cuerpo == {
        "codigo": "prima_negativa",
        "mensaje": "La prima no puede ser negativa",
        "campo": "prima",
    }


@pytest.mark.parametrize(
    ("excepcion", "estado"),
    [
        (NoAutenticado("sin_sesion", "Sesión no válida"), 401),
        (AccesoNegado("cuenta_inactiva", "Cuenta inactiva"), 403),
        (DemasiadosIntentos("demasiados_intentos", "Demasiados intentos"), 429),
    ],
)
def test_cada_subclase_fija_su_propio_estado(peticion, excepcion, estado):
    respuesta = regla_de_negocio(peticion, excepcion)

    assert respuesta.status_code == estado
    assert json.loads(respuesta.content)["codigo"] == excepcion.codigo


def test_campo_es_opcional(peticion):
    respuesta = regla_de_negocio(peticion, ReglaDeNegocio("x", "y"))

    assert json.loads(respuesta.content)["campo"] is None


def test_validacion_de_entrada_responde_422(peticion):
    class ErrorFalso:
        errors = [{"loc": ["body", "correo"], "msg": "field required"}]

    respuesta = entrada_invalida(peticion, ErrorFalso())
    cuerpo = json.loads(respuesta.content)

    assert respuesta.status_code == 422
    assert cuerpo["codigo"] == "entrada_invalida"
    assert cuerpo["detalle"][0]["loc"] == ["body", "correo"]


@pytest.mark.django_db
def test_entrada_invalida_desde_el_api_real(client):
    """Un cuerpo sin los campos obligatorios entra por el manejador y sale como 422."""
    respuesta = client.post(
        "/api/auth/login", data=json.dumps({"correo": "a@b.co"}), content_type="application/json"
    )

    assert respuesta.status_code == 422
    assert respuesta.json()["codigo"] == "entrada_invalida"
