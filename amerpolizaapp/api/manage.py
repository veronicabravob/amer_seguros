#!/usr/bin/env python
"""Utilidad de línea de comandos de Django para AMER Pólizas."""

import os
import sys


def main():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:  # pragma: no cover - sólo si falta el entorno
        raise ImportError(
            "No se pudo importar Django. ¿Está instalado y activado el entorno virtual?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
