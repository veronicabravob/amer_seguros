import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sedes } from '../../data/mockData';
import Switch from '../../components/ui/Switch';

export default function UsuarioFormPage() {
  const navigate = useNavigate();

  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [celular, setCelular] = useState('');
  const [genero, setGenero] = useState('Femenino');
  const [nacimiento, setNacimiento] = useState('');

  const [perfil, setPerfil] = useState('');
  const [sede, setSede] = useState(sedes[0]?.name ?? '');
  const [activa, setActiva] = useState(true);
  const [autoriza, setAutoriza] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [autoPassword, setAutoPassword] = useState(true);

  function goBack() {
    navigate('/configuracion/usuarios');
  }

  function submit() {
    navigate('/configuracion/usuarios');
  }

  return (
    <>
      <div className="det-back" onClick={goBack}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Volver a usuarios
      </div>

      <div className="cf-bar">
        <div>
          <div className="h1" style={{ fontSize: 19 }}>Nuevo usuario</div>
          <div className="psub" style={{ marginTop: 2 }}>Crea una cuenta de acceso para el equipo</div>
        </div>
        <div style={{ flex: 1 }} />
        <button className="btn btn-gh" type="button" onClick={goBack}>Cancelar</button>
        <button className="btn btn-gh" type="button">Guardar borrador</button>
        <button className="btn btn-pri" type="button" onClick={submit}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Crear usuario
        </button>
      </div>

      <div className="cf-grid">
        <div className="card fsec">
          <div className="fsec-h">
            <div className="fsec-ic">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
              </svg>
            </div>
            <div>
              <div className="fsec-t">Datos principales</div>
              <div className="fsec-d">Identificación de la persona</div>
            </div>
          </div>
          <div className="fsec-b">
            <div className="fgrid">
              <div className="field">
                <label className="lbl">Nombres <span className="req">*</span></label>
                <input className="inp" placeholder="Nombres" value={nombres} onChange={(e) => setNombres(e.target.value)} />
              </div>
              <div className="field">
                <label className="lbl">Apellidos <span className="req">*</span></label>
                <input className="inp" placeholder="Apellidos" value={apellidos} onChange={(e) => setApellidos(e.target.value)} />
              </div>
              <div className="field">
                <label className="lbl">Correo <span className="req">*</span></label>
                <input className="inp" placeholder="correo@amerseguros.com" value={correo} onChange={(e) => setCorreo(e.target.value)} />
              </div>
              <div className="field">
                <label className="lbl">Celular</label>
                <input className="inp" placeholder="+57" value={celular} onChange={(e) => setCelular(e.target.value)} />
              </div>
              <div className="field">
                <label className="lbl">Género</label>
                <select className="inp" value={genero} onChange={(e) => setGenero(e.target.value)}>
                  <option>Femenino</option>
                  <option>Masculino</option>
                  <option>Otro</option>
                </select>
              </div>
              <div className="field">
                <label className="lbl">Fecha de nacimiento</label>
                <input className="inp" type="date" value={nacimiento} onChange={(e) => setNacimiento(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="card fsec">
          <div className="fsec-h">
            <div className="fsec-ic">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2 4 5v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V5z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div>
              <div className="fsec-t">Perfil y acceso</div>
              <div className="fsec-d">Rol, sede y estado de la cuenta</div>
            </div>
          </div>
          <div className="fsec-b">
            <div className="fgrid">
              <div className="field">
                <label className="lbl">Perfil <span className="req">*</span></label>
                <select className="inp" value={perfil} onChange={(e) => setPerfil(e.target.value)}>
                  <option value="">Seleccionar…</option>
                  <option>Administrador</option>
                  <option>Asesor comercial</option>
                  <option>Cobros</option>
                  <option>Recepción</option>
                </select>
              </div>
              <div className="field">
                <label className="lbl">Sede <span className="req">*</span></label>
                <select className="inp" value={sede} onChange={(e) => setSede(e.target.value)}>
                  {sedes.map((s) => (
                    <option key={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="trow" style={{ marginTop: 6 }}>
              <span className="trow-l">Cuenta activa</span>
              <Switch on={activa} onToggle={() => setActiva((v) => !v)} />
            </div>
            <div className="trow" style={{ borderBottom: 'none' }}>
              <span className="trow-l">Autoriza tratamiento de datos</span>
              <Switch on={autoriza} onToggle={() => setAutoriza((v) => !v)} />
            </div>
          </div>
        </div>

        <div className="card fsec">
          <div className="fsec-h">
            <div className="fsec-ic">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <div className="fsec-t">Autenticación</div>
              <div className="fsec-d">Credenciales de ingreso</div>
            </div>
          </div>
          <div className="fsec-b">
            <div className="fgrid">
              <div className="field">
                <label className="lbl">Nombre de usuario <span className="req">*</span></label>
                <input className="inp" placeholder="usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="field" />
              <div className="field">
                <label className="lbl">Contraseña {!autoPassword && <span className="req">*</span>}</label>
                <input
                  className="inp"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={autoPassword}
                />
              </div>
              <div className="field">
                <label className="lbl">Confirmar contraseña {!autoPassword && <span className="req">*</span>}</label>
                <input
                  className="inp"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={autoPassword}
                />
              </div>
            </div>
            <div className="trow" style={{ borderBottom: 'none', marginTop: 4 }}>
              <span className="trow-l">Generar contraseña automáticamente y enviar por correo</span>
              <Switch on={autoPassword} onToggle={() => setAutoPassword((v) => !v)} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
