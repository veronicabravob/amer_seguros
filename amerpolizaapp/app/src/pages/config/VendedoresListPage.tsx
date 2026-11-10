import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { vendedores } from '../../data/mockData';
import { initialsOf, agFlag } from '../../data/helpers';
import Tabs from '../../components/ui/Tabs';

type TabKey = 'activos' | 'inactivos';

export default function VendedoresListPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>('activos');
  const [search, setSearch] = useState('');

  const rows = useMemo(() => {
    if (tab !== 'activos') return [];
    const q = search.trim().toLowerCase();
    if (!q) return vendedores;
    return vendedores.filter(
      (v) => v.name.toLowerCase().includes(q) || v.ced.toLowerCase().includes(q)
    );
  }, [tab, search]);

  const tabs = [
    { key: 'activos', label: 'Activos', count: String(vendedores.length) },
    { key: 'inactivos', label: 'Inactivos', count: '0' },
  ];

  return (
    <>
      <div className="det-back" onClick={() => navigate('/configuracion')}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Volver a configuración
      </div>

      <div className="pagehd">
        <div>
          <h1 className="h1">Vendedores</h1>
          <p className="psub">Asesores y esquema de comisiones</p>
        </div>
        <Link to="/configuracion/vendedores/nuevo" className="btn btn-pri">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Crear vendedor
        </Link>
      </div>

      <Tabs tabs={tabs} active={tab} onChange={(k) => setTab(k as TabKey)} />

      <div className="toolbar">
        <div className="tb-search" style={{ maxWidth: 320 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4-4" />
          </svg>
          <input placeholder="Buscar nombre o cédula…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div style={{ flex: 1 }} />
        <button className="btn btn-sm" type="button">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
          </svg>
          Exportar
        </button>
      </div>

      {tab === 'inactivos' ? (
        <div className="card empty">No hay vendedores inactivos.</div>
      ) : (
        <>
          <div className="card tblwrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Vendedor</th>
                  <th>Cédula / NIT</th>
                  <th>% Comisión</th>
                  <th>Comisión sobre</th>
                  <th>% Retención</th>
                  <th>Tipo</th>
                  <th>Es agencia</th>
                  <th>Sede</th>
                  <th style={{ width: 60 }} />
                </tr>
              </thead>
              <tbody>
                {rows.map((v) => (
                  <tr className="prow" key={v.name}>
                    <td>
                      <div className="cli-row">
                        <div className="cav">{initialsOf(v.name)}</div>
                        <div className="cli-nm">{v.name}</div>
                      </div>
                    </td>
                    <td className="mono">{v.ced}</td>
                    <td className="money">{v.com}%</td>
                    <td>{v.sobre}</td>
                    <td className="money">{v.ret}%</td>
                    <td>
                      <span className={`tp ${v.tipo === 'Jurídica' ? 'tp-emp' : 'tp-per'}`}>{v.tipo}</span>
                    </td>
                    <td>
                      <span className={agFlag(v.agencia)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </span>
                    </td>
                    <td>{v.sede}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="rowact">
                        <button className="actbtn" type="button">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pager">
            <span>Mostrando {rows.length} de {vendedores.length} vendedores</span>
            <div className="pg-btns">
              <button className="pgb" type="button">‹</button>
              <button className="pgb on" type="button">1</button>
              <button className="pgb" type="button">2</button>
              <button className="pgb" type="button">›</button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
