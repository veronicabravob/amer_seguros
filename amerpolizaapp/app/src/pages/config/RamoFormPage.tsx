import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { aseguradoras } from '../../data/mockData';
import Switch from '../../components/ui/Switch';

const COMISIONES = [
  { aseg: aseguradoras[1]?.name ?? 'AXA Colpatria Seguros', iva: '19.00%', com: '15.00%', gastos: '$ 45.000' },
  { aseg: aseguradoras[7]?.name ?? 'Mundial de Seguros SA', iva: '19.00%', com: '20.00%', gastos: '$ 38.000' },
  { aseg: aseguradoras[3]?.name ?? 'HDI Seguros', iva: '19.00%', com: '12.00%', gastos: '$ 50.000' },
];

export default function RamoFormPage() {
  const navigate = useNavigate();
  const back = () => navigate('/configuracion/ramos');

  const [ivaGastos, setIvaGastos] = useState(false);
  const [mostrarMapa, setMostrarMapa] = useState(true);

  return (
    <>
      <div className="det-back" onClick={back}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Volver a ramos
      </div>

      <div className="cf-bar">
        <div>
          <div className="h1" style={{ fontSize: 19 }}>Nuevo ramo</div>
          <div className="psub" style={{ marginTop: 2 }}>Línea de negocio y comisiones por aseguradora</div>
        </div>
        <div style={{ flex: 1 }} />
        <button className="btn btn-gh" onClick={back} type="button">Cancelar</button>
        <button className="btn btn-pri" onClick={back} type="button">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Crear ramo
        </button>
      </div>

      <div className="cf-grid">
        <div className="card fsec">
          <div className="fsec-h">
            <div className="fsec-ic">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </div>
            <div>
              <div className="fsec-t">Datos principales</div>
              <div className="fsec-d">Ramo, subramo y opciones de cálculo</div>
            </div>
          </div>
          <div className="fsec-b">
            <div className="fgrid">
              <div className="field">
                <label className="lbl">Ramo principal <span className="req">*</span></label>
                <select className="inp">
                  <option>Seleccionar…</option>
                  <option>Autos/Vehículos</option>
                  <option>Cumplimiento</option>
                  <option>Responsabilidad Civil</option>
                  <option>Vida</option>
                  <option>Salud</option>
                  <option>Transporte</option>
                  <option>Todo Riesgo</option>
                  <option>Manejo</option>
                </select>
              </div>
              <div className="field">
                <label className="lbl">Subramo <span className="req">*</span></label>
                <input className="inp" placeholder="Ej. Livianos, Pesados, Grupo…" />
              </div>
            </div>
            <div className="trow" style={{ marginTop: 6 }}>
              <span className="trow-l">Calcular IVA a gastos de expedición</span>
              <Switch on={ivaGastos} onToggle={() => setIvaGastos((v) => !v)} />
            </div>
            <div className="trow" style={{ borderBottom: 'none' }}>
              <span className="trow-l">Mostrar en mapa de oportunidad</span>
              <Switch on={mostrarMapa} onToggle={() => setMostrarMapa((v) => !v)} />
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
            <div style={{ flex: 1 }}>
              <div className="fsec-t">Comisiones por aseguradora</div>
              <div className="fsec-d">Define IVA, comisión y gastos por defecto por cada compañía</div>
            </div>
            <button className="btn btn-sm" type="button">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Agregar
            </button>
          </div>
          <div className="fsec-b" style={{ padding: 0 }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Aseguradora</th>
                  <th>% IVA</th>
                  <th>% Comisión</th>
                  <th>Gastos por defecto</th>
                </tr>
              </thead>
              <tbody>
                {COMISIONES.map((c) => (
                  <tr className="prow" key={c.aseg}>
                    <td>{c.aseg}</td>
                    <td className="money">{c.iva}</td>
                    <td className="money">{c.com}</td>
                    <td className="money">{c.gastos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
