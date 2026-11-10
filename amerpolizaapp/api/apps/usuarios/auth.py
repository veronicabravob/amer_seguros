"""Autenticador de Django Ninja.

El token llega en la cookie `HttpOnly` (design.md D2). Se acepta además
`Authorization: Bearer` para poder probar el API desde `/api/docs` y desde las pruebas.
"""

from django.conf import settings
from ninja.security import APIKeyCookie

from apps.core.excepciones import NoAutenticado

from . import services


class SesionAuth(APIKeyCookie):
    """Resuelve la sesión de la petición y la deja en `request.auth`."""

    param_name = settings.SESION_COOKIE_NOMBRE

    def __call__(self, request):
        # Ninja sólo mira la cookie; aquí se añade el encabezado como alternativa.
        token = request.COOKIES.get(self.param_name)
        if not token:
            encabezado = request.headers.get("Authorization", "")
            if encabezado.lower().startswith("bearer "):
                token = encabezado[7:].strip()
        if not token:
            return None
        return self.authenticate(request, token)

    def authenticate(self, request, key):
        try:
            activa = services.validar_token(key)
        except NoAutenticado:
            return None
        # El endpoint necesita la sesión para cerrarla y saber si toca reemitir la cookie.
        request.sesion_activa = activa
        return activa.usuario


sesion = SesionAuth()
