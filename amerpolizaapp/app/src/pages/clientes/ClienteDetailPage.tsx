import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { asesores, clients } from '../../data/mockData';
import { clientEstadoCls, clientTipoClasses, fmt, genPolizasFor, initialsOf, stCls } from '../../data/helpers';
import type { Client } from '../../types';
import Tabs, { type TabDef } from '../../components/ui/Tabs';
import StatusBadge from '../../components/ui/StatusBadge';
import Switch from '../../components/ui/Switch';

function deriveClientDetail(c: Client) {
  const categoria = c.polizas >= 4 ? 'VIP' : c.tipo === 'Empresa' ? 'Corporativo' : 'Estándar';
  const asesor = asesores[c.name.length % 3];
  const desde = ['2019', '2020', '2021', '2022', '2023'][c.name.length % 5];
  const actividad = c.tipo === 'Empresa' ? 'Construcción e ingeniería' : 'Persona natural';
  const direccion = 'Calle ' + (10 + (c.name.length % 40)) + ' # ' + (5 + (c.name.length % 20)) + '-' + (10 + (c.name.length % 80));
  const docLabel = c.docType + ' ' + c.doc;
  const polizasLabel = c.polizas + (c.polizas === 1 ? ' póliza' : ' pólizas');
  const polizas = genPolizasFor(c);
  const primaTotalFmt = c.polizas ? fmt(polizas.reduce((s, p) => s + p.prima, 0)) : '—';
  const { cavCls, tpCls, tpLabel } = clientTipoClasses(c.tipo);
  return {
    categoria,
    asesor,
    desde,
    actividad,
    direccion,
    docLabel,
    polizasLabel,
    polizas,
    primaTotalFmt,
    cavCls,
    tpCls,
    tpLabel,
    initials: initialsOf(c.name),
    estadoCls: clientEstadoCls(c.estado),
    emailShow: c.email || '—',
  };
}

