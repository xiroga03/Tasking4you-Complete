import { useState } from 'react';
import { LayoutDashboard, LockKeyhole, UserRound } from 'lucide-react';

const ACCOUNT_KEY = 'tasking4you_demo_account';

function AuthGate({ onSignIn }) {
  const [account, setAccount] = useState(() => {
    try { return JSON.parse(localStorage.getItem(ACCOUNT_KEY) || 'null'); }
    catch { return null; }
  });
  const [registering, setRegistering] = useState(!account);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanName = userName.trim();
    if (!cleanName || !password) {
      setError('Escribe tu usuario y contrase\u00f1a.');
      return;
    }
    if (registering) {
      const nextAccount = { userName: cleanName, password };
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify(nextAccount));
      setAccount(nextAccount);
      onSignIn(cleanName);
      return;
    }
    if (cleanName !== account?.userName || password !== account?.password) {
      setError('El usuario o la contrase\u00f1a no coinciden.');
      return;
    }
    onSignIn(account.userName);
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand"><div className="brand-icon"><LayoutDashboard size={24} /></div><span>Tasking<span className="brand-highlight">4You</span></span></div>
        <span className="auth-eyebrow">ESPACIO PERSONAL</span>
        <h1>{registering ? 'Crea tu usuario' : 'Hola de nuevo'}</h1>
        <p>{registering ? 'Configura un acceso de prueba para tu tablero.' : 'Inicia sesi\u00f3n para entrar a tu espacio.'}</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="auth-user">Usuario</label>
          <div className="auth-input"><UserRound size={18} /><input id="auth-user" autoComplete="username" value={userName} onChange={(event) => setUserName(event.target.value)} required /></div>
          <label htmlFor="auth-password">Contrase&ntilde;a</label>
          <div className="auth-input"><LockKeyhole size={18} /><input id="auth-password" type="password" autoComplete={registering ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} required /></div>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="auth-submit" type="submit">{registering ? 'Crear usuario' : 'Iniciar sesi\u00f3n'}</button>
        </form>
        {!registering && <button className="auth-switch" onClick={() => { setRegistering(true); setError(''); setUserName(''); setPassword(''); }}>Usar otro usuario o crear cuenta</button>}
        <p className="auth-note">Acceso de demostraci&oacute;n guardado en este navegador.</p>
      </section>
    </main>
  );
}

export default AuthGate;
