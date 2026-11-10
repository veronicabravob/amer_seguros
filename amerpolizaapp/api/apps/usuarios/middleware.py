"""Renovación de la cookie de sesión.

Si al JWT le queda menos del margen configurado y la sesión sigue viva, se reemite. Así la
caducidad efectiva es la inactividad de RN-3 y no la vigencia del JWT.
"""

from . import services
from .cookies import fijar_cookie


class ReemisionSesionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        activa = getattr(request, "sesion_activa", None)
        if activa is not None and activa.reemitir and not activa.sesion.esta_revocada:
            fijar_cookie(response, services.reemitir_token(activa.sesion))
        return response
