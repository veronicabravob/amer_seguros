# HU-028 — Archivos adjuntos de la póliza

|  |  |
|---|---|
| **Épica** | E8 — Expediente de la póliza |
| **Prioridad** | Should |
| **Depende de** | HU-013 |

## Historia

**Como** asesor comercial
**quiero** adjuntar la póliza firmada y demás soportes al expediente
**para** tener todo el respaldo documental en un solo lugar.

## Criterios de aceptación

### CA-1 — Cargar archivo
**CUANDO** el asesor sube un PDF o imagen válida
**ENTONCES** el archivo aparece en la pestaña Archivos con nombre, tamaño, quién lo subió y cuándo, y el contador aumenta.

### CA-2 — Tipo no permitido
**CUANDO** intenta subir un tipo no permitido (por ejemplo `.exe`)
**ENTONCES** el sistema lo rechaza indicando los formatos válidos.

### CA-3 — Tamaño máximo
**CUANDO** el archivo supera el tamaño máximo
**ENTONCES** el sistema lo rechaza informando el límite.

### CA-4 — Descargar
**CUANDO** presiona descargar sobre un archivo
**ENTONCES** obtiene el documento original sin alteraciones.

### CA-5 — Eliminar con permiso
**CUANDO** un usuario sin permiso intenta eliminar un archivo
**ENTONCES** la acción no está disponible y la API responde 403.

## Reglas de negocio

- RN-1 — Formatos permitidos: PDF, JPG, PNG; máximo 10 MB por archivo.
- RN-2 — Los archivos se guardan fuera del repositorio de código, en almacenamiento de objetos o carpeta de medios.
- RN-3 — Eliminar es lógico: el archivo deja de listarse pero se conserva para auditoría.

## Datos y API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET/POST | `/api/polizas/{id}/archivos` | Listar y cargar (multipart) |
| DELETE | `/api/archivos/{id}` | Eliminación lógica |

## Hecho cuando

- [ ] Unitarias: validación de tipo y tamaño, eliminación lógica, permisos.
- [ ] E2E `e2e/hu-028-archivos.spec.ts`: carga con `setInputFiles` y verificación en el listado.
