import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { policies, TOTAL_POLIZAS } from '../../data/mockData';
import { toPolicyRow } from '../../data/helpers';
import { useGlobalSearch } from '../../context/SearchContext';
import Chips from '../../components/ui/Chips';

type StatusKey = 'all' | 'vigente' | 'vencer' | 'vencida' | 'nueva';

export default function PolizasListPage() {
  const navigate = useNavigate();
  const { search } = useGlobalSearch();
  const [status, setStatus] = useState<StatusKey>('all');
  const [mode, setMode] = useState<'table' | 'cards'>('table');
  const [sel, setSel] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return policies.filter((p: (typeof policies)[number]) => {
      if (status === 'vigente' && p.estado !== 'Vigente') return false;
      if (status === 'vencer' && p.estado !== 'Por vencer') return false;
      if (status === 'vencida' && p.estado !== 'Vencida') return false;
      if (status === 'nueva' && !p.nueva) return false;
      if (
        q &&
        !(
          p.num.toLowerCase().includes(q) ||
          p.cliente.toLowerCase().includes(q) ||
          p.doc.includes(q) ||
          p.aseguradora.toLowerCase().includes(q)
        )
      )
        return false;
      return true;
    });
  }, [status, search]);

  const rows = filtered.map((p) => ({ ...toPolicyRow(p), checked: !!sel[p.id] }));
  const selCount = Object.values(sel).filter(Boolean).length;
  const allChecked = filtered.length > 0 && selCount >= filtered.length;

  const statusChips = [
    { key: 'all', label: 'Todas', count: policies.length },
    { key: 'vigente', label: 'Vigentes', count: policies.filter((p) => p.estado === 'Vigente').length },
    { key: 'vencer', label: 'Por vencer', count: policies.filter((p) => p.estado === 'Por vencer').length },
    { key: 'vencida', label: 'Vencidas', count: policies.filter((p) => p.estado === 'Vencida').length },
    { key: 'nueva', label: 'Nuevas', count: policies.filter((p) => p.nueva).length },
  ];

  function toggleRow(id: string) {
    setSel((s) => ({ ...s, [id]: !s[id] }));
  }
  function toggleAll(checked: boolean) {
    if (!checked) return setSel({});
    const next: Record<string, boolean> = {};
    filtered.forEach((p) => (next[p.id] = true));
    setSel(next);
  }

  return (
    <>
      <div className="pagehd">
        <div>
          <h1 className="h1">Listado de pólizas</h1>
          <p className="psub">{rows.length} de {TOTAL_POLIZAS} pólizas · {selCount} seleccionadas</p>
        </div>
        <Link to="/polizas/nueva" className="btn btn-pri">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Crear póliza
        </Link>
      </div>

      <div className="tabs">
        <div className="tab on">Pólizas<span className="tab-ct">685</span></div>
        <div className="tab">Anexos<span className="tab-ct">73</span></div>
        <div className="tab">Vinculados<span className="tab-ct">0</span></div>
      </div>

      <div className="toolbar">
        <Chips chips={statusChips} active={status} onChange={(k) => setStatus(k as StatusKey)} />
        <div style={{ flex: 1 }} />
        <div className="selctl">
          <select className="sel" defaultValue="Todas las aseguradoras">
            <option>Todas las aseguradoras</option>
            <option>Seguros SURA</option>
            <option>Seguros Bolívar</option>
            <option>Mundial de Seguros</option>
            <option>Solidaria</option>
            <option>Allianz</option>
          </select>
          <select className="sel" defaultValue="Todos los ramos">
            <option>Todos los ramos</option>
            <option>Cumplimiento</option>
            <option>Autos</option>
            <option>RC</option>
            <option>Vida</option>
            <option>Salud</option>
          </select>
          <div className="seg">
            <button className={mode === 'table' ? 'on' : ''} onClick={() => setMode('table')} type="button">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
              Tabla
            </button>
            <button className={mode === 'cards' ? 'on' : ''} onClick={() => setMode('cards')} type="button">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
              Tarjetas
            </button>
          </div>
        </div>
      </div>

      {selCount > 0 && (
        <div className="bulkbar">
          <span className="bulk-n">{selCount} seleccionadas</span>
          <button className="bulkbtn" type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4v6h6M20 20v-6h-6M20 4L4 20" />
            </svg>
            Renovar
          </button>
          <button className="bulkbtn" type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
            </svg>
            Exportar
          </button>
          <button className="bulkbtn" type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 7l-10 5L2 7" />
            </svg>
            Enviar email
          </button>
          <div className="bulk-sp" />
          <button className="bulkbtn" onClick={() => setSel({})} type="button">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
            Limpiar
          </button>
        </div>
      )}

      {mode === 'table' ? (
        <div className="card tblwrap">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 38 }}>
                  <input
                    type="checkbox"
                    className="ck"
                    checked={allChecked}
                    onChange={(e) => toggleAll(e.target.checked)}
                  />
                </th>
                <th>Nº de póliza</th>
                <th>Cliente</th>
                <th>Aseguradora</th>
                <th>Ramo</th>
                <th>Prima anual</th>
                <th>Vigencia</th>
                <th>Estado</th>
                <th style={{ width: 80 }} />
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr
                  key={p.id}
                  className={`prow${p.checked ? ' sel' : ''}`}
                  onClick={() => navigate(`/polizas/${p.id}`)}
                >
                  <td onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="ck"
                      checked={p.checked}
                      onChange={() => toggleRow(p.id)}
                    />
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="pnum mono">{p.num}</span>
                      {p.nueva && <span className="tag-new">NUEVA</span>}
                      {p.ren && <span className="tag-ren">RENOV</span>}
                    </div>
                    <div className="cli-doc">{p.riesgo}</div>
                  </td>
                  <td>
                    <div className="cli-nm">{p.cliente}</div>
                    <div className="cli-doc mono">{p.doc}</div>
                  </td>
                  <td>{p.aseguradora}</td>
                  <td>{p.ramo}</td>
                  <td className="money">{p.primaFmt}</td>
                  <td className="vig">
                    <div className="vig-dates">{p.inicio} → {p.fin}</div>
                    <div className="bar"><i style={{ width: p.pctLabel, background: p.pctColor }} /></div>
                    <div className="vig-left">{p.leftLabel}</div>
                  </td>
                  <td>
                    <span className={`badge ${p.stCls}`}>
                      <span className="b-dot" />{p.estado}
                    </span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className="rowact">
                      <button className="actbtn" onClick={() => navigate(`/polizas/${p.id}`)} type="button">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                      <button className="actbtn" type="button">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" />
                        </svg>
                      </button>
                      <button className="actbtn" type="button">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="5" r="1.6" />
                          <circle cx="12" cy="12" r="1.6" />
                          <circle cx="12" cy="19" r="1.6" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="cards-grid">
          {rows.map((p) => (
            <div className="card pcard" key={p.id} onClick={() => navigate(`/polizas/${p.id}`)}>
              <div className="pcard-hd">
                <div>
                  <div className="pcard-num mono">{p.num}</div>
                  <div className="pcard-cli">{p.cliente}</div>
                </div>
                <span className={`badge ${p.stCls}`}>
                  <span className="b-dot" />{p.estado}
                </span>
              </div>
              <div className="pcard-grid">
                <div>
                  <div className="mini-l">Aseguradora</div>
                  <div className="mini-v">{p.aseguradora}</div>
                </div>
                <div>
                  <div className="mini-l">Ramo</div>
                  <div className="mini-v">{p.ramo}</div>
                </div>
                <div>
                  <div className="mini-l">Prima anual</div>
                  <div className="mini-v money">{p.primaFmt}</div>
                </div>
                <div>
                  <div className="mini-l">Vence</div>
                  <div className="mini-v">{p.fin}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="cli-doc">{p.leftLabel}</span>
                <a style={{ fontSize: 12.5, fontWeight: 600 }}>Abrir →</a>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pager">
        <span>Mostrando {rows.length} de {TOTAL_POLIZAS} pólizas</span>
        <div className="pg-btns">
          <button className="pgb" type="button">‹</button>
          <button className="pgb on" type="button">1</button>
          <button className="pgb" type="button">2</button>
          <button className="pgb" type="button">3</button>
          <button className="pgb" type="button">›</button>
        </div>
      </div>
    </>
  );
}
