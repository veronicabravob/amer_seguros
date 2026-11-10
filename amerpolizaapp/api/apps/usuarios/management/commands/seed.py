"""Datos semilla de la agencia.

Las cuentas y su contraseña ficticia están documentadas en `docs/DATOS.md`. Son datos
inventados: ningún dato personal real entra al repositorio.
"""

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from apps.usuarios.models import Usuario

PASSWORD_DEMO = "Amer2026*demo"  # noqa: S105 — ficticia y documentada en docs/DATOS.md

CUENTAS = [
    {
        "correo": "laura.gomez@amerseguros.com",
        "nombre": "Laura Gómez",
        "rol": Usuario.Rol.ADMINISTRADOR,
        "sede": "Duitama",
        "estado": Usuario.Estado.ACTIVO,
    },
    {
        "correo": "carlos.rincon@amerseguros.com",
        "nombre": "Carlos Rincón",
        "rol": Usuario.Rol.ASESOR,
        "sede": "Tunja",
        "estado": Usuario.Estado.ACTIVO,
    },
    {
        "correo": "julian.castro@amerseguros.com",
        "nombre": "Julián Castro",
        "rol": Usuario.Rol.COBROS,
        "sede": "Duitama",
        "estado": Usuario.Estado.ACTIVO,
    },
    {
        # Cuenta inactiva: es la que permite probar CA-3.
        "correo": "paula.ruiz@amerseguros.com",
        "nombre": "Paula Ruiz",
        "rol": Usuario.Rol.RECEPCION,
        "sede": "Duitama",
        "estado": Usuario.Estado.INACTIVO,
    },
]


class Command(BaseCommand):
    help = "Crea las cuentas de demostración. Idempotente y sólo fuera de producción."

    def add_arguments(self, parser):
        parser.add_argument(
            "--password",
            default=PASSWORD_DEMO,
            help="Contraseña de las cuentas de demostración.",
        )

    def handle(self, *args, **opciones):
        if not settings.DEBUG and settings.SETTINGS_MODULE.endswith("prod"):
            raise CommandError("La semilla no se ejecuta en producción.")

        password = opciones["password"]
        creadas = actualizadas = 0

        for datos in CUENTAS:
            usuario = Usuario.objects.por_correo(datos["correo"])
            if usuario is None:
                Usuario.objects.create_user(password=password, **datos)
                creadas += 1
                continue
            # Idempotente: se reponen los campos por si alguien los cambió probando.
            for campo, valor in datos.items():
                setattr(usuario, campo, valor)
            usuario.fijar_password(password)
            usuario.save()
            actualizadas += 1

        self.stdout.write(
            self.style.SUCCESS(f"Cuentas creadas: {creadas} · actualizadas: {actualizadas}")
        )
