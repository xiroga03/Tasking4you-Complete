import { Check, Trash2, ClipboardList, CalendarDays, Pencil } from 'lucide-react';

import { useState } from 'react';

function formatDate(value) {
  if (!value) return 'Sin fecha límite';
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(date);
}

function TaskList({ tasks, onToggleTask, onDeleteTask, onEditTask, searchTerm = '', activeFilter = 'all', onClearSearch }) {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  if (tasks.length === 0) {
    const heading = searchTerm
      ? 'No encontramos tareas'
      : activeFilter === 'pending'
        ? 'No tienes tareas pendientes'
        : activeFilter === 'completed'
          ? 'Aún no hay tareas completadas'
          : 'No hay tareas por aquí';

    return (
      <div className="empty-state">
        <div className="empty-icon"><ClipboardList size={32} /></div>
        <h3>{heading}</h3>
        <p>{searchTerm ? 'Prueba con otras palabras o limpia la búsqueda.' : 'Agrega una actividad para comenzar a organizarte.'}</p>
        {searchTerm && <button type="button" className="secondary-button" onClick={onClearSearch}>Limpiar búsqueda</button>}
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <article className={`task-card ${task.done ? 'task-completed' : ''}`} key={task.id}>
          <button
            className={`task-check ${task.done ? 'checked' : ''}`}
            onClick={() => onToggleTask(task.id)}
            aria-label={task.done ? 'Marcar pendiente' : 'Completar tarea'}
          >
            {task.done && <Check size={16} />}
          </button>

          <div className="task-information">
            <h4>{task.title}</h4>
            {task.description && <p>{task.description}</p>}
            <div className="task-dates">
              <span><CalendarDays size={14} /> Creada: {formatDate(task.created_at)}</span>
              <span><CalendarDays size={14} /> Fecha límite: {formatDate(task.due_date)}</span>
            </div>
            <span className={`task-status ${task.done ? 'status-done' : 'status-pending'}`}>
              {task.done ? 'Completada' : 'Pendiente'}
            </span>
          </div>

          <div className="task-actions">
            {confirmDeleteId === task.id ? (
              <div className="delete-confirmation" role="group" aria-label={`Confirmar eliminación de ${task.title}`}>
                <span>¿Eliminar?</span>
                <button type="button" disabled={deletingId === task.id} onClick={async () => {
                  setDeletingId(task.id);
                  try {
                    const deleted = await onDeleteTask(task.id);
                    if (deleted !== false) setConfirmDeleteId(null);
                  } finally {
                    setDeletingId(null);
                  }
                }}>{deletingId === task.id ? 'Eliminando…' : 'Sí, eliminar'}</button>
                <button type="button" disabled={deletingId === task.id} onClick={() => setConfirmDeleteId(null)}>Cancelar</button>
              </div>
            ) : (
              <>
                <button className="edit-task" onClick={() => onEditTask(task)} aria-label={`Editar ${task.title}`}><Pencil size={17} /></button>
                <button className="delete-task" onClick={() => setConfirmDeleteId(task.id)} aria-label={`Eliminar ${task.title}`}><Trash2 size={18} /></button>
              </>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

export default TaskList;