export default function ClienteDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState('resumen');

  const [notifVencer, setNotifVencer] = useState(true);
  const [notifCobros, setNotifCobros] = useState(true);
  const [notifCumple, setNotifCumple] = useState(false);
  const [notifCancel, setNotifCancel] = useState(false);

  const c = clients.find((x) => x.id === id) || clients[0];
  const d = deriveClientDetail(c);

  const DET_TABS: TabDef[] = [
    { key: 'resumen', label: 'Resumen' },
    { key: 'polizas', label: 'Pólizas', count: String(c.polizas) },
    { key: 'contactos', label: 'Contactos', count: '1' },
    { key: 'archivos', label: 'Archivos', count: '3' },
    { key: 'siniestros', label: 'Siniestros', count: '0' },
    { key: 'notificaciones', label: 'Notificaciones' },
    { key: 'actividad', label: 'Actividad' },
  ];
  const curTab = DET_TABS.find((t) => t.key === tab) ?? DET_TABS[0];

  return (
    <>
      <div className="det-back" onClick={() => navigate('/clientes')}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Volver a clientes
      </div>

      <div className="det-hd">
        <div style={{ minWidth: 0 }}>
          <div className="det-title">
            <div className={`cav cav-lg ${d.cavCls}`}>{d.initials}</div>
            <span>{c.name}</span>
            <StatusBadge label={c.estado} cls={d.estadoCls} />
            <span className={`tp ${d.tpCls}`}>{d.tpLabel}</span>
          </div>
          <div className="det-quick">
            <span className="qi">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M7 9h4M7 13h6" />
              </svg>
              {d.docLabel}
            </span>
            <span className="qi">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 3.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.1 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z" />
              </svg>
              {c.tel}
            </span>
            <span className="qi">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-10 5L2 7" />
              </svg>
              {d.emailShow}
            </span>
            <span className="qi">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {c.ciudad}
            </span>
          </div>
        </div>
        <div className="det-actions">
          <button className="btn" type="button">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" />
            </svg>
            Editar
          </button>
          <button className="btn" type="button">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 3.1 2h3a2 2 0 0 1 2 1.7 12.8 12.8 0 0 0 .7 2.8 2 2 0 0 1-.5 2L7.1 9.6a16 16 0 0 0 6 6l1.4-1.6a2 2 0 0 1 2-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
            </svg>
            Contactar
          </button>
          <Link to="/polizas/nueva" className="btn btn-pri">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nueva póliza
          </Link>
        </div>
      </div>

      <Tabs tabs={DET_TABS} active={tab} onChange={setTab} />

      {tab === 'resumen' && (
        <div className="det-grid">
          <div className="card">
            <div className="sc-hd">Datos del cliente</div>
            <div className="info-grid">
              <InfoItem label="Documento" value={d.docLabel} mono />
              <InfoItem label="Tipo de cliente" value={c.tipo} />
              <InfoItem label="Teléfono" value={c.tel} />
              <InfoItem label="Correo" value={d.emailShow} />
              <InfoItem label="Ciudad" value={c.ciudad} />
              <InfoItem label="Dirección" value={d.direccion} />
              <InfoItem label="Actividad económica" value={d.actividad} />
              <InfoItem label="Cliente desde" value={d.desde} />
              <InfoItem label="Asesor asignado" value={d.asesor} />
            </div>
          </div>
          <div className="card side-card">
            <div className="prima-big">
              <div className="prima-num money">{d.primaTotalFmt}</div>
              <div className="prima-lbl">Prima anual · {d.polizasLabel}</div>
            </div>
            <div className="kv"><span className="k">Pólizas activas</span><span className="v">{c.polizas}</span></div>
            <div className="kv"><span className="k">Categoría</span><span className="v">{d.categoria}</span></div>
            <div className="kv"><span className="k">Estado</span><span className="v">{c.estado}</span></div>
            <div className="kv"><span className="k">Autoriza datos</span><span className="v">Sí</span></div>
          </div>
        </div>
      )}

      {tab === 'polizas' && (
        <div className="card tblwrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Nº de póliza</th>
                <th>Ramo</th>
                <th>Aseguradora</th>
                <th>Prima anual</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {d.polizas.map((p) => (
                <tr className="prow" key={p.num}>
                  <td><span className="pnum mono">{p.num}</span></td>
                  <td>{p.ramo}</td>
                  <td>{p.aseg}</td>
                  <td className="money">{fmt(p.prima)}</td>
                  <td><StatusBadge label={p.estado} cls={stCls(p.estado)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'notificaciones' && (
        <div className="card">
          <div className="sc-hd">Notificaciones al cliente</div>
          <div className="notif-row">
            <span>Póliza por vencer</span>
            <Switch small on={notifVencer} onToggle={() => setNotifVencer((v) => !v)} />
          </div>
          <div className="notif-row">
            <span>Cobros por vencer</span>
            <Switch small on={notifCobros} onToggle={() => setNotifCobros((v) => !v)} />
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
      )}

      {tab === 'actividad' && (
        <div className="card">
          <div className="sc-hd">Actividad reciente</div>
          <div className="timeline" style={{ padding: '10px 20px 18px' }}>
            <TlItem title="Cliente creado" meta={`Hace 8 meses · ${d.asesor}`} />
            <TlItem title={`Póliza emitida · ${d.polizas[0]?.ramo ?? 'Cumplimiento'}`} meta={`Hace 3 meses · ${d.primaTotalFmt}`} color="var(--grn)" tint="var(--grn-t)" />
            <TlItem title="Recordatorio de renovación enviado" meta="Hace 5 días · WhatsApp" color="var(--amb)" tint="var(--amb-t)" />
            <TlItem title="Correo de bienvenida enviado" meta={`Hace 2 días · ${d.emailShow}`} color="var(--teal)" tint="var(--teal-t)" />
          </div>
        </div>
      )}

      {tab !== 'resumen' && tab !== 'polizas' && tab !== 'notificaciones' && tab !== 'actividad' && (
        <div className="card placeholder-panel">
          Contenido de "{curTab.label}" — información vinculada a este cliente.
        </div>
      )}
    </>
  );
}

function InfoItem({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="info-item">
      <div className="info-l">{label}</div>
      <div className={`info-v${mono ? ' mono' : ''}`}>{value}</div>
    </div>
  );
}

function TlItem({ title, meta, color, tint }: { title: string; meta: string; color?: string; tint?: string }) {
  return (
    <div className="tl-item">
      <div className="tl-dot" style={color ? { background: color, boxShadow: `0 0 0 3px ${tint}` } : undefined} />
      <div>
        <div className="tl-t">{title}</div>
        <div className="tl-d">{meta}</div>
      </div>
    </div>
  );
}
