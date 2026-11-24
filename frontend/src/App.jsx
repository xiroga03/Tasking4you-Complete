
import { useEffect, useState } from 'react';
import AuthGate from './components/AuthGate';
import { CheckCircle2, Clock3, ListTodo, Sparkles } from 'lucide-react';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import CalendarView from './components/CalendarView';
import TaskEditor from './components/TaskEditor';
import SettingsPanel from './components/SettingsPanel';
import './App.css';

const API_URL = (
  import.meta.env.VITE_API_URL || 'https://tasking4you-complete.onrender.com'
).replace(/\/$/, '');

function mapTask(task) {
  return {
    ...task,
    id: Number(task.id),
    done: task.completed,
    dueDate: task.due_date || task.dueDate || ''
  };
}

function LoadError({ message, onRetry }) {
  return (
    <div className="load-error-card" role="alert">
      <h3>No pudimos cargar tus tareas</h3>
      <p>{message}</p>
      <button type="button" onClick={onRetry}>Reintentar</button>
    </div>
  );
}

async function apiRequest(endpoint, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
  } catch {
    throw new Error('No fue posible conectar con la API. Revisa tu conexión e inténtalo de nuevo.');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || 'No se pudo completar la operación.');
  }

  return data;
}

function Dashboard({ userName, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [error, setError] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [settings, setSettings] = useState(() => {
    try {
      return { darkMode: false, notificationsEnabled: true, compactMode: false, ...JSON.parse(localStorage.getItem('tasking4you_settings') || '{}') };
    } catch {
      return { darkMode: false, notificationsEnabled: true, compactMode: false };
    }
  });

  useEffect(() => {
    localStorage.setItem('tasking4you_settings', JSON.stringify(settings));
    document.documentElement.dataset.theme = settings.darkMode ? 'dark' : 'light';
  }, [settings]);

  // Cargar las tareas desde PostgreSQL al iniciar la aplicación.
  useEffect(() => {
    if (!userName) {
      setLoading(false);
      return;
    }
    const loadTasks = async () => {
      try {
        setLoading(true);
        setLoadError('');

        const data = await apiRequest('/api/tasks');

        setTasks((data.tasks || []).map(mapTask));
      } catch (err) {
        setLoadError(err.message || 'No fue posible conectar con el servidor.');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [userName, reloadKey]);

  // Crear una tarea en la base de datos.
  const addTask = async (taskData) => {
    try {
      setError('');

      const data = await apiRequest('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description || '',
          due_date: taskData.due_date || taskData.dueDate || null
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

  const updateTask = async (id, taskData) => {
    try {
      setError('');
      const data = await apiRequest(`/api/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description || '',
          due_date: taskData.due_date || taskData.dueDate || null
        })
      });
      setTasks((previousTasks) => previousTasks.map((task) =>
        task.id === id ? mapTask(data.task) : task
      ));
      return true;
    } catch (err) {
      setError(err.message || 'No se pudo guardar la tarea.');
      return false;
    }
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
      return true;
    } catch (err) {
      setError(err.message || 'No se pudo eliminar la tarea.');
      return false;
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
    <div className={`app-layout ${settings.compactMode ? 'compact-mode' : ''}`}>
      <Sidebar
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        taskCounts={taskCounts}
        userName={userName}
        onLogout={onLogout}
        onChangeAccount={onLogout}
        onOpenSettings={() => { setNotificationsOpen(false); setSettingsOpen(true); }}
      />
      <SettingsPanel open={settingsOpen} settings={settings} setSettings={setSettings} onClose={() => setSettingsOpen(false)} />

      <main className="main-content">
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          tasks={tasks}
          notificationsOpen={notificationsOpen}
          setNotificationsOpen={(open) => { setSettingsOpen(false); setNotificationsOpen(open); }}
          notificationsEnabled={settings.notificationsEnabled}
          darkMode={settings.darkMode}
          onToggleTheme={() => setSettings((current) => ({ ...current, darkMode: !current.darkMode }))}
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
              <strong>{loading || loadError ? '—' : totalTasks}</strong>
              <span className="stat-description">Actividades registradas</span>
            </article>

            <article className="stat-card">
              <div className="stat-icon orange">
                <Clock3 size={22} />
              </div>
              <span className="stat-label">Pendientes</span>
              <strong>{loading || loadError ? '—' : pendingTasks}</strong>
              <span className="stat-description">Por realizar</span>
            </article>

            <article className="stat-card">
              <div className="stat-icon green">
                <CheckCircle2 size={22} />
              </div>
              <span className="stat-label">Completadas</span>
              <strong>{loading || loadError ? '—' : completedTasks}</strong>
              <span className="stat-description">Objetivos alcanzados</span>
            </article>
          </section>

          {error && (
            <p role="alert" className="api-error">
              {error}
            </p>
          )}

          {activeFilter === 'calendar' ? (
            loading ? <p role="status">Cargando calendario…</p>
              : loadError ? <LoadError message={loadError} onRetry={() => setReloadKey((key) => key + 1)} />
                : <CalendarView tasks={tasks} />
          ) : (
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
                <p role="status">Cargando tareas…</p>
              ) : loadError ? (
                <LoadError message={loadError} onRetry={() => setReloadKey((key) => key + 1)} />
              ) : (
                <TaskList
                  tasks={filteredTasks}
                  onToggleTask={toggleTask}
                  onDeleteTask={deleteTask}
                  onEditTask={setEditingTask}
                  searchTerm={searchTerm}
                  activeFilter={activeFilter}
                  onClearSearch={() => setSearchTerm('')}
                />
              )}
            </div>

            <div className="workspace-form">
              <TaskForm onAddTask={addTask} />
            </div>
          </section>
          )}

          <footer className="dashboard-footer">
            <span>Tasking4You © 2026</span>
            <span>Organiza tu tiempo, alcanza tus metas.</span>
          </footer>
        </div>
      </main>
      {editingTask && <TaskEditor key={editingTask.id} task={editingTask} onSave={updateTask} error={error} onClose={() => setEditingTask(null)} />}
    </div>
  );
}

function App() {
  const [userName, setUserName] = useState(() => localStorage.getItem('tasking4you_demo_session') || '');

  const signIn = (name) => {
    localStorage.setItem('tasking4you_demo_session', name);
    setUserName(name);
  };

  const signOut = () => {
    localStorage.removeItem('tasking4you_demo_session');
    setUserName('');
  };

  if (!userName) return <AuthGate onSignIn={signIn} />;
  return <Dashboard userName={userName} onLogout={signOut} />;
}

export default App;
