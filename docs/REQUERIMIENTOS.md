# Levantamiento de requerimientos

## Propósito

Tasking4You permite organizar tareas personales en un tablero, registrar fechas límite y consultar el progreso. El alcance actual es una aplicación de tareas; no incluye envío de correos ni autenticación real.

## Actores

- **Persona usuaria:** interactúa con el tablero en el navegador.
- **Servicio API:** recibe, valida y procesa operaciones sobre tareas.
- **PostgreSQL:** almacena las tareas.

## Requerimientos funcionales

| ID | Requerimiento |
|---|---|
| RF-01 | La persona usuaria puede crear una tarea con título obligatorio de hasta 160 caracteres, descripción opcional y fecha límite opcional. |
| RF-02 | La persona usuaria puede consultar las tareas persistidas y ver sus fechas y estado. |
| RF-03 | La persona usuaria puede marcar una tarea como completada o pendiente. |
| RF-04 | La persona usuaria puede editar el título, la descripción o la fecha límite de una tarea. |
| RF-05 | La persona usuaria puede eliminar una tarea tras confirmar la acción en la interfaz. |
| RF-06 | La persona usuaria puede buscar tareas por título o descripción y filtrar por estado. |
| RF-07 | La persona usuaria puede consultar tareas por fecha límite en la vista de calendario. |
| RF-08 | El sistema presenta el total de tareas, pendientes y completadas. |
| RF-09 | El sistema informa estados de carga y errores de conexión con una opción para reintentar la carga. |
| RF-10 | La persona usuaria puede usar tema claro/oscuro y vista compacta; estas preferencias se conservan en el navegador. |
| RF-11 | El sistema ofrece plantillas rápidas editables para crear tareas comunes. |

## Requerimientos no funcionales

| ID | Requerimiento |
|---|---|
| RNF-01 | El frontend debe adaptarse a pantallas de escritorio, tablet y móvil. |
| RNF-02 | Los controles interactivos deben tener etiquetas accesibles, foco visible y estados comprensibles. |
| RNF-03 | La API debe devolver JSON y códigos HTTP adecuados para solicitudes válidas, inválidas y recursos inexistentes. |
| RNF-04 | Las consultas a PostgreSQL deben ser parametrizadas; credenciales reales no se guardan en el repositorio. |
| RNF-05 | El cliente debe mostrar fallos del backend sin fingir que la operación se completó. |
| RNF-06 | La aplicación debe separar presentación, HTTP, reglas de negocio y persistencia en módulos distintos. |

## Criterios de aceptación

1. Una tarea válida puede crearse y aparece en el listado tras responder la API.
2. Títulos vacíos, fechas imposibles e identificadores inválidos reciben un error claro.
3. Completar, editar y eliminar actualiza la persistencia y el tablero.
4. Buscar y filtrar modifica el listado visible sin borrar datos.
5. Si falla la carga inicial, se explica el problema y se puede reintentar.
6. Las acciones principales pueden usarse con teclado y tienen nombres accesibles.

## Fuera de alcance

- DNS, subdominios, certificados, dominio personalizado y alta/configuración de servicios de hosting.
- Envío de correos electrónicos.
- Autenticación y autorización de cuentas en el servidor.
- Separación multiusuario de tareas.
