"""Modelos base del proyecto.

Todo modelo del dominio hereda de `ModeloAuditable` para que quede registrado quién creó
y quién modificó cada fila, y cuándo.
"""

from django.conf import settings
from django.db import models


class ModeloAuditable(models.Model):
    """Base con las cuatro columnas de auditoría del proyecto."""

    creado_en = models.DateTimeField("creado en", auto_now_add=True)
    actualizado_en = models.DateTimeField("actualizado en", auto_now=True)
    creado_por = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="creado por",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="%(app_label)s_%(class)s_creados",
    )
    actualizado_por = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="actualizado por",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="%(app_label)s_%(class)s_actualizados",
    )

    class Meta:
        abstract = True
