"""Endpoints de sesión: ingreso, cierre y datos del usuario autenticado."""

from django.http import HttpResponse
from ninja import Router, Status

from . import services
from .auth import sesion
from .cookies import borrar_cookie, fijar_cookie
from .schemas import ErrorOut, LoginIn, LoginOut, MensajeOut, UsuarioOut

router = Router(tags=["auth"])


def _ip(request) -> str | None:
    return request.META.get("REMOTE_ADDR")


@router.post(
    "/login",
    auth=None,
    response={200: LoginOut, 401: ErrorOut, 403: ErrorOut, 429: ErrorOut},
    summary="Ingresar con correo y contraseña",
)
def login(request, data: LoginIn, response: HttpResponse):
    """Único endpoint del API que no exige sesión."""
    usuario = services.autenticar(data.correo, data.password, ip=_ip(request))
    token, _ = services.emitir_token(usuario, user_agent=request.headers.get("User-Agent", ""))
    fijar_cookie(response, token)
    return Status(200, {"token": token, "usuario": usuario})


@router.post(
    "/logout",
    auth=sesion,
    response={200: MensajeOut, 401: ErrorOut},
    summary="Cerrar la sesión actual",
)
def logout(request, response: HttpResponse):
    activa = request.sesion_activa
    services.cerrar_sesion(activa.sesion.jti)
    # Ya no hay sesión que reemitir: la cookie se borra y el token queda inservible.
    activa.reemitir = False
    borrar_cookie(response)
    return Status(200, {"mensaje": "Sesión cerrada"})


@router.get(
    "/me",
    auth=sesion,
    response={200: UsuarioOut, 401: ErrorOut},
    summary="Datos del usuario autenticado",
)
def me(request):
    return Status(200, request.auth)
