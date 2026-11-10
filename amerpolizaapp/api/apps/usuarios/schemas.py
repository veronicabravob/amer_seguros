"""Esquemas de entrada y salida de la sesión.

Nunca se devuelve el modelo crudo: `UsuarioOut` fija exactamente qué sale, y por eso ni la
contraseña ni su hash pueden escaparse en una respuesta.
"""

from ninja import Schema


class LoginIn(Schema):
    correo: str
    password: str


class UsuarioOut(Schema):
    nombre: str
    correo: str
    rol: str
    sede: str
    estado: str
    iniciales: str


class LoginOut(Schema):
    token: str
    usuario: UsuarioOut


class ErrorOut(Schema):
    codigo: str
    mensaje: str
    campo: str | None = None


class MensajeOut(Schema):
    mensaje: str
