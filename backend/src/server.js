require('dotenv').config();

const { createApp } = require('./app');
const pool = require('./config/database');

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(160) NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        due_date DATE,
        completed BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    // Mantiene compatibles las bases creadas antes de incorporar fechas límite.
    await pool.query(`
      ALTER TABLE public.tasks
      ADD COLUMN IF NOT EXISTS due_date DATE
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_tasks_due_date
      ON public.tasks (due_date)
    `);

    const app = createApp();
    const server = app.listen(PORT, () => {
      console.log(`Tasking4You API ejecutándose en el puerto ${PORT}.`);
    });

    const shutdown = (signal) => {
      console.log(`${signal} recibido. Cerrando servidor...`);
      server.close(async () => {
        await pool.end();
        process.exit(0);
      });
    };
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('No fue posible iniciar la API:', error.message);
    await pool.end();
    process.exit(1);
  }
}

startServer();
