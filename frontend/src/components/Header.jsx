import { Search, Bell, Sun, Moon, CalendarClock, X } from 'lucide-react';
import { useMemo } from 'react';

function dayDistance(dateValue) {
  if (!dateValue) return null;
  const [year, month, day] = dateValue.slice(0, 10).split('-').map(Number);
  const due = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((due - today) / 86400000);
}

function Header({ searchTerm, setSearchTerm, tasks, notificationsOpen, setNotificationsOpen, notificationsEnabled = true, darkMode = false, onToggleTheme }) {
  const upcoming = useMemo(() => tasks
    .filter((task) => !task.done && task.dueDate)
    .map((task) => ({ ...task, daysLeft: dayDistance(task.dueDate) }))
    .filter((task) => task.daysLeft <= 3)
    .sort((a, b) => a.daysLeft - b.daysLeft), [tasks]);

  return (
    <>
      <header className="header">
        <div className="header-greeting">
          <span>ESPACIO PERSONAL</span>
          <h2>Mi tablero</h2>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <Search size={19} />
            <input type="text" placeholder="Buscar tareas..." value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)} />
          </div>
          <button className="header-icon" aria-label={darkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'} title={darkMode ? 'Tema claro' : 'Tema oscuro'} onClick={onToggleTheme}>{darkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
          <button className="header-icon notification-button" aria-label={`Notificaciones: ${notificationsEnabled ? upcoming.length : 0} tareas pr\u00f3ximas`}
            aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen(true)}>
            <Bell size={20} />
            {notificationsEnabled && upcoming.length > 0 && <span className="notification-count">{upcoming.length}</span>}
          </button>
        </div>
      </header>
      <div className={`notification-backdrop ${notificationsOpen ? 'visible' : ''}`} aria-hidden="true"
        onClick={() => setNotificationsOpen(false)} />
      <aside className={`notification-panel ${notificationsOpen ? 'open' : ''}`} role="dialog"
        aria-modal="true" aria-label="Notificaciones de tareas" aria-hidden={!notificationsOpen}>
        <div className="notification-panel-heading">
          <div><span className="panel-eyebrow">RECORDATORIOS</span><h2>Pr&oacute;ximas tareas</h2></div>
          <button className="header-icon" aria-label="Cerrar notificaciones" onClick={() => setNotificationsOpen(false)}><X size={19} /></button>
        </div>
        <p className="notification-summary">{notificationsEnabled ? 'Mostramos tareas pendientes con fecha l\u00edmite dentro de los pr\u00f3ximos tres d\u00edas.' : 'Los recordatorios est\u00e1n pausados. Act\u00edvalos desde Configuraci\u00f3n.'}</p>
        {!notificationsEnabled ? (
          <div className="notification-empty"><Bell size={28} /><strong>Avisos pausados</strong><span>Activa las notificaciones en la configuraci&oacute;n del tablero.</span></div>
        ) : upcoming.length === 0 ? (
          <div className="notification-empty"><CalendarClock size={28} /><strong>Todo al d&iacute;a</strong><span>No tienes tareas pr&oacute;ximas con fecha l&iacute;mite.</span></div>
        ) : (
          <ul className="notification-list">{upcoming.map((task) => (
            <li className={`notification-item ${task.daysLeft <= 0 ? 'urgent' : task.daysLeft === 1 ? 'soon' : ''}`} key={task.id}>
              <span className="notification-marker" />
              <div><strong>{task.title}</strong><span>{task.daysLeft < 0 ? `Vencida hace ${Math.abs(task.daysLeft)} ${Math.abs(task.daysLeft) === 1 ? 'd\u00eda' : 'd\u00edas'}` : task.daysLeft === 0 ? 'Vence hoy - Urgente' : task.daysLeft === 1 ? 'Vence ma\u00f1ana' : `Vence en ${task.daysLeft} d\u00edas`}</span></div>
            </li>
          ))}</ul>
        )}
      </aside>
    </>
  );
}

export default Header;
