import { useState } from 'react';
import { Plus } from 'lucide-react';

const taskTemplates = [
  { id: 'study', title: 'Bloque de estudio', description: 'Tema, material y resultado esperado.' },
  { id: 'work', title: 'Tarea de trabajo', description: 'Actividad, responsable o siguiente paso.' },
  { id: 'personal', title: 'Pendiente personal', description: 'Anota lo necesario para completar esta actividad.' }
];

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const applyTemplate = (event) => {
    const template = taskTemplates.find((item) => item.id === event.target.value);
    setSelectedTemplate(event.target.value);
    if (!template) return;
    setTitle(template.title);
    setDescription(template.description);
    document.getElementById('task-title')?.focus();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle || saving) return;

    setSaving(true);
    try {
      const saved = await onAddTask({
        title: cleanTitle,
        description: description.trim(),
        due_date: dueDate || null
      });

      if (saved) {
        setTitle('');
        setDescription('');
        setDueDate('');
        setSelectedTemplate('');
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
        <button className="form-icon" type="button"
          aria-label="Ir al campo de nueva tarea"
          onClick={() => document.getElementById('task-title')?.focus()}>
          <Plus size={21} />
        </button>
      </div>

      <div className="form-fields">
        <label htmlFor="task-template">Plantilla rápida</label>
        <select id="task-template" value={selectedTemplate} onChange={applyTemplate}>
          <option value="">En blanco</option>
          {taskTemplates.map((template) => (
            <option key={template.id} value={template.id}>{template.title}</option>
          ))}
        </select>

        <label htmlFor="task-title">Título</label>
        <input
          id="task-title"
          type="text"
          placeholder="¿Qué necesitas hacer?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={160}
          required
        />

        <label htmlFor="task-description">Descripción (opcional)</label>
        <textarea
          id="task-description"
          placeholder="Agrega contexto o pasos por realizar"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={5000}
          rows={3}
        />

        <label className="due-date-label" htmlFor="task-due-date">
          Fecha límite para completar
        </label>
        <input
          id="task-due-date"
          type="date"
          value={dueDate}
          min={(() => {
            const today = new Date();
            const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
            return localDate.toISOString().slice(0, 10);
          })()}
          onChange={(event) => setDueDate(event.target.value)}
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
