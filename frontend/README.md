# Frontend — Tasking4You

Interfaz web construida con React, Vite y CSS.

## Requisitos

- Node.js 20 o superior.
- npm.

## Instalación

Desde esta carpeta:

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Vite mostrará la URL local, normalmente `http://localhost:5173`.

## Validaciones

```bash
npm run lint
npm run build
```

## Componentes principales

- `App.jsx`: tablero y estado de la interfaz.
- `components/Sidebar.jsx`: navegación y filtros.
- `components/Header.jsx`: encabezado y búsqueda.
- `components/TaskForm.jsx`: formulario de creación.
- `components/TaskList.jsx`: listado, finalización y eliminación.

El tablero carga y persiste las tareas mediante la API REST. Configura `VITE_API_URL` en `frontend/.env` para apuntar al backend local. El acceso de usuario es una demostración local y no protege los datos mediante autenticación de servidor.
