import { useNavigate } from 'react-router-dom';

export default function AseguradoraFormPage() {
  const navigate = useNavigate();
  const back = () => navigate('/configuracion/aseguradoras');

  return (
    <>
      <div className="det-back" onClick={back}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Volver a aseguradoras
      </div>

      <div className="cf-bar">
        <div>
          <div className="h1" style={{ fontSize: 19 }}>Nueva aseguradora</div>
          <div className="psub" style={{ marginTop: 2 }}>Datos de contacto y retenciones</div>
        </div>
        <div style={{ flex: 1 }} />
        <button className="btn btn-gh" onClick={back} type="button">Cancelar</button>
        <button className="btn" onClick={back} type="button">Guardar borrador</button>
        <button className="btn btn-pri" onClick={back} type="button">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Crear aseguradora
        </button>
      </div>

      <div className="cf-grid">
        <div className="card fsec">
          <div className="fsec-h">
            <div className="fsec-ic">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <div className="fsec-t">Datos de la aseguradora</div>
              <div className="fsec-d">Identificación y contacto</div>
            </div>
          </div>
          <div className="fsec-b">
            <div className="fgrid">
              <div className="field">
                <label className="lbl">Nombre <span className="req">*</span></label>
                <input className="inp" placeholder="Nombre de la aseguradora" />
              </div>
              <div className="field">
                <label className="lbl">NIT <span className="req">*</span></label>
                <input className="inp" placeholder="Ej. 860.026.182-5" />
              </div>
              <div className="field">
                <label className="lbl">Email</label>
                <input className="inp" placeholder="correo@ejemplo.com" />
              </div>
              <div className="field">
                <label className="lbl">Teléfono</label>
                <input className="inp" placeholder="+57" />
              </div>
              <div className="field">
                <label className="lbl">Dirección</label>
                <input className="inp" placeholder="Dirección" />
              </div>
              <div className="field">
                <label className="lbl">Cuenta bancaria</label>
                <input className="inp" placeholder="Nº de cuenta" />
              </div>
              <div className="field">
                <label className="lbl">Link de pago</label>
                <input className="inp" placeholder="www.linkdepago.com" />
              </div>
              <div className="field">
                <label className="lbl">Código intermediario</label>
                <input className="inp" placeholder="Código" />
              </div>
            </div>
          </div>
        </div>

        <div className="card fsec">
          <div className="fsec-h">
            <div className="fsec-ic">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div>
              <div className="fsec-t">Retenciones e impuestos</div>
              <div className="fsec-d">Porcentajes aplicables a esta aseguradora</div>
            </div>
          </div>
          <div className="fsec-b">
            <div className="fgrid">
              <div className="field">
                <label className="lbl">% Retención <span className="req">*</span></label>
                <input className="inp" placeholder="0.00" />
              </div>
              <div className="field">
                <label className="lbl">% IVA <span className="req">*</span></label>
                <input className="inp" defaultValue="19.00" />
              </div>
              <div className="field">
                <label className="lbl">% Retención IVA <span className="req">*</span></label>
                <input className="inp" placeholder="0.00" />
              </div>
              <div className="field">
                <label className="lbl">% Retención ICA <span className="req">*</span></label>
                <input className="inp" placeholder="0.00" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
