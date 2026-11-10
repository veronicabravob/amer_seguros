"""Fixtures comunes de las pruebas del backend."""

import pytest

from apps.usuarios.models import Usuario

PASSWORD = "Amer2026*demo"


@pytest.fixture
def crear_usuario(db):
    def _crear(correo="laura.gomez@amerseguros.com", password=PASSWORD, **extra):
        extra.setdefault("nombre", "Laura Gómez")
        extra.setdefault("rol", Usuario.Rol.ADMINISTRADOR)
        extra.setdefault("sede", "Duitama")
        extra.setdefault("estado", Usuario.Estado.ACTIVO)
        return Usuario.objects.create_user(correo=correo, password=password, **extra)

    return _crear


@pytest.fixture
def usuario(crear_usuario):
    return crear_usuario()


@pytest.fixture
def usuario_inactivo(crear_usuario):
    return crear_usuario(
        correo="paula.ruiz@amerseguros.com",
        nombre="Paula Ruiz",
        rol=Usuario.Rol.RECEPCION,
        estado=Usuario.Estado.INACTIVO,
    )
