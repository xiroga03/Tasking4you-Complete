const defaultRepository = require('../repositories/task.repository');

function badRequest(message) {
  const error = new Error(message);
  error.status = 400;
  throw error;
}

function hasOwn(payload, field) {
  return Object.prototype.hasOwnProperty.call(payload, field);
}

function validateDueDate(value) {
  if (value == null || value === '') return null;
  const validFormat = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
  const parsedDate = validFormat ? new Date(`${value}T00:00:00Z`) : null;
  if (!parsedDate || Number.isNaN(parsedDate.getTime())
    || parsedDate.toISOString().slice(0, 10) !== value) {
    badRequest('La fecha límite no es válida.');
  }
  return value;
}

function validateTaskFields(payload, { requireTitle = false } = {}) {
  const fields = {};
  if (hasOwn(payload, 'title') || requireTitle) {
    const title = typeof payload.title === 'string' ? payload.title.trim() : '';
    if (!title) badRequest('El título es obligatorio.');
    if (title.length > 160) badRequest('El título no puede superar los 160 caracteres.');
    fields.title = title;
  }
  if (hasOwn(payload, 'description') || requireTitle) {
    const description = payload.description == null ? '' : payload.description;
    if (typeof description !== 'string') badRequest('La descripción debe ser un texto.');
    if (description.length > 5000) badRequest('La descripción no puede superar los 5000 caracteres.');
    fields.description = description.trim();
  }
  const dateField = hasOwn(payload, 'due_date') ? 'due_date' : hasOwn(payload, 'dueDate') ? 'dueDate' : null;
  if (dateField || requireTitle) fields.due_date = validateDueDate(dateField ? payload[dateField] : null);
  return fields;
}

function createTaskService(repository = defaultRepository) {
  return {
    async getTasks() {
      return repository.findAll();
    },

    async createTask(payload) {
      if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        const error = new Error('El cuerpo de la solicitud debe ser un objeto JSON.');
        error.status = 400;
        throw error;
      }

      const fields = validateTaskFields(payload, { requireTitle: true });
      return repository.create(fields);
    },

    async updateTask(id, payload) {
      const numericId = Number(id);
      if (!Number.isSafeInteger(numericId) || numericId <= 0) {
        const error = new Error('El identificador de la tarea no es v\u00e1lido.');
        error.status = 400;
        throw error;
      }
      if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        const error = new Error('El cuerpo de la solicitud debe ser un objeto JSON.');
        error.status = 400;
        throw error;
      }

      const changes = {};
      const hasCompleted = hasOwn(payload, 'completed');
      const hasTaskFields = ['title', 'description', 'due_date', 'dueDate'].some((field) =>
        hasOwn(payload, field)
      );
      if (hasCompleted && typeof payload.completed !== 'boolean') {
        const error = new Error('El campo completed debe ser booleano.');
        error.status = 400;
        throw error;
      }
      if (!hasCompleted && !hasTaskFields) {
        const error = new Error('Incluye al menos un campo para actualizar.');
        error.status = 400;
        throw error;
      }
      if (hasCompleted) changes.completed = payload.completed;

      const hasAllTaskFields = hasOwn(payload, 'title') && hasOwn(payload, 'description')
        && (hasOwn(payload, 'due_date') || hasOwn(payload, 'dueDate'));
      if (hasTaskFields && !hasAllTaskFields) {
        Object.assign(changes, validateTaskFields(payload));
      } else if (hasTaskFields) {
        const title = typeof payload.title === 'string' ? payload.title.trim() : '';
        const description = payload.description == null ? '' : payload.description;
        const rawDueDate = payload.due_date ?? payload.dueDate;
        const dueDate = rawDueDate == null || rawDueDate === '' ? null : rawDueDate;
        if (!title) {
          const error = new Error('El t\u00edtulo es obligatorio.');
          error.status = 400;
          throw error;
        }
        if (title.length > 160) {
          const error = new Error('El t\u00edtulo no puede superar los 160 caracteres.');
          error.status = 400;
          throw error;
        }
        if (typeof description !== 'string') {
          const error = new Error('La descripci\u00f3n debe ser un texto.');
          error.status = 400;
          throw error;
        }
        if (description.length > 5000) {
          const error = new Error('La descripci\u00f3n no puede superar los 5000 caracteres.');
          error.status = 400;
          throw error;
        }
        if (dueDate !== null) {
          const validFormat = typeof dueDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dueDate);
          const parsedDate = validFormat ? new Date(`${dueDate}T00:00:00Z`) : null;
          const validDate = parsedDate && !Number.isNaN(parsedDate.getTime())
            && parsedDate.toISOString().slice(0, 10) === dueDate;
          if (!validDate) {
            const error = new Error('La fecha l\u00edmite no es v\u00e1lida.');
            error.status = 400;
            throw error;
          }
        }
        Object.assign(changes, { title, description: description.trim(), due_date: dueDate });
      }
      return repository.update(numericId, changes);
    },

    async deleteTask(id) {
      const numericId = Number(id);
      if (!Number.isSafeInteger(numericId) || numericId <= 0) {
        const error = new Error('El identificador de la tarea no es válido.');
        error.status = 400;
        throw error;
      }
      return repository.remove(numericId);
    }
  };
}

module.exports = { createTaskService };


