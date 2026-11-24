import { useEffect, useRef, useState } from 'react';
import { LayoutDashboard, ListTodo, CheckCircle2, Clock3, CalendarDays, Settings, Plus, ChevronUp, ChevronDown, Repeat2, LogOut } from 'lucide-react';

function Sidebar({ activeFilter, setActiveFilter, taskCounts, userName, onLogout, onChangeAccount, onOpenSettings }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!profileRef.current?.contains(event.target)) setProfileOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setProfileOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);
  const menuItems = [
    { id: 'all', label: 'Todas las tareas', icon: ListTodo, count: taskCounts.total },
    { id: 'pending', label: 'Pendientes', icon: Clock3, count: taskCounts.pending },
    { id: 'completed', label: 'Completadas', icon: CheckCircle2, count: taskCounts.completed },
    { id: 'calendar', label: 'Calendario', icon: CalendarDays }
  ];
  return (
    <aside className="sidebar">
      <div className="brand"><div className="brand-icon"><LayoutDashboard size={23} /></div><span>Tasking<span className="brand-highlight">4You</span></span></div>
      <div className="workspace-label">ESPACIO DE TRABAJO</div>
      <button className="sidebar-create" onClick={() => {
        if (activeFilter === 'calendar') setActiveFilter('all');
        window.setTimeout(() => document.getElementById('task-title')?.focus(), 0);
      }}><Plus size={18} />Nueva tarea</button>
      <div className="menu-label">MEN&Uacute; PRINCIPAL</div>
      <nav className="sidebar-menu" aria-label="Tareas">
        {menuItems.map((item) => { const Icon = item.icon; return (
          <button key={item.id} className={`menu-item ${activeFilter === item.id ? 'active' : ''}`} onClick={() => setActiveFilter(item.id)}>
            <Icon size={19} /><span>{item.label}</span>{item.count !== undefined && <span className="menu-count">{item.count}</span>}
          </button>
        ); })}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-tip"><CalendarDays size={22} /><strong>Organiza tu d&iacute;a</strong><p>Peque&ntilde;os avances hacen grandes resultados.</p></div>
        <button className="menu-item settings-item" onClick={onOpenSettings}><Settings size={19} /><span>Configuraci&oacute;n</span></button>
        <div className="profile-menu-container" ref={profileRef}>
          {profileOpen && <div className="profile-popover" role="menu">
            <div className="profile-popover-heading"><strong>{userName}</strong><span>Cuenta de prueba</span></div>
            <button role="menuitem" onClick={() => { setProfileOpen(false); onChangeAccount(); }}><Repeat2 size={17} />Cambiar cuenta</button>
            <button role="menuitem" onClick={() => { setProfileOpen(false); onLogout(); }}><LogOut size={17} />Cerrar sesi&oacute;n</button>
          </div>}
          <button className="sidebar-user profile-trigger" aria-expanded={profileOpen} aria-haspopup="menu" onClick={() => setProfileOpen((open) => !open)}>
            <div className="user-avatar">{userName?.charAt(0).toUpperCase()}</div>
            <div className="sidebar-user-info"><strong>{userName}</strong><span>Cuenta de prueba</span></div>
            {profileOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>
    </aside>
  );
}
export default Sidebar;
