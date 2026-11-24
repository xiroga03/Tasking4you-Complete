# Tasking4You

Aplicación web para organizar actividades personales mediante un tablero de tareas. Permite registrar tareas, consultar el listado, buscar y filtrar actividades, marcar tareas como completadas y eliminarlas.

Proyecto académico de Ingeniería Web desarrollado de forma colaborativa en la Universidad Manuela Beltrán.

> **Estado de publicación:** la aplicación está ejecutándose y probándose localmente. El repositorio contiene el frontend, el backend y la configuración para PostgreSQL. El despliegue público en Render y la conexión del dominio personalizado de Cloudflare están pendientes de configuración; por eso todavía no se publican URL de producción.

## Características

- Crear tareas con título y descripción.
- Editar tareas y asignar fechas límite.
- Consultar tareas por fecha límite en un calendario.
- Consultar las tareas almacenadas en PostgreSQL.
- Marcar tareas como pendientes o completadas.
- Eliminar tareas.
- Buscar tareas por título o descripción.
- Filtrar tareas por estado: todas, pendientes y completadas.
- Consultar indicadores de tareas totales, pendientes y completadas.
- Validar los datos recibidos por la API y mostrar errores de conexión.
- Reintentar la carga cuando la API no responde.
- Crear actividades a partir de plantillas rápidas editables.

Consulta el [levantamiento de requerimientos](docs/REQUERIMIENTOS.md) y la [arquitectura](docs/ARQUITECTURA.md) para conocer el alcance y la separación por capas.

## Arquitectura

| Componente | Tecnología | Responsabilidad | Despliegue previsto |
|---|---|---|---|
| Frontend | React 19 + Vite | Interfaz y consumo de la API | Render Static Site |
| Backend | Node.js 20+ + Express 5 | API REST y lógica de negocio | Render Web Service |
| Base de datos | PostgreSQL | Persistencia de tareas | Render PostgreSQL |

El navegador carga el frontend, que realiza solicitudes HTTP al backend. Este valida y procesa cada operación, consulta PostgreSQL y responde con datos JSON.

## Tecnologías

- Frontend: React, Vite, JavaScript, CSS y Lucide React.
- Backend: Node.js, Express y CORS.
- Base de datos: PostgreSQL y node-postgres (`pg`).
- Pruebas y calidad: Node.js Test Runner y ESLint.
- Control de versiones: Git y GitHub.
- Despliegue previsto: Render.
- Dominio: Cloudflare (configuración pendiente).

## Requisitos

- Node.js 20 o superior y npm.
- PostgreSQL 14 o superior.
- Git.

## Ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/xiroga03/Tasking4you-Complete.git
cd Tasking4you-Complete
```

### 2. Crear la base de datos

En PostgreSQL, crea una base de datos llamada `tasking4you`:

```sql
CREATE DATABASE tasking4you;
```

Consulta `docs/BASE_DE_DATOS.md` para más información.

### 3. Configurar el backend

```bash
cd backend
npm install
```

Crea `backend/.env` localmente y configura la conexión a PostgreSQL:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:TU_PASSWORD@localhost:5432/tasking4you
DB_SSL=false
FRONTEND_URL=http://localhost:5173
```

Reemplaza `TU_PASSWORD` por la contraseña de tu instalación local. No compartas ni subas este archivo.

Inicia el servidor:

```bash
npm run dev
```

Verifica la API en:

`http://localhost:3000/api/health`

### 4. Ejecutar el frontend

Abre una segunda terminal desde la raíz del proyecto:

```bash
cd frontend
npm install
```

Configura `frontend/.env` localmente:

```env
VITE_API_URL=http://localhost:3000
```

Inicia Vite:

```bash
npm run dev
```

Abre normalmente:

`http://localhost:5173`

**Importante:** deben permanecer abiertas las terminales del backend y del frontend. Si el backend no está activo o no puede conectarse a PostgreSQL, el frontend mostrará un mensaje de error.

## API REST

Base URL local: `http://localhost:3000`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Comprueba la disponibilidad de API y PostgreSQL. |
| GET | `/api/tasks` | Obtiene el listado de tareas. |
| POST | `/api/tasks` | Crea una tarea con título y descripción. |
| PATCH | `/api/tasks/:id` | Actualiza el estado o uno o varios campos de una tarea. |
| DELETE | `/api/tasks/:id` | Elimina una tarea. |

