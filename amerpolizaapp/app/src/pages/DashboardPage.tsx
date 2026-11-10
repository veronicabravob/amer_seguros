import { Link } from 'react-router-dom';
import { attentionItems, policies, productionRaw } from '../data/mockData';
import { productionChart, ramosCartera } from '../data/helpers';

export default function DashboardPage() {
  const production = productionChart(productionRaw);
  const ramos = ramosCartera(policies);

  return (
    <>
      <div className="pagehd">
        <div>
          <h1 className="h1">Resumen de pólizas</h1>
          <p className="psub">Estado general de la cartera · actualizado hoy</p>
        </div>
        <Link to="/polizas/nueva" className="btn btn-pri">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Crear póliza
        </Link>
      </div>

      <div className="kpis">
        <div className="card kpi">
          <div className="kpi-ic" style={{ background: 'var(--brand-t)', color: 'var(--brand)' }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="kpi-num">685</div>
          <div className="kpi-lbl">Pólizas activas</div>
          <div className="kpi-dl up">▲ 4.2% vs mes anterior</div>
        </div>
        <div className="card kpi">
          <div className="kpi-ic" style={{ background: 'var(--teal-t)', color: 'var(--teal)' }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="kpi-num">$4.812M</div>
          <div className="kpi-lbl">Prima anual en cartera</div>
          <div className="kpi-dl up">▲ 6.8% vs mes anterior</div>
        </div>
        <div className="card kpi">
          <div className="kpi-ic" style={{ background: 'var(--amb-t)', color: 'var(--amb)' }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          </div>
          <div className="kpi-num">23</div>
          <div className="kpi-lbl">Por vencer (30 días)</div>
          <div className="kpi-dl wn">Requieren gestión</div>
        </div>
        <div className="card kpi">
          <div className="kpi-ic" style={{ background: 'var(--vio-t)', color: 'var(--vio)' }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
          </div>
          <div className="kpi-num">11</div>
          <div className="kpi-lbl">Renovaciones abiertas</div>
          <div className="kpi-dl dn">3 vencidas</div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="card">
          <div className="sec-hd">
            <div className="sec-t">Requiere tu atención</div>
            <Link to="/polizas" className="link-sm">Ver todo →</Link>
          </div>
          {attentionItems.map((a) => (
            <div className="att-item" key={a.client + a.detail}>
              <span className={`att-dot ${a.cls}`} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="att-cli">{a.client}</div>
                <div className="att-meta">{a.detail}</div>
              </div>
              <span className={`att-type ${a.cls}`}>{a.type}</span>
              <button className="btn btn-sm" type="button">{a.cta}</button>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="sec-hd">
            <div className="sec-t">Producción mensual</div>
          </div>
          <div className="prod-b">
            <div className="prod-head">
              <div className="prod-num">18</div>
              <div className="prod-lbl">pólizas nuevas<br />este mes</div>
              <div style={{ flex: 1 }} />
              <span className="kpi-dl up">▲ 12%</span>
            </div>
            <div className="prodchart">
              {production.map((m) => (
                <div className={`prodcol ${m.cls}`} key={m.m}>
                  <div className="prodbar" style={{ height: m.pct }} />
                  <span className="prodlbl">{m.m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="dash-grid" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="sec-hd">
            <div className="sec-t">Cartera por ramo</div>
          </div>
          <div style={{ padding: '8px 0 12px' }}>
            {ramos.map((r) => (
              <div className="ramo-row" key={r.name}>
                <div className="ramo-top">
                  <b>{r.name}</b>
                  <span>{r.count} · {r.label}</span>
                </div>
                <div className="bar">
                  <i style={{ width: r.pct }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="sec-hd">
            <div className="sec-t">Actividad reciente</div>
          </div>
          <div className="timeline" style={{ padding: '10px 18px 16px' }}>
            <div className="tl-item">
              <div className="tl-dot" />
              <div>
                <div className="tl-t">Póliza 994-0024-14 creada</div>
                <div className="tl-d">Hace 2 h · Laura Gómez</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot" style={{ background: 'var(--grn)', boxShadow: '0 0 0 3px var(--grn-t)' }} />
              <div>
                <div className="tl-t">Pago registrado · CUM-9932-77</div>
                <div className="tl-d">Hace 5 h · $ 31.500.000</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot" style={{ background: 'var(--amb)', boxShadow: '0 0 0 3px var(--amb-t)' }} />
              <div>
                <div className="tl-t">Recordatorio enviado · Orbe Ingeniería</div>
                <div className="tl-d">Ayer · WhatsApp</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot" style={{ background: 'var(--teal)', boxShadow: '0 0 0 3px var(--teal-t)' }} />
              <div>
                <div className="tl-t">Renovación completada · VID-2210-33</div>
                <div className="tl-d">Ayer · Andrea Martínez</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
