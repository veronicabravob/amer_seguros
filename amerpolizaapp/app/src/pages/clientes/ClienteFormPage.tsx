import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Switch from '../../components/ui/Switch';

export default function ClienteFormPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const tipo = params.get('tipo') || 'Persona';

  const [casaPropia, setCasaPropia] = useState(false);
  const [hijos, setHijos] = useState(false);
  const [vehiculo, setVehiculo] = useState(false);
  const [autorizaDatos, setAutorizaDatos] = useState(true);

  const [notifVencer, setNotifVencer] = useState(true);
  const [notifCobros, setNotifCobros] = useState(true);
  const [notifSoat, setNotifSoat] = useState(false);
  const [notifCumple, setNotifCumple] = useState(false);
  const [notifCancel, setNotifCancel] = useState(false);

  function submit() {
    navigate('/clientes');
  }

  return (
    <>
      <div className="det-back" onClick={() => navigate('/clientes')}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Volver a clientes
      </div>

      <div className="cf-bar">
        <div>
          <div className="h1" style={{ fontSize: 19 }}>Nuevo cliente</div>
          <div className="psub" style={{ marginTop: 2 }}>Tipo de cliente: {tipo}</div>
        </div>
        <div style={{ flex: 1 }} />
        <button className="btn btn-gh" onClick={() => navigate('/clientes')} type="button">Cancelar</button>
        <button className="btn" type="button">Guardar borrador</button>
        <button className="btn btn-pri" onClick={submit} type="button">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Crear cliente
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
              <div className="fsec-d">Identificación del cliente</div>
            </div>
          </div>
          <div className="fsec-b">
            <div className="fgrid">
              <div className="field">
                <label className="lbl">Nombres <span className="req">*</span></label>
                <input className="inp" placeholder="Nombres" />
              </div>
              <div className="field">
                <label className="lbl">Apellidos <span className="req">*</span></label>
                <input className="inp" placeholder="Apellidos" />
              </div>
              <div className="field">
                <label className="lbl">Tipo de documento <span className="req">*</span></label>
                <select className="inp" defaultValue="Cédula de ciudadanía">
                  <option>Cédula de ciudadanía</option>
                  <option>Cédula de extranjería</option>
                  <option>NIT</option>
                  <option>Pasaporte</option>
                </select>
              </div>
              <div className="field">
                <label className="lbl">Número de documento <span className="req">*</span></label>
                <input className="inp" placeholder="Número de documento" />
              </div>
              <div className="field">
                <label className="lbl">Género</label>
                <select className="inp" defaultValue="Femenino">
                  <option>Femenino</option>
                  <option>Masculino</option>
                  <option>Otro</option>
                </select>
              </div>
              <div className="field">
                <label className="lbl">Fecha de nacimiento</label>
                <input className="inp" type="date" />
              </div>
            </div>
            <div className="field" style={{ marginTop: 16 }}>
              <label className="lbl">Observaciones</label>
              <textarea className="inp" style={{ height: 74, paddingTop: 10 }} placeholder="Notas internas sobre el cliente" />
            </div>
          </div>
        </div>

        <div className="card fsec">
          <div className="fsec-h">
            <div className="fsec-ic">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div>
              <div className="fsec-t">Datos de contacto</div>
              <div className="fsec-d">Ubicación y medios de contacto</div>
            </div>
          </div>
          <div className="fsec-b">
            <div className="fgrid">
              <div className="field">
                <label className="lbl">País <span className="req">*</span></label>
                <select className="inp" defaultValue="Colombia">
                  <option>Colombia</option>
                </select>
              </div>
              <div className="field">
                <label className="lbl">Departamento</label>
                <select className="inp" defaultValue="Boyacá">
                  <option>Boyacá</option>
                  <option>Cundinamarca</option>
                  <option>Santander</option>
                </select>
              </div>
              <div className="field">
                <label className="lbl">Ciudad</label>
                <select className="inp" defaultValue="Duitama">
                  <option>Duitama</option>
                  <option>Tunja</option>
                  <option>Sogamoso</option>
                  <option>Paipa</option>
                </select>
              </div>
              <div className="field">
                <label className="lbl">Teléfono <span className="req">*</span></label>
                <input className="inp" placeholder="+57" />
              </div>
              <div className="field full">
                <label className="lbl">Dirección</label>
                <input className="inp" placeholder="Dirección de residencia o empresa" />
              </div>
              <div className="field full">
                <label className="lbl">Correo electrónico</label>
                <input className="inp" placeholder="correo@ejemplo.com" />
              </div>
            </div>
          </div>
        </div>

        <div className="card fsec">
          <div className="fsec-h">
            <div className="fsec-ic">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v18h18" />
                <path d="M18 17V9M13 17V5M8 17v-4" />
              </svg>
            </div>
            <div>
              <div className="fsec-t">Información CRM</div>
              <div className="fsec-d">Perfil comercial y patrimonial</div>
            </div>
          </div>
          <div className="fsec-b">
            <div className="fgrid">
              <div className="field">
                <label className="lbl">Estado civil</label>
                <select className="inp" defaultValue="Soltero(a)">
                  <option>Soltero(a)</option>
                  <option>Casado(a)</option>
                  <option>Unión libre</option>
                  <option>Divorciado(a)</option>
                </select>
              </div>
              <div className="field">
                <label className="lbl">Ingreso mensual</label>
                <input className="inp" placeholder="$ 0" />
              </div>
              <div className="field">
                <label className="lbl">Patrimonio</label>
                <input className="inp" placeholder="$ 0" />
              </div>
              <div className="field">
                <label className="lbl">Categorías</label>
                <select className="inp" defaultValue="Seleccionar…">
                  <option>Seleccionar…</option>
                  <option>VIP</option>
                  <option>Corporativo</option>
                  <option>Referido</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: 8 }}>
              <div className="trow">
                <span className="trow-l">Casa propia</span>
                <Switch on={casaPropia} onToggle={() => setCasaPropia((v) => !v)} />
              </div>
              <div className="trow">
                <span className="trow-l">Tiene hijos</span>
                <Switch on={hijos} onToggle={() => setHijos((v) => !v)} />
              </div>
              <div className="trow">
                <span className="trow-l">Vehículo propio</span>
                <Switch on={vehiculo} onToggle={() => setVehiculo((v) => !v)} />
              </div>
              <div className="trow" style={{ borderBottom: 'none' }}>
                <span className="trow-l">Autoriza tratamiento de datos</span>
                <Switch on={autorizaDatos} onToggle={() => setAutorizaDatos((v) => !v)} />
              </div>
            </div>
          </div>
        </div>

        <div className="card fsec">
          <div className="fsec-h">
            <div className="fsec-ic">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-10 5L2 7" />
              </svg>
            </div>
            <div>
              <div className="fsec-t">Notificaciones</div>
              <div className="fsec-d">Correos automáticos al cliente</div>
            </div>
          </div>
          <div className="fsec-b">
            <div className="notif-row">
              <span>Póliza por vencer</span>
              <Switch small on={notifVencer} onToggle={() => setNotifVencer((v) => !v)} />
            </div>
            <div className="notif-row">
              <span>Cobros por vencer</span>
              <Switch small on={notifCobros} onToggle={() => setNotifCobros((v) => !v)} />
            </div>
            <div className="notif-row">
              <span>SOAT / Tecnomecánica por vencer</span>
              <Switch small on={notifSoat} onToggle={() => setNotifSoat((v) => !v)} />
            </div>
            <div className="notif-row">
              <span>Tarjeta de cumpleaños</span>
              <Switch small on={notifCumple} onToggle={() => setNotifCumple((v) => !v)} />
            </div>
            <div className="notif-row">
              <span>Aviso de cancelación</span>
              <Switch small on={notifCancel} onToggle={() => setNotifCancel((v) => !v)} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
