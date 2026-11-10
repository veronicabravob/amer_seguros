import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { policies } from '../../data/mockData';
import { buildPolicyDetail } from '../../data/helpers';
import Tabs, { type TabDef } from '../../components/ui/Tabs';

const DET_TABS: TabDef[] = [
  { key: 'resumen', label: 'Resumen' },
  { key: 'tomador', label: 'Tomador y asegurado' },
  { key: 'anexos', label: 'Anexos', count: '2' },
  { key: 'archivos', label: 'Archivos', count: '5' },
  { key: 'cobros', label: 'Bitácora de cobro' },
  { key: 'bitacora', label: 'Historial' },
  { key: 'siniestros', label: 'Siniestros', count: '0' },
  { key: 'actividad', label: 'Actividad' },
];

export default function PolizaDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState('resumen');

  const p0 = policies.find((x) => x.id === id) || policies[0];
  const d = buildPolicyDetail(p0);
  const curTab = DET_TABS.find((t) => t.key === tab) ?? DET_TABS[0];

  return (
    <>
      <div className="det-back" onClick={() => navigate('/polizas')}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Volver al listado
      </div>

      <div className="det-hd">
        <div style={{ minWidth: 0 }}>
          <div className="det-title">
            <span className="mono">{d.num}</span>
            <span className={`badge ${d.stCls}`}>
              <span className="b-dot" />{d.estado}
            </span>
            {d.nueva && <span className="tag-new">NUEVA</span>}
          </div>
          <div className="det-meta">{d.cliente} · {d.ramo} · {d.aseguradora}</div>
          <div className="det-vig">
            <div className="det-vig-bar"><i style={{ width: d.pctLabel, background: d.pctColor }} /></div>
            <div className="det-vig-txt">
              <span>{d.inicio}</span>
              <b>{d.leftLabel}</b>
              <span>{d.fin}</span>
            </div>
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
              <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8" />
            </svg>
            Renovar
          </button>
          <button className="btn btn-pri" type="button">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 12v9M8 17l4 4 4-4M20 16.7A5 5 0 0 0 18 7h-1.3A8 8 0 1 0 4 15" />
            </svg>
            Descargar
          </button>
        </div>
      </div>

      <Tabs tabs={DET_TABS} active={tab} onChange={setTab} />

      {tab === 'resumen' && (
        <div className="det-grid">
          <div className="card">
            <div className="sc-hd">Detalles de la póliza</div>
            <div className="info-grid">
              <InfoItem label="Cliente" value={d.cliente} />
              <InfoItem label="Documento" value={d.doc} mono />
              <InfoItem label="Tipo" value="Individual" />
              <InfoItem label="Aseguradora" value={d.aseguradora} />
              <InfoItem label="Ramo" value={d.ramo} />
              <InfoItem label="Riesgo" value={d.riesgo} />
              <InfoItem label="Fecha de expedición" value={d.expedicion} />
              <InfoItem label="Fecha inicio" value={d.inicio} />
              <InfoItem label="Fecha fin" value={d.fin} />
              <InfoItem label="Es renovable" value={d.renovable} />
              <InfoItem label="Forma de pago" value={d.formaPago} />
              <InfoItem label="Asesor" value={d.vendedor} />
            </div>
          </div>
          <div className="card side-card">
            <div className="prima-big">
              <div className="prima-num money">{d.primaFmt}</div>
              <div className="prima-lbl">Prima anual · IVA incluido</div>
            </div>
            <div className="kv"><span className="k">Prima neta</span><span className="v money">{d.neta}</span></div>
            <div className="kv"><span className="k">Gastos</span><span className="v money">{d.gastos}</span></div>
            <div className="kv"><span className="k">IVA (19%)</span><span className="v money">{d.iva}</span></div>
            <div className="kv"><span className="k">Comisión (30%)</span><span className="v money">{d.comision}</span></div>
            <div className="kv"><span className="k">Valor asegurado</span><span className="v money">{d.asegurado}</span></div>
            <div className="kv">
              <span className="k" style={{ fontWeight: 700, color: 'var(--ink)' }}>Total a pagar</span>
              <span className="v money" style={{ color: 'var(--ink)' }}>{d.primaFmt}</span>
            </div>
          </div>
        </div>
      )}

      {tab === 'tomador' && (
        <div className="det-grid">
          <div className="card">
            <div className="sc-hd">Tomador y asegurado</div>
            <div className="info-grid">
              <InfoItem label="Nombre del tomador" value={d.tomador} />
              <InfoItem label="Documento del tomador" value={d.tomadorDoc} mono />
              <InfoItem label="Relación" value="Tomador y asegurado" />
              <InfoItem label="Nombre del asegurado" value={d.asegurado2} />
              <InfoItem label="Documento del asegurado" value={d.aseguradoDoc} mono />
              <InfoItem label="Tipo de persona" value="Jurídica" />
            </div>
          </div>
          <div className="card side-card">
            <div className="sc-hd">Beneficiario oneroso</div>
            <div className="kv"><span className="k">Nombre</span><span className="v">{d.benefOneroso}</span></div>
            <div className="kv"><span className="k">Documento</span><span className="v mono">{d.benefDoc}</span></div>
            <div className="kv"><span className="k">En la remisión</span><span className="v">{d.benefRemision}</span></div>
          </div>
        </div>
      )}

      {tab === 'actividad' && (
        <div className="card">
          <div className="sc-hd">Actividad reciente</div>
          <div className="timeline" style={{ padding: '10px 20px 18px' }}>
            <TlItem title="Póliza creada" meta="Hace 3 días · Laura Gómez" />
            <TlItem title="Documento cargado" meta="Hace 2 días · Póliza firmada.pdf" color="var(--grn)" tint="var(--grn-t)" />
            <TlItem title="Recordatorio de cobro enviado" meta="Ayer · WhatsApp" color="var(--amb)" tint="var(--amb-t)" />
            <TlItem title="Correo de bienvenida enviado" meta="Hace 3 días · cliente@ejemplo.com" color="var(--teal)" tint="var(--teal-t)" />
          </div>
        </div>
      )}

      {tab !== 'resumen' && tab !== 'tomador' && tab !== 'actividad' && (
        <div className="card placeholder-panel">
          Contenido de "{curTab.label}" — anexos, archivos, bitácora y siniestros vinculados a esta póliza.
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
