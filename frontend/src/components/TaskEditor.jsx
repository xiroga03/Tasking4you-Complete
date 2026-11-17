import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

function TaskEditor({ task, onSave, error, onClose }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [dueDate, setDueDate] = useState(task.dueDate || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle || saving) return;
    setSaving(true);
    try {
      const saved = await onSave(task.id, {
        title: cleanTitle,
        description: description.trim(),
        dueDate: dueDate || null
      });
      if (saved) onClose();
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="edit-task-heading">
        <div className="modal-heading"><div><span className="panel-eyebrow">TUS ACTIVIDADES</span><h2 id="edit-task-heading">Editar tarea</h2></div>
          <button className="header-icon" type="button" aria-label="Cerrar" onClick={onClose}><X size={19} /></button>
        </div>
        <form className="form-fields edit-task-form" onSubmit={handleSubmit}>
          <label htmlFor="edit-task-title">T&iacute;tulo</label>
          <input id="edit-task-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={160} required autoFocus />
          <label htmlFor="edit-task-description">Descripci&oacute;n</label>
          <textarea id="edit-task-description" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={5000} rows={4} />
          <label htmlFor="edit-task-date">Fecha l&iacute;mite</label>
          <input id="edit-task-date" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
          {error && <p className="auth-error" role="alert">{error}</p>}
          <div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancelar</button>
            <button type="submit" disabled={!title.trim() || saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</button></div>
        </form>
      </section>
    </div>
  );
}
export default TaskEditor;