Ejemplo de creación:

```json
{
  "title": "Entregar el proyecto",
  "description": "Verificar pruebas y documentación"
}
```

Ejemplo de actualización:

```json
{
  "completed": true
}
```

## Pruebas y validación

Backend:

```bash
cd backend
npm test
```

El archivo de pruebas contiene 9 casos unitarios para las reglas del servicio. Ejecuta el comando para comprobar el estado actual.

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

En la última validación local registrada, ESLint no reportó errores y Vite generó correctamente la compilación de producción.

## Despliegue en Render

El taller solicita publicar los tres componentes en Render. Esta sección debe completarse con las URL reales y evidencias cuando los servicios estén creados y verificados.

### 1. PostgreSQL

Crear una instancia PostgreSQL en Render y guardar su URL de conexión interna para el backend. Las credenciales deben mantenerse como secretos.

### 2. Backend como Web Service

| Parámetro | Valor |
|---|---|
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Health Check Path | `/api/health` |

Variables de entorno:

- `DATABASE_URL`: URL interna de PostgreSQL.
- `DB_SSL`: `false` cuando se utilice la conexión interna indicada por Render.
- `FRONTEND_URL`: URL pública del frontend.
- `NODE_ENV`: `production`.

### 3. Frontend como Static Site

| Parámetro | Valor |
|---|---|
| Root Directory | `frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

Variable de entorno:

- `VITE_API_URL`: URL pública del backend, sin barra final.

Si se modifica esta variable, es necesario volver a desplegar el frontend.

### 4. Verificación

1. Configurar `FRONTEND_URL` en el backend con el origen exacto del frontend.
2. Verificar que `/api/health` responda correctamente.
3. Probar crear, listar, completar y eliminar tareas desde la aplicación pública.
4. Recargar la página y comprobar la persistencia de los datos.
5. Realizar un cambio en GitHub y verificar el despliegue automático.

### URL de producción

- Aplicación web: pendiente.
- API / health check: pendiente.
- Repositorio: https://github.com/xiroga03/Tasking4you-Complete

## Dominio personalizado en Cloudflare

El dominio comprado en Cloudflare se conectará al frontend publicado en Render.

1. Agregar el dominio desde la configuración del Static Site en Render.
2. Copiar los registros DNS indicados por Render.
3. Configurar esos registros en la zona DNS de Cloudflare.
4. Seguir las instrucciones de Render sobre el proxy de Cloudflare; durante la validación inicial puede ser necesario utilizar DNS only.
5. Esperar la validación DNS y la emisión del certificado HTTPS.
6. Verificar el dominio y la comunicación con la API.

Dominio personalizado: pendiente de conectar y verificar.

## Seguridad

- No subir archivos `.env`, contraseñas ni cadenas de conexión reales.
- Mantener las credenciales en variables de entorno.
- Crear los archivos `.env` de forma local y no incluirlos en Git.
- Configurar CORS con el origen autorizado.
- No publicar claves privadas ni tokens.

## Entregables y evidencias

- [x] Repositorio GitHub con frontend y backend.
- [x] Archivo `.gitignore` para excluir dependencias y secretos.
- [x] Aplicación integrada y ejecutándose localmente.
- [x] Seis pruebas automatizadas del backend aprobadas.
- [x] ESLint sin errores.
- [x] Compilación de producción correcta.
- [ ] PostgreSQL administrado en Render.
- [ ] Backend publicado como Web Service.
- [ ] Frontend publicado como Static Site.
- [ ] Variables de entorno y CORS configurados en producción.
- [ ] URL pública de la aplicación y API.
- [ ] Dominio personalizado de Cloudflare conectado.
- [ ] Capturas de los servicios y de la aplicación funcionando.
- [ ] Evidencia de despliegue automático tras un `git push`.
- [ ] Reflexión breve sobre dificultades, soluciones y mejoras.

## Equipo

Ximena Rocha 
Sebastian Rubio 
Sebastian Cabanzo 
---

**Nota:** este documento distingue entre las funciones verificadas localmente y las actividades de publicación que todavía deben completarse.
