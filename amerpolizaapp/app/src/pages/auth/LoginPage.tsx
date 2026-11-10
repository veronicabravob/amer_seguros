/**
 * Pantalla de ingreso (CA-1, CA-2, CA-3, CA-4).
 *
 * No inventa diseño: reutiliza el degradado y el logo de la barra lateral, y arma el
 * formulario con las clases de formulario que ya usan las demás pantallas.
 */

import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ApiError } from '../../api/client';
import { useSesion } from '../../context/SesionContext';

type EstadoRuta = { desde?: { pathname: string; search?: string; hash?: string } };

export default function LoginPage() {
  const { usuario, cargando, ingresar } = useSesion();
  const navegar = useNavigate();
  const ubicacion = useLocation();

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  // La ruta que se pidió antes de llegar aquí (CA-4); si no hay, el tablero.
  const estado = ubicacion.state as EstadoRuta | null;
  const destino = estado?.desde
    ? `${estado.desde.pathname}${estado.desde.search ?? ''}${estado.desde.hash ?? ''}`
    : '/dashboard';

  if (cargando) {
    return null;
  }

  if (usuario !== null) {
    return <Navigate to={destino} replace />;
  }

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await ingresar(correo, password);
      navegar(destino, { replace: true });
    } catch (fallo) {
      setError(
        fallo instanceof ApiError ? fallo.message : 'No se pudo conectar con el servidor',
      );
      // El correo se conserva; la contraseña se vacía.
      setPassword('');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="login-wrap">
      <aside className="login-hero">
        <div className="brandbar">
          <img src="/assets/amer-logo-white.png" alt="AMER Seguros" className="brand-logo" />
        </div>
        <div>
          <div className="login-hero-t">Gestión de pólizas de la agencia</div>
          <p className="login-hero-s">
            Clientes, pólizas, renovaciones y comisiones en un solo lugar. Ingresa con tu
            cuenta para ver la información de tu agencia.
          </p>
        </div>
        <div className="login-hero-f">AMER Seguros</div>
      </aside>

      <main className="login-main">
        <div className="login-box">
          <div className="pagehd">
            <div>
              <h1 className="h1">Ingresar</h1>
              <p className="psub">Usa el correo con el que te registró tu administrador</p>
            </div>
          </div>

          <div className="card pad">
            {error !== null && (
              <div className="login-err" role="alert" data-testid="login-error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v6" />
                  <path d="M12 16.5v.5" />
                </svg>
                {error}
              </div>
            )}

            <form className="fgrid" onSubmit={enviar} noValidate>
              <div className="field full">
                <label className="lbl" htmlFor="correo">
                  Correo <span className="req">*</span>
                </label>
                <input
                  id="correo"
                  className="inp"
                  type="email"
                  name="correo"
                  autoComplete="username"
                  placeholder="nombre.apellido@amerseguros.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                  autoFocus
                  data-testid="login-correo"
                />
              </div>

              <div className="field full">
                <label className="lbl" htmlFor="password">
                  Contraseña <span className="req">*</span>
                </label>
                <input
                  id="password"
                  className="inp"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="login-password"
                />
                <span className="hint">Mínimo 8 caracteres.</span>
              </div>

              <div className="field full">
                <button
                  type="submit"
                  className="btn btn-pri"
                  disabled={enviando}
                  data-testid="login-enviar"
                >
                  {enviando ? 'Ingresando…' : 'Ingresar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
