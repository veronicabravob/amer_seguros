"""Cookie de sesión (design.md D2).

`HttpOnly` para que ningún script de la SPA pueda leer el token, y `SameSite=Lax` porque
la SPA y el API se sirven en el mismo origen.
"""

from django.conf import settings
from django.http import HttpResponse


def fijar_cookie(response: HttpResponse, token: str) -> None:
    response.set_cookie(
        settings.SESION_COOKIE_NOMBRE,
        token,
        max_age=int(settings.SESION_INACTIVIDAD.total_seconds()),
        httponly=True,
        secure=settings.SESION_COOKIE_SECURE,
        samesite=settings.SESION_COOKIE_SAMESITE,
        path="/",
    )


def borrar_cookie(response: HttpResponse) -> None:
    response.delete_cookie(
        settings.SESION_COOKIE_NOMBRE,
        path="/",
        samesite=settings.SESION_COOKIE_SAMESITE,
    )
