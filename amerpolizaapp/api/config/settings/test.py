"""Entorno de pruebas."""

from .base import *  # noqa: F403

DEBUG = False
ALLOWED_HOSTS = ["testserver", "localhost", "127.0.0.1"]

# HS256 pide al menos 32 bytes de clave (RFC 7518).
SECRET_KEY = "clave-de-pruebas-con-al-menos-32-bytes"  # noqa: S105

SESION_COOKIE_SECURE = False

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}
