const pool = require('../config/database');

async function findAll() {
  const { rows } = await pool.query(
    `SELECT id, title, description, completed, created_at, updated_at, due_date
     FROM tasks
     ORDER BY created_at DESC, id DESC`
  );
  return rows;
}

async function create(task) {
  const { rows } = await pool.query(
    `INSERT INTO tasks (title, description, due_date)
     VALUES ($1, $2, $3)
     RETURNING id, title, description, completed, created_at, updated_at, due_date`,
    [task.title, task.description, task.due_date || null]
  );
  return rows[0];
}

async function update(id, changes) {
  const { rows } = await pool.query(
    `UPDATE tasks
     SET title = COALESCE($2, title),
         description = COALESCE($3, description),
         due_date = CASE WHEN $4 THEN $5::date ELSE due_date END,
         completed = COALESCE($6, completed),
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, title, description, completed, created_at, updated_at, due_date`,
    [
      id,
      changes.title ?? null,
      changes.description ?? null,
      changes.due_date !== undefined,
      changes.due_date ?? null,
      changes.completed ?? null
    ]
  );
  return rows[0] || null;
}

async function remove(id) {
  const { rowCount } = await pool.query(
    'DELETE FROM tasks WHERE id = $1',
    [id]
  );
  return rowCount > 0;
}

module.exports = { findAll, create, update, remove };
