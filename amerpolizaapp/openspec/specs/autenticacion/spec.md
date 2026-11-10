# Autenticación

## Purpose

Establece la identidad de quien usa AMER Pólizas: permite ingresar con correo y contraseña, mantiene
una sesión con caducidad, protege todas las pantallas y todos los endpoints frente a peticiones sin
sesión, y permite cerrar la sesión dejando el token inservible.

## Requirements

### Requirement: Ingreso con credenciales válidas

El sistema DEBE permitir a un usuario en estado `Activo` iniciar sesión enviando su correo y su
contraseña a `POST /api/auth/login`. En caso de éxito DEBE emitir un token de sesión y devolver los
datos del usuario autenticado (nombre, correo, rol y sede), y la interfaz DEBE llevarlo a
`/dashboard` mostrando en la barra lateral el nombre y el rol reales del usuario, no un valor fijo.

El correo NO DEBE distinguir mayúsculas de minúsculas ni verse afectado por espacios al inicio o al
final.

#### Scenario: Credenciales correctas de usuario activo

- **WHEN** un usuario en estado `Activo` envía su correo y su contraseña correctos a `POST /api/auth/login`
- **THEN** el sistema responde `200` con un token de sesión y con `{nombre, correo, rol, sede}` del usuario
- **AND** la interfaz redirige a `/dashboard`
- **AND** la barra lateral muestra el nombre y el rol de ese usuario

#### Scenario: El correo se normaliza antes de buscar la cuenta

- **WHEN** un usuario en estado `Activo` envía su correo con mayúsculas o con espacios sobrantes y la contraseña correcta
- **THEN** el sistema reconoce la cuenta e inicia la sesión igual que con el correo escrito en minúsculas

#### Scenario: Los datos de la sesión se consultan con el token

- **WHEN** se pide `GET /api/auth/me` con un token de sesión válido
- **THEN** el sistema responde `200` con `{nombre, correo, rol, sede, estado}` del usuario dueño del token
- **AND** la respuesta NO incluye la contraseña ni su hash

### Requirement: Rechazo de credenciales inválidas

El sistema DEBE rechazar el ingreso cuando el correo no exista o la contraseña no coincida, DEBE
responder siempre con el mismo mensaje "Correo o contraseña incorrectos" sin revelar cuál de los dos
falló, y NO DEBE crear sesión ni emitir token.

El tiempo de respuesta NO DEBE permitir distinguir un correo inexistente de una contraseña
incorrecta.

#### Scenario: Correo inexistente

- **WHEN** alguien envía un correo que no corresponde a ninguna cuenta junto con cualquier contraseña
- **THEN** el sistema responde `401` con el mensaje "Correo o contraseña incorrectos"
- **AND** no emite token de sesión

#### Scenario: Contraseña incorrecta

- **WHEN** un usuario existente envía su correo con una contraseña que no coincide
- **THEN** el sistema responde `401` con el mensaje "Correo o contraseña incorrectos"
- **AND** el mensaje es idéntico al del correo inexistente
- **AND** no emite token de sesión

#### Scenario: La pantalla de ingreso muestra el error sin perder el correo escrito

- **WHEN** el ingreso es rechazado por credenciales inválidas
- **THEN** la pantalla muestra "Correo o contraseña incorrectos" en el mensaje de error
- **AND** conserva el correo escrito y vacía el campo de contraseña
- **AND** permanece en `/login`

### Requirement: Bloqueo de cuenta inactiva

El sistema DEBE negar el ingreso a una cuenta en estado `Inactivo` aunque las credenciales sean
correctas, respondiendo con el mensaje "Tu cuenta está inactiva, contacta al administrador", y NO
DEBE emitir token.

Una sesión abierta DEBE dejar de ser válida si la cuenta pasa a `Inactivo` mientras la sesión sigue
viva.

#### Scenario: Credenciales correctas con cuenta inactiva

- **WHEN** un usuario en estado `Inactivo` envía su correo y su contraseña correctos
- **THEN** el sistema responde `403` con el mensaje "Tu cuenta está inactiva, contacta al administrador"
- **AND** no emite token de sesión

#### Scenario: La cuenta se desactiva con la sesión abierta

- **GIVEN** un usuario con una sesión válida en curso
- **WHEN** su cuenta pasa a estado `Inactivo` y hace una nueva petición al API
- **THEN** el sistema responde `401` y la interfaz lo lleva a `/login`

### Requirement: Bloqueo temporal por intentos fallidos

