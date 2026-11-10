"""Configuración común a todos los entornos."""

import os
from datetime import timedelta
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "")

DEBUG = False
ALLOWED_HOSTS: list[str] = []

INSTALLED_APPS = [
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "apps.core",
    "apps.usuarios",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "apps.core.middleware.SinCacheApiMiddleware",
    "apps.usuarios.middleware.ReemisionSesionMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# El modelo de usuario se declara desde la primera migración: cambiarlo después es caro.
AUTH_USER_MODEL = "usuarios.Usuario"

# Argon2 primero (RN-1): es el hasher recomendado por Django.
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
]

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
]

LANGUAGE_CODE = "es-co"
TIME_ZONE = "America/Bogota"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# --- Sesión (HU-001) ---------------------------------------------------------
# RN-3: el token caduca a las 8 horas de inactividad.
SESION_INACTIVIDAD = timedelta(hours=8)
# Margen para reemitir la cookie antes de que el JWT expire (design.md D1).
SESION_MARGEN_REEMISION = timedelta(hours=1)
# Amortiguación de la escritura de `ultimo_uso`: como máximo un UPDATE por minuto.
SESION_AMORTIGUACION_USO = timedelta(seconds=60)
SESION_COOKIE_NOMBRE = "sesion"
# En desarrollo la SPA llega por el proxy de Vite, mismo origen: no hace falta Secure.
SESION_COOKIE_SECURE = True
SESION_COOKIE_SAMESITE = "Lax"
# Días que se conservan las sesiones revocadas o caducadas antes de purgarlas.
SESION_RETENCION_DIAS = 30

# RN-2: 5 intentos fallidos del mismo correo bloquean 15 minutos.
INGRESO_MAX_INTENTOS = 5
INGRESO_VENTANA_BLOQUEO = timedelta(minutes=15)

# RN-1: longitud mínima de la contraseña.
PASSWORD_LONGITUD_MINIMA = 8
