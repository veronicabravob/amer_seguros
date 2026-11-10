import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { asesores, ramosCatalogo } from '../../data/mockData';
import { fmt } from '../../data/helpers';

type Tipo = 'Individual' | 'Colectiva' | 'Agrupadora';

const STEP_DEFS = [
  { n: 1, title: 'Identificación', desc: 'Tipo, cliente, aseguradora' },
  { n: 2, title: 'Vigencia y riesgo', desc: 'Fechas y cobertura' },
  { n: 3, title: 'Prima y comisiones', desc: 'Valores y cálculo' },
  { n: 4, title: 'Vendedor', desc: 'Asesor y confirmación' },
];

export default function PolizaCreatePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [tipo, setTipo] = useState<Tipo>('Individual');
  const [num, setNum] = useState('');
  const [cli, setCli] = useState('');
  const [aseg, setAseg] = useState('');
  const [ramo, setRamo] = useState('');
  const [prima, setPrima] = useState('');

  const steps = STEP_DEFS.map((s) => ({
    ...s,
    mark: step > s.n ? '✓' : String(s.n),
    cls: step === s.n ? 'on' : step > s.n ? 'done' : '',
  }));

  const sSub = tipo + (ramo && ramo !== 'Seleccionar…' ? ' · ' + ramo : '');
  const sPrima = prima ? fmt(+String(prima).replace(/[^0-9]/g, '') || 0) : '$ 0';

  function submit() {
    navigate('/polizas');
  }

  return (
    <>
      <div className="det-back" onClick={() => navigate('/polizas')}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Volver al listado
      </div>

      <div className="c2-wrap">
        <div className="card c2-scr">
          <div className="c2-top">
            <div>
              <div className="h1" style={{ fontSize: 18 }}>Crear póliza</div>
              <div className="psub" style={{ marginTop: 2 }}>{sSub}</div>
            </div>
            <div style={{ flex: 1 }} />
            <span className="c2-save">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0C8A62" strokeWidth="2.4">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Borrador guardado
            </span>
          </div>

          <div className="c2-pane">
            <div className="c2-idx">
              {steps.map((s) => (
                <div key={s.n} className={`c2-item ${s.cls}`} onClick={() => setStep(s.n)}>
                  <span className="c2-dot">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                  <div>
                    <div className="c2-it-t">{s.title}</div>
                    <div className="c2-it-d">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="c2-form">
              <div className="form-top">
                <span className="form-step">Paso {step} de 4</span>
                <div className="mini-prog"><i style={{ width: (step / 4) * 100 + '%' }} /></div>
              </div>

              {step === 1 && (
                <>
                  <h2 className="form-h">Identificación</h2>
                  <p className="form-hd">Tipo de póliza, número, cliente y aseguradora.</p>
                  <div className="c2-seg">
                    <div className={tipo === 'Individual' ? 'on' : ''} onClick={() => setTipo('Individual')}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
                      </svg>
                      Individual
                    </div>
                    <div className={tipo === 'Colectiva' ? 'on' : ''} onClick={() => setTipo('Colectiva')}>Colectiva</div>
                    <div className={tipo === 'Agrupadora' ? 'on' : ''} onClick={() => setTipo('Agrupadora')}>Agrupadora</div>
                  </div>
                  <div className="fgrid">
                    <div className="field">
                      <label className="lbl">Número de póliza <span className="req">*</span></label>
                      <input className="inp" placeholder="Ej. 994-0031-88" value={num} onChange={(e) => setNum(e.target.value)} />
                    </div>
                    <div className="field">
                      <label className="lbl">Cliente <span className="req">*</span></label>
                      <input className="inp" placeholder="Buscar cliente…" value={cli} onChange={(e) => setCli(e.target.value)} />
                    </div>
                    <div className="field">
                      <label className="lbl">Aseguradora <span className="req">*</span></label>
                      <select className="inp" value={aseg} onChange={(e) => setAseg(e.target.value)}>
                        <option>Seleccionar…</option>
                        <option>Seguros SURA</option>
                        <option>Seguros Bolívar</option>
                        <option>Mundial de Seguros</option>
                        <option>Solidaria</option>
                        <option>Allianz</option>
                      </select>
                    </div>
                    <div className="field">
                      <label className="lbl">Ramo <span className="req">*</span></label>
                      <select className="inp" value={ramo} onChange={(e) => setRamo(e.target.value)}>
                        <option>Seleccionar…</option>
                        {ramosCatalogo.map((r) => <option key={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>

                  {tipo === 'Colectiva' && (
                    <>
                      <div className="fgrid" style={{ marginTop: 16 }}>
                        <div className="field">
                          <label className="lbl">Tipo de colectivo <span className="req">*</span></label>
                          <select className="inp">
                            <option>Empleados</option>
                            <option>Deudores</option>
                            <option>Estudiantes</option>
                            <option>Asociados</option>
                          </select>
                        </div>
                        <div className="field">
                          <label className="lbl">Número de asegurados <span className="req">*</span></label>
                          <input className="inp" placeholder="Ej. 45" />
                        </div>
                      </div>
                      <div className="hint" style={{ marginTop: 9 }}>En pólizas colectivas los asegurados y beneficiarios se gestionan como grupo desde la pestaña «Asegurados».</div>
                    </>
                  )}
                  {tipo === 'Agrupadora' && (
                    <>
                      <div className="fgrid" style={{ marginTop: 16 }}>
                        <div className="field">
                          <label className="lbl">Criterio de agrupación <span className="req">*</span></label>
                          <select className="inp">
                            <option>Por cliente</option>
                            <option>Por ramo</option>
                            <option>Por aseguradora</option>
                          </select>
                        </div>
                        <div className="field">
                          <label className="lbl">Nº de pólizas a agrupar</label>
                          <input className="inp" placeholder="Ej. 6" />
                        </div>
                      </div>
                      <div className="hint" style={{ marginTop: 9 }}>Una póliza agrupadora consolida varias pólizas hijas; la prima total es la suma de las agrupadas.</div>
                    </>
                  )}
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="form-h">Vigencia y riesgo</h2>
                  <p className="form-hd">Fechas de cobertura y descripción del riesgo asegurado.</p>
                  <div className="fgrid">
                    <div className="field">
                      <label className="lbl">Fecha de inicio <span className="req">*</span></label>
                      <input className="inp" type="date" />
                    </div>
                    <div className="field">
                      <label className="lbl">Fecha de fin <span className="req">*</span></label>
                      <input className="inp" type="date" />
                    </div>
                    <div className="field">
                      <label className="lbl">Estado</label>
                      <select className="inp">
                        <option>Vigente</option>
                        <option>Pendiente</option>
                        <option>Renovación</option>
                      </select>
                    </div>
                    <div className="field">
                      <label className="lbl">¿Es renovable?</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 42 }}>
                        <div className="switch"><i /></div>
                        <span style={{ fontSize: 13, color: 'var(--ink2)' }}>Sí — aviso 30 días antes</span>
                      </div>
                    </div>
                    {tipo === 'Individual' && (
                      <div className="field full">
                        <label className="lbl">Riesgo (placa, dirección, contrato…)</label>
                        <input className="inp" placeholder="Descripción del riesgo asegurado" />
                      </div>
                    )}
                    {tipo === 'Colectiva' && (
                      <div className="field full">
                        <label className="lbl">Descripción del grupo asegurado</label>
                        <input className="inp" placeholder="Ej. Empleados de nómina 2026" />
                      </div>
                    )}
                    {tipo === 'Agrupadora' && (
                      <div className="field full">
                        <label className="lbl">Alcance de la agrupación</label>
                        <input className="inp" placeholder="Ej. Todas las pólizas de autos del cliente" />
                      </div>
                    )}
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="form-h">Prima y comisiones</h2>
                  <p className="form-hd">Los gastos, IVA y comisión se autocalculan; puedes ajustarlos.</p>
                  <div className="fgrid">
                    <div className="field">
                      <label className="lbl">Prima neta <span className="req">*</span></label>
                      <input className="inp" placeholder="$ 0" value={prima} onChange={(e) => setPrima(e.target.value)} />
                    </div>
                    <div className="field">
                      <label className="lbl">Valor asegurado</label>
                      <input className="inp" placeholder="$ 0" />
                    </div>
                    <div className="field">
                      <label className="lbl">% IVA</label>
                      <input className="inp" defaultValue="19.00" />
                    </div>
                    <div className="field">
                      <label className="lbl">% Comisión</label>
                      <input className="inp" defaultValue="20.00" />
                    </div>
                  </div>
                  <div className="c2-tot">
                    <span className="tl">Total estimado (IVA incluido)</span>
                    <span className="tv">{sPrima}</span>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <h2 className="form-h">Vendedor y resumen</h2>
                  <p className="form-hd">Asigna el asesor y revisa antes de guardar.</p>
                  <div className="fgrid" style={{ marginBottom: 22 }}>
                    <div className="field">
                      <label className="lbl">Asesor asignado <span className="req">*</span></label>
                      <select className="inp">
                        {asesores.map((a) => <option key={a}>{a}</option>)}
                      </select>
                    </div>
                    <div className="field">
                      <label className="lbl">Fecha de expedición</label>
                      <input className="inp" type="date" />
                    </div>
                  </div>
                  <div className="sum">
                    <div className="sum-row"><span className="sum-l">Tipo de póliza</span><b>{tipo}</b></div>
                    <div className="sum-row"><span className="sum-l">Prima neta</span><b>{sPrima}</b></div>
                    <div className="sum-row"><span className="sum-l">IVA (19%)</span><b>Autocalculado</b></div>
                    <div className="sum-row"><span className="sum-l">Comisión agencia (20%)</span><b>Autocalculado</b></div>
                  </div>
                </>
              )}

              <div className="form-foot">
                {step > 1 ? (
                  <button className="btn" onClick={() => setStep((s) => Math.max(1, s - 1))} type="button">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Anterior
                  </button>
                ) : <span />}
                {step < 4 ? (
                  <button className="btn btn-pri" onClick={() => setStep((s) => Math.min(4, s + 1))} type="button">
                    Siguiente sección
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <button className="btn btn-pri" onClick={submit} type="button">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Crear póliza
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
