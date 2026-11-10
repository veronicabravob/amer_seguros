"""Limpieza de sesiones viejas.

La tabla de sesiones crece con cada ingreso; esto la mantiene a raya. No está programado:
se ejecuta a mano o desde el planificador del despliegue.
"""

from django.conf import settings
from django.core.management.base import BaseCommand

from apps.usuarios import services


class Command(BaseCommand):
    help = "Borra las sesiones revocadas o caducadas hace más de los días indicados."

    def add_arguments(self, parser):
        parser.add_argument(
            "--dias",
            type=int,
            default=settings.SESION_RETENCION_DIAS,
            help="Días de retención (por omisión, los de la configuración).",
        )

    def handle(self, *args, **opciones):
        borradas = services.purgar_sesiones(opciones["dias"])

        self.stdout.write(self.style.SUCCESS(f"Sesiones borradas: {borradas}"))