Tras 5 intentos de ingreso fallidos consecutivos del mismo correo dentro de una ventana de 15
minutos, el sistema DEBE bloquear nuevos intentos para ese correo durante 15 minutos, incluso si la
contraseña enviada es la correcta. El contador DEBE reiniciarse cuando un ingreso tiene éxito y
cuando la ventana vence.

#### Scenario: Cinco intentos fallidos del mismo correo en 15 minutos

- **GIVEN** un correo que ya acumula 4 intentos fallidos en los últimos 15 minutos
- **WHEN** ese correo falla un quinto intento
- **THEN** el sistema responde `429` con el mensaje "Demasiados intentos. Intenta de nuevo en 15 minutos"
- **AND** los intentos siguientes con ese correo reciben la misma respuesta durante 15 minutos, aun con la contraseña correcta

#### Scenario: El bloqueo vence

- **GIVEN** un correo bloqueado por intentos fallidos
- **WHEN** han pasado 15 minutos desde el bloqueo y se envían las credenciales correctas
- **THEN** el sistema inicia la sesión con normalidad

#### Scenario: Un ingreso exitoso reinicia el contador

- **GIVEN** un correo con 3 intentos fallidos en la ventana vigente
- **WHEN** ese correo ingresa con la contraseña correcta y después vuelve a fallar 4 veces
- **THEN** el sistema NO bloquea la cuenta, porque el contador se reinició con el ingreso exitoso

#### Scenario: El bloqueo es por correo, no por navegador

- **GIVEN** un correo bloqueado por intentos fallidos
- **WHEN** se intenta ingresar con ese mismo correo desde otro navegador
- **THEN** el sistema responde igualmente `429`

### Requirement: Protección de rutas y de endpoints

Ninguna pantalla de la aplicación distinta de `/login` DEBE ser alcanzable sin una sesión válida:
el sistema DEBE redirigir a `/login` y, tras un ingreso exitoso, llevar al usuario a la ruta que
había pedido. Toda petición al API sin token válido —ausente, mal formado, caducado o invalidado—
DEBE responder `401`, salvo `POST /api/auth/login`.

La sesión DEBE caducar a las 8 horas sin actividad; cada petición autenticada renueva ese plazo.

#### Scenario: Acceso a una ruta protegida sin sesión y retorno a la ruta pedida

- **WHEN** alguien abre `/polizas` sin sesión válida
- **THEN** el sistema lo redirige a `/login`
- **AND** después de ingresar con credenciales correctas, lo lleva a `/polizas` y no a `/dashboard`

#### Scenario: Petición al API sin token

- **WHEN** se llama a cualquier endpoint del API distinto de `POST /api/auth/login` sin token de sesión
- **THEN** el sistema responde `401`

#### Scenario: Petición al API con token manipulado

- **WHEN** se llama a un endpoint protegido con un token alterado o mal formado
- **THEN** el sistema responde `401` y no revela información del usuario

#### Scenario: La sesión caduca por inactividad

- **GIVEN** una sesión sin ninguna petición durante más de 8 horas
- **WHEN** el usuario vuelve a usar la aplicación
- **THEN** el sistema responde `401` a su petición y la interfaz lo lleva a `/login`

#### Scenario: La actividad renueva el plazo de inactividad

- **GIVEN** una sesión que ha hecho peticiones dentro de las últimas 8 horas
- **WHEN** el usuario hace una petición nueva
- **THEN** el sistema la atiende con normalidad y el plazo de 8 horas vuelve a contar desde esa petición

### Requirement: Cierre de sesión

El sistema DEBE permitir cerrar la sesión desde la interfaz mediante `POST /api/auth/logout`. El
token usado DEBE quedar invalidado de inmediato, y volver atrás en el navegador NO DEBE mostrar
datos de la agencia.

#### Scenario: Token invalidado y vuelta atrás sin datos

- **GIVEN** un usuario con sesión iniciada en `/dashboard`
- **WHEN** cierra sesión
- **THEN** el sistema responde `200`, invalida el token y lleva al usuario a `/login`
- **AND** usar ese mismo token en el API responde `401`
- **AND** volver atrás en el navegador muestra `/login` y ningún dato de la agencia

#### Scenario: Cerrar sesión no afecta a otras sesiones del mismo usuario

- **GIVEN** un usuario con sesión iniciada en dos navegadores distintos
- **WHEN** cierra sesión en uno de ellos
- **THEN** la sesión del otro navegador sigue siendo válida
