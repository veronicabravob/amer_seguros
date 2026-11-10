import { NavLink, useNavigate } from 'react-router-dom';
import { useSesion } from '../../context/SesionContext';

function navClass({ isActive }: { isActive: boolean }) {
  return `nav-item${isActive ? ' active' : ''}`;
}

export default function Sidebar() {
  const { usuario, cerrarSesion } = useSesion();
  const navegar = useNavigate();

  async function salir() {
    await cerrarSesion();
    navegar('/login', { replace: true });
  }

  return (
    <aside className="side">
      <div className="brandbar">
        <img src="/assets/amer-logo-white.png" alt="AMER Seguros" className="brand-logo" />
      </div>
      <nav className="nav">
        <div className="nlbl">Principal</div>
        <NavLink to="/dashboard" className={navClass}>
          <svg className="ni-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="9" rx="1.5" />
            <rect x="14" y="3" width="7" height="5" rx="1.5" />
            <rect x="14" y="12" width="7" height="9" rx="1.5" />
            <rect x="3" y="16" width="7" height="5" rx="1.5" />
          </svg>
          Inicio
        </NavLink>
        <NavLink to="/clientes" className={navClass}>
          <svg className="ni-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          </svg>
          Clientes
        </NavLink>
        <div className="nlbl">Operación</div>
        <NavLink to="/polizas" className={navClass}>
          <svg className="ni-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Pólizas
        </NavLink>
        <div className="nlbl">Sistema</div>
        <NavLink to="/configuracion" className={navClass}>
          <svg className="ni-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.17V22a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 20.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 3.6 15H3.5a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 5 9.4l.36-.51" />
          </svg>
          Configuración
        </NavLink>
      </nav>
      <div className="side-foot" data-testid="side-usuario">
        <div className="avatar">{usuario?.iniciales ?? ''}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: '#fff' }}>{usuario?.nombre}</div>
          <div style={{ fontSize: 11, color: 'var(--side-txt2)' }}>{usuario?.rol}</div>
        </div>
        <button
          type="button"
          className="side-salir"
          onClick={salir}
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
          data-testid="btn-cerrar-sesion"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
