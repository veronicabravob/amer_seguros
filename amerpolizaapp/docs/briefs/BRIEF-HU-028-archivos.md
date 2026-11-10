# Brief — HU-028 · Archivos adjuntos de la póliza

|  |  |
|---|---|
| **Cambio OpenSpec** | `hu-028-archivos` |
| **HU fuente** | `docs/hu/HU-028-archivos.md` |
| **Épica** | E9 — Expediente de la póliza |
| **Prioridad** | Should |
| **Depende de** | HU-013 |
| **Capacidad** | `archivos-poliza` (ADDED) |

## Intención

La póliza firmada, el soporte de pago y la cédula del tomador viven hoy en carpetas de correo y en
el escritorio de cada asesor. Sin expediente digital, atender una reclamación o una auditoría
depende de a quién se le pregunte. Este cambio adjunta los soportes a la póliza con control de
formato, tamaño y permisos.

## Alcance

- Carga de archivos a la póliza, con nombre, tamaño, autor y fecha, y contador en la pestaña.
- Validación de tipo permitido y de tamaño máximo, con mensajes claros.
- Descarga del documento original sin alteraciones.
- Eliminación lógica sujeta a permiso, con respuesta 403 para quien no lo tiene.

## Fuera de alcance

- Previsualización en el navegador, firma electrónica o versionado de documentos.
- Archivos del cliente o del siniestro: aquí el expediente es el de la póliza.
- Extracción de datos del PDF (OCR).

## Escenarios a especificar

| CA de la HU | Requirement propuesto | Scenario |
|---|---|---|
| CA-1 | Carga de archivo válido | PDF o imagen dentro del límite |
| CA-2 | Tipo no permitido | Archivo con extensión no admitida |
| CA-3 | Tamaño máximo | Archivo que supera el límite |
| CA-4 | Descarga | Descarga del documento original |
| CA-5 | Eliminación sujeta a permiso | Usuario sin permiso intenta eliminar |

## Reglas para el `design.md`

- RN-1 — Formatos permitidos PDF, JPG y PNG; máximo 10 MB por archivo.
- RN-2 — Los archivos se guardan fuera del repositorio de código, en almacenamiento de objetos o en
  una carpeta de medios ignorada por Git (`docs/DATOS.md`).
- RN-3 — La eliminación es lógica: el archivo deja de listarse pero se conserva para auditoría.
- La validación de tipo se hace por contenido, no sólo por la extensión del nombre.

## Superficie de API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET/POST | `/api/polizas/{id}/archivos` | Listar y cargar (multipart) |
| DELETE | `/api/archivos/{id}` | Eliminación lógica |

## Reutilización visual

- Pestaña "Archivos" ya existente en `polizas/PolizaDetailPage.tsx`.
- Clases: `.tblwrap`, `.tbl`, `.rowact`, `.actbtn`, `.btn.btn-pri` para cargar, `.empty` sin
  archivos, `.hint` para los mensajes de validación.
- `data-testid` en el campo de carga, en el contador de la pestaña y en las acciones de fila.

## Verificación

- Unitarias: validación de tipo y tamaño, eliminación lógica, permisos de borrado.
- E2E `e2e/specs/hu-028-archivos.spec.ts`: carga con `setInputFiles` y verificación en el listado;
  el archivo de prueba es ficticio y vive en `e2e/fixtures/`.

## Decisiones abiertas

1. **Dónde se almacenan**: carpeta de medios local o almacenamiento de objetos (S3 o compatible).
   Decide variables de entorno, despliegue y cómo se ejecutan las pruebas en CI.
2. **Quién puede eliminar (CA-5)**: ¿sólo Administrador, o también el asesor que cargó el archivo?
   Debe entrar en la matriz de HU-020.
3. **Retención**: los archivos eliminados lógicamente, ¿se borran del almacenamiento después de
   algún plazo? Enlaza con la política de datos personales.
4. **Clasificación del documento**: ¿se pide un tipo (póliza firmada, soporte de pago, documento de
   identidad)? Sería un catálogo simple más (HU-006) y mejora mucho el expediente.
