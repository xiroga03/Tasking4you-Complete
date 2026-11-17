
import { useEffect, useState } from 'react';
import { CheckCircle2, Clock3, ListTodo, Sparkles } from 'lucide-react';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './App.css';

const API_URL = (
  import.meta.env.VITE_API_URL || 'https://tasking4you-complete.onrender.com'
).replace(/\/$/, '');

function mapTask(task) {
  return {
    ...task,
    id: Number(task.id),
    done: task.completed
  };
}

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || 'No se pudo completar la operación.');
  }

  return data;
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar las tareas desde PostgreSQL al iniciar la aplicación.
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await apiRequest('/api/tasks');

        setTasks((data.tasks || []).map(mapTask));
      } catch (err) {
        setError(
          err.message || 'No fue posible conectar con el servidor.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Crear una tarea en la base de datos.
  const addTask = async (taskData) => {
    try {
      setError('');

      const data = await apiRequest('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description || ''
        })
      });

      setTasks((previousTasks) => [
        mapTask(data.task),
        ...previousTasks
      ]);
    } catch (err) {
      setError(err.message || 'No se pudo guardar la tarea.');
      return false;
    }
    return true;
  };

  // Cambiar el estado de una tarea en PostgreSQL.
  const toggleTask = async (id) => {
    const selectedTask = tasks.find((task) => task.id === id);

    if (!selectedTask) return;

    try {
      setError('');

      const data = await apiRequest(`/api/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          completed: !selectedTask.done
        })
      });

      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === id ? mapTask(data.task) : task
        )
      );
    } catch (err) {
      setError(err.message || 'No se pudo actualizar la tarea.');
    }
  };

  // Eliminar una tarea de PostgreSQL.
  const deleteTask = async (id) => {
    try {
      setError('');

      await apiRequest(`/api/tasks/${id}`, {
        method: 'DELETE'
      });

      setTasks((previousTasks) =>
        previousTasks.filter((task) => task.id !== id)
      );
    } catch (err) {
      setError(err.message || 'No se pudo eliminar la tarea.');
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.done).length;
  const pendingTasks = totalTasks - completedTasks;

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'pending' && !task.done) ||
      (activeFilter === 'completed' && task.done);

    const normalizedSearch = searchTerm.toLowerCase();

    const matchesSearch =
      task.title.toLowerCase().includes(normalizedSearch) ||
      (task.description || '').toLowerCase().includes(normalizedSearch);

    return matchesFilter && matchesSearch;
  });

  const taskCounts = {
    total: totalTasks,
    pending: pendingTasks,
    completed: completedTasks
  };

  const today = new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date());

  return (
    <div className="app-layout">
      <Sidebar
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        taskCounts={taskCounts}
      />

      <main className="main-content">
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <div className="dashboard-content">
          <section className="welcome-section">
            <div>
              <span className="date-label">{today}</span>
              <h1>¡Hola! Bienvenido a tu espacio.</h1>
              <p>Organiza tus actividades y haz que cada día cuente.</p>
            </div>
            <div className="welcome-decoration">
              <Sparkles size={38} />
            </div>
          </section>

          <section className="stats-grid">
            <article className="stat-card">
              <div className="stat-icon purple">
                <ListTodo size={22} />
              </div>
              <span className="stat-label">Total de tareas</span>
              <strong>{totalTasks}</strong>
              <span className="stat-description">Actividades registradas</span>
            </article>

            <article className="stat-card">
              <div className="stat-icon orange">
                <Clock3 size={22} />
              </div>
              <span className="stat-label">Pendientes</span>
              <strong>{pendingTasks}</strong>
              <span className="stat-description">Por realizar</span>
            </article>

            <article className="stat-card">
              <div className="stat-icon green">
                <CheckCircle2 size={22} />
              </div>
              <span className="stat-label">Completadas</span>
              <strong>{completedTasks}</strong>
              <span className="stat-description">Objetivos alcanzados</span>
            </article>
          </section>

          {error && (
            <p role="alert" className="api-error">
              {error}
            </p>
          )}

          <section className="workspace">
            <div className="workspace-main">
              <div className="section-heading">
                <div>
                  <h2>Mis actividades</h2>
                  <p>Administra y revisa tus tareas.</p>
                </div>
                <span className="task-total">
                  {filteredTasks.length} tareas
                </span>
              </div>

              {loading ? (
                <p>Cargando tareas...</p>
              ) : (
                <TaskList
                  tasks={filteredTasks}
                  onToggleTask={toggleTask}
                  onDeleteTask={deleteTask}
                />
              )}
            </div>

            <div className="workspace-form">
              <TaskForm onAddTask={addTask} />
            </div>
          </section>

          <footer className="dashboard-footer">
            <span>Tasking4You © 2026</span>
            <span>Organiza tu tiempo, alcanza tus metas.</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
