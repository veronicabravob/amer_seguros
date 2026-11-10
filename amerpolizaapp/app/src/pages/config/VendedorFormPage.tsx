import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sedes } from '../../data/mockData';
import Switch from '../../components/ui/Switch';

type TipoPersona = 'Natural' | 'Jurídica';

export default function VendedorFormPage() {
  const navigate = useNavigate();

  const [nombres, setNombres] = useState('');
  const [tipoPersona, setTipoPersona] = useState<TipoPersona>('Natural');
  const [tipoDoc, setTipoDoc] = useState('Cédula de ciudadanía');
  const [numDoc, setNumDoc] = useState('');
  const [celular, setCelular] = useState('');
  const [email, setEmail] = useState('');
  const [cuenta, setCuenta] = useState('');
  const [sede, setSede] = useState(sedes[0]?.name ?? '');

  const [comision, setComision] = useState('');
  const [calcularSobre, setCalcularSobre] = useState('Prima neta');
  const [retencion, setRetencion] = useState('0.00');
  const [retencionIca, setRetencionIca] = useState('');
  const [iva, setIva] = useState('19.00');
  const [esAgencia, setEsAgencia] = useState(false);
  const [difPorAnio, setDifPorAnio] = useState(false);

  function goBack() {
    navigate('/configuracion/vendedores');
  }

  function submit() {
    navigate('/configuracion/vendedores');
  }

  return (
    <>
      <div className="det-back" onClick={goBack}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Volver a vendedores
      </div>

      <div className="cf-bar">
        <div>
          <div className="h1" style={{ fontSize: 19 }}>Nuevo vendedor</div>
          <div className="psub" style={{ marginTop: 2 }}>Datos del asesor y esquema de comisiones</div>
        </div>
        <div style={{ flex: 1 }} />
        <button className="btn btn-gh" type="button" onClick={goBack}>Cancelar</button>
        <button className="btn btn-pri" type="button" onClick={submit}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Crear vendedor
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
              <div className="fsec-d">Identificación y contacto</div>
            </div>
          </div>
          <div className="fsec-b">
            <div className="fgrid">
              <div className="field">
                <label className="lbl">Nombres <span className="req">*</span></label>
                <input className="inp" placeholder="Nombre completo" value={nombres} onChange={(e) => setNombres(e.target.value)} />
              </div>
              <div className="field">
                <label className="lbl">Tipo de persona</label>
                <select className="inp" value={tipoPersona} onChange={(e) => setTipoPersona(e.target.value as TipoPersona)}>
                  <option>Natural</option>
                  <option>Jurídica</option>
                </select>
              </div>
              <div className="field">
                <label className="lbl">Tipo de documento</label>
                <select className="inp" value={tipoDoc} onChange={(e) => setTipoDoc(e.target.value)}>
                  <option>Cédula de ciudadanía</option>
                  <option>NIT</option>
                  <option>Cédula de extranjería</option>
                </select>
              </div>
              <div className="field">
                <label className="lbl">Número de documento</label>
                <input className="inp" placeholder="Número" value={numDoc} onChange={(e) => setNumDoc(e.target.value)} />
              </div>
              <div className="field">
                <label className="lbl">Celular</label>
                <input className="inp" placeholder="+57" value={celular} onChange={(e) => setCelular(e.target.value)} />
              </div>
              <div className="field">
                <label className="lbl">Email</label>
                <input className="inp" placeholder="correo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="field">
                <label className="lbl">Cuenta bancaria</label>
                <input className="inp" placeholder="Nº de cuenta" value={cuenta} onChange={(e) => setCuenta(e.target.value)} />
              </div>
              <div className="field">
                <label className="lbl">Sede</label>
                <select className="inp" value={sede} onChange={(e) => setSede(e.target.value)}>
                  {sedes.map((s) => (
                    <option key={s.name}>{s.name}</option>
                  ))}
                </select>
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
              <div className="fsec-t">Esquema de comisiones</div>
              <div className="fsec-d">Porcentajes y retenciones</div>
            </div>
          </div>
          <div className="fsec-b">
            <div className="fgrid">
              <div className="field">
                <label className="lbl">% Comisión <span className="req">*</span></label>
                <input className="inp" placeholder="0.00" value={comision} onChange={(e) => setComision(e.target.value)} />
              </div>
              <div className="field">
                <label className="lbl">Calcular comisión sobre</label>
                <select className="inp" value={calcularSobre} onChange={(e) => setCalcularSobre(e.target.value)}>
                  <option>Prima neta</option>
                  <option>Comisión agencia con deducciones</option>
                  <option>Comisión agencia sin deducciones</option>
                </select>
              </div>
              <div className="field">
                <label className="lbl">% Retención <span className="req">*</span></label>
                <input className="inp" value={retencion} onChange={(e) => setRetencion(e.target.value)} />
              </div>
              <div className="field">
                <label className="lbl">% Retención ICA</label>
                <input className="inp" placeholder="0.00" value={retencionIca} onChange={(e) => setRetencionIca(e.target.value)} />
              </div>
              <div className="field">
                <label className="lbl">% IVA <span className="req">*</span></label>
                <input className="inp" value={iva} onChange={(e) => setIva(e.target.value)} />
              </div>
            </div>
            <div className="trow" style={{ marginTop: 6 }}>
              <span className="trow-l">Es agencia</span>
              <Switch on={esAgencia} onToggle={() => setEsAgencia((v) => !v)} />
            </div>
            <div className="trow" style={{ borderBottom: 'none' }}>
              <span className="trow-l">Comisiones diferentes por año</span>
              <Switch on={difPorAnio} onToggle={() => setDifPorAnio((v) => !v)} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
