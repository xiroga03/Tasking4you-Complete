# Guía de colaboración

Para evitar conflictos y conservar el trabajo de cada integrante, se propone el siguiente flujo.

## Ramas

- `main`: versión estable integrada y protegida.
- `development`: integración del trabajo revisado.
- `final`: versión congelada que se presenta como entrega.
- `feature/nombre-funcionalidad` / `fix/nombre-problema`: cambios aislados, creados desde `development`.
- `feature/nombre-funcionalidad`: nuevas funcionalidades.
- `fix/nombre-problema`: correcciones.
- `docs/tema`: cambios de documentación.

Evitar trabajar directamente sobre `main`.

## Flujo de trabajo

1. Actualizar `development` desde GitHub.
2. Crear `feature/...` o `fix/...` desde `development`.
3. Realizar cambios pequeños y comprobar el comportamiento afectado.
4. Hacer commits descriptivos y abrir un Pull Request hacia `development`.
5. Solicitar revisión de otro integrante y resolver sus observaciones.
6. Integrar en `development`; cuando se apruebe una entrega, actualizar `final` y luego `main` mediante Pull Request.

## Protección del repositorio

- En GitHub, proteger `main` para requerir Pull Request y revisión antes de integrar cambios.
- Mantener al menos una copia del proyecto y no usar la zona **Danger Zone** para borrar, transferir o archivar el repositorio durante el trabajo.
- Revisar `git status` y los archivos del Pull Request antes de publicar; `.env`, credenciales, `node_modules/` y archivos generados no deben entrar en un commit.
- No subir secretos para “probar” si `.gitignore` funciona. Si un secreto llegó al historial, revocarlo y reemplazarlo; borrarlo del último commit no lo invalida.

## Convención de commits

Usar mensajes breves con prefijo:

- `feat:` nueva funcionalidad.
- `fix:` corrección.
- `docs:` documentación.
- `refactor:` reorganización interna sin cambiar el comportamiento.
- `test:` pruebas.
- `chore:` mantenimiento y configuración.

Ejemplos:

```text
feat: conectar formulario con API de tareas
fix: corregir validación del título
docs: actualizar instrucciones de instalación
```

## Reglas del repositorio

- No subir `.env`, contraseñas, tokens ni datos privados.
- No subir `node_modules/`, `dist/` ni archivos generados.
- Mantener actualizado el README cuando cambie la instalación o la arquitectura.
- Probar backend y frontend antes de solicitar revisión.
