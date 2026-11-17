import { useState } from 'react';
import { Plus } from 'lucide-react';

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle || saving) return;

    setSaving(true);
    try {
      const saved = await onAddTask({
        title: cleanTitle,
        description: description.trim()
      });

      // Only clear the form after the API confirms the task was saved.
      if (saved) {
        setTitle('');
        setDescription('');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div>
          <h3>Crear nueva tarea</h3>
          <p>Agrega una actividad a tu lista.</p>
        </div>
        <button
          className="form-icon"
          type="button"
          aria-label="Ir al campo de nueva tarea"
          title="Nueva tarea"
          onClick={() => document.getElementById('task-title')?.focus()}
        >
          <Plus size={21} />
        </button>
      </div>

      <div className="form-fields">
        <input
          id="task-title"
          type="text"
          placeholder="¿Qué necesitas hacer?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={160}
          required
        />

        <input
          type="text"
          placeholder="Descripción (opcional)"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={5000}
        />

        <button type="submit" disabled={!title.trim() || saving}>
          <Plus size={17} />
          {saving ? 'Guardando...' : 'Agregar tarea'}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
