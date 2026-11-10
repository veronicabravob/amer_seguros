"""Instancia de Django Ninja y traducción de errores.

Todos los routers exigen sesión por defecto (RN-4); los endpoints públicos lo declaran
explícitamente con `auth=None`.
"""

from ninja import NinjaAPI
from ninja.errors import AuthenticationError, ValidationError

from apps.core.excepciones import ReglaDeNegocio
from apps.usuarios.api import router as auth_router
from apps.usuarios.auth import sesion

api = NinjaAPI(
    title="AMER Pólizas API",
    version="1.0.0",
    description="API de la agencia. Toda petición sin sesión válida responde 401.",
    auth=sesion,
)

api.add_router("/auth", auth_router)


@api.exception_handler(ReglaDeNegocio)
def regla_de_negocio(request, exc: ReglaDeNegocio):
    """Una regla del dominio impidió la operación: 409, o el estado que fije la subclase."""
    return api.create_response(request, exc.como_dict(), status=exc.estado)


@api.exception_handler(AuthenticationError)
def sin_sesion(request, exc):
    """RN-4: toda petición sin token válido responde 401."""
    return api.create_response(
        request,
        {"codigo": "sin_sesion", "mensaje": "Sesión no válida", "campo": None},
        status=401,
    )


@api.exception_handler(ValidationError)
def entrada_invalida(request, exc: ValidationError):
    """La entrada no cumple el esquema: 422 con el detalle de Ninja."""
    return api.create_response(
        request,
        {
            "codigo": "entrada_invalida",
            "mensaje": "Revisa los datos enviados",
            "campo": None,
            "detalle": exc.errors,
        },
        status=422,
    )
