import { useEffect } from 'react';
import { Bell, Check, Moon, Settings2, Sun, X } from 'lucide-react';

function SettingsPanel({ open, settings, setSettings, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [open, onClose]);

  return (
    <>
      <div className={`notification-backdrop ${open ? 'visible' : ''}`} aria-hidden="true" onClick={onClose} />
      <aside className={`settings-panel ${open ? 'open' : ''}`} role="dialog" aria-modal="true"
        aria-label="Configuraci&oacute;n" aria-hidden={!open}>
        <div className="notification-panel-heading">
          <div><span className="panel-eyebrow">PREFERENCIAS</span><h2>Configuraci&oacute;n</h2></div>
          <button className="header-icon" aria-label="Cerrar configuraci&oacute;n" onClick={onClose}><X size={19} /></button>
        </div>
        <p className="notification-summary">Personaliza c&oacute;mo se ve tu tablero y c&oacute;mo recibes recordatorios.</p>
        <section className="settings-section">
          <div className="settings-title"><Settings2 size={18} /><div><strong>Apariencia</strong><span>Elige el tema del tablero</span></div></div>
          <div className="theme-options">
            <button className={`theme-choice ${!settings.darkMode ? 'selected' : ''}`} onClick={() => setSettings((current) => ({ ...current, darkMode: false }))}>
              <Sun size={18} /><span>Claro</span>{!settings.darkMode && <Check size={16} />}
            </button>
            <button className={`theme-choice ${settings.darkMode ? 'selected' : ''}`} onClick={() => setSettings((current) => ({ ...current, darkMode: true }))}>
              <Moon size={18} /><span>Oscuro</span>{settings.darkMode && <Check size={16} />}
            </button>
          </div>
        </section>
        <section className="settings-section">
          <div className="settings-title"><Bell size={18} /><div><strong>Notificaciones</strong><span>Recordatorios de tareas pr&oacute;ximas</span></div></div>
          <label className="setting-toggle"><span>{settings.notificationsEnabled ? 'Activadas' : 'Pausadas'}</span>
            <input type="checkbox" checked={settings.notificationsEnabled} onChange={(event) => setSettings((current) => ({ ...current, notificationsEnabled: event.target.checked }))} />
            <span className="toggle-track" /></label>
        </section>
        <section className="settings-section">
          <div className="settings-title"><Settings2 size={18} /><div><strong>Vista compacta</strong><span>Reduce el espacio entre las tareas</span></div></div>
          <label className="setting-toggle"><span>{settings.compactMode ? 'Activada' : 'Desactivada'}</span>
            <input type="checkbox" checked={settings.compactMode} onChange={(event) => setSettings((current) => ({ ...current, compactMode: event.target.checked }))} />
            <span className="toggle-track" /></label>
        </section>
        <p className="settings-saved"><Check size={15} /> Los cambios se guardan autom&aacute;ticamente en este navegador.</p>
      </aside>
    </>
  );
}
export default SettingsPanel;
