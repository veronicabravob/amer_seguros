"""Cabeceras de las respuestas del API.

`no-store` evita que el navegador reutilice una respuesta con datos de la agencia después
de cerrar sesión (CA-5).
"""


class SinCacheApiMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if request.path.startswith("/api/"):
            response["Cache-Control"] = "no-store"
        return response
