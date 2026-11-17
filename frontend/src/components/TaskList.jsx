import { Check, Trash2, ClipboardList, CalendarDays, Pencil } from 'lucide-react';

function formatDate(value) {
  if (!value) return 'Sin fecha límite';
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(date);
}

function TaskList({ tasks, onToggleTask, onDeleteTask, onEditTask }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon"><ClipboardList size={32} /></div>
        <h3>No hay tareas por aquí</h3>
        <p>Agrega una nueva actividad para comenzar a organizarte.</p>
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
            <button className="edit-task" onClick={() => onEditTask(task)} aria-label="Editar tarea"><Pencil size={17} /></button>
            <button className="delete-task" onClick={() => onDeleteTask(task.id)} aria-label="Eliminar tarea"><Trash2 size={18} /></button>
          </div>
        </article>
      ))}
    </div>
  );
}

export default TaskList;
