"""Tarea 1.2 — el modelo base estampa las fechas de auditoría al guardar."""

import time

import pytest
from django.db import connection, models

from apps.core.models import ModeloAuditable


class CosaAuditada(ModeloAuditable):
    """Modelo concreto que sólo existe para probar el base.

    Vive en el módulo de pruebas, así que no entra en las migraciones del proyecto; la
    tabla se crea y se borra en la fixture.
    """

    nombre = models.CharField(max_length=50)

    class Meta:
        app_label = "core"


@pytest.fixture
def tabla_de_prueba(transactional_db):
    """Garantiza la tabla del modelo de prueba.

    Django la crea sola mientras `core` no tenga migraciones propias; en cuanto las tenga,
    la crea esta fixture. Hace falta `transactional_db` porque SQLite no deja crear tablas
    dentro de la transacción en la que pytest-django envuelve cada prueba.
    """
    tabla = CosaAuditada._meta.db_table
    creada_aqui = tabla not in connection.introspection.table_names()
    if creada_aqui:
        with connection.schema_editor() as editor:
            editor.create_model(CosaAuditada)
    try:
        yield
    finally:
        if creada_aqui:
            with connection.schema_editor() as editor:
                editor.delete_model(CosaAuditada)


def test_estampa_creado_en_y_actualizado_en(tabla_de_prueba):
    cosa = CosaAuditada.objects.create(nombre="primera")

    assert cosa.creado_en is not None
    assert cosa.actualizado_en is not None


def test_actualizado_en_avanza_al_guardar_de_nuevo(tabla_de_prueba):
    cosa = CosaAuditada.objects.create(nombre="primera")
    primera_marca = cosa.actualizado_en

    # El reloj de Windows avanza a saltos de ~16 ms: sin esta pausa los dos guardados
    # pueden caer en el mismo instante y la prueba no comprobaría nada.
    time.sleep(0.05)
    cosa.nombre = "cambiada"
    cosa.save()

    assert cosa.actualizado_en > primera_marca


def test_tiene_las_cuatro_columnas_de_auditoria():
    campos = {f.name for f in CosaAuditada._meta.get_fields()}

    assert {"creado_en", "actualizado_en", "creado_por", "actualizado_por"} <= campos


def test_creado_por_y_actualizado_por_admiten_nulo(tabla_de_prueba):
    cosa = CosaAuditada.objects.create(nombre="sin autor")

    assert cosa.creado_por is None
    assert cosa.actualizado_por is None


def test_el_modelo_base_es_abstracto():
    assert ModeloAuditable._meta.abstract
