import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { aseguradoras } from '../../data/mockData';

export default function AseguradorasListPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'activas' | 'inactivas'>('activas');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (tab === 'inactivas') return [];
    const q = search.trim().toLowerCase();
    if (!q) return aseguradoras;
    return aseguradoras.filter(
      (a) => a.name.toLowerCase().includes(q) || a.nit.toLowerCase().includes(q)
    );
  }, [tab, search]);

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
          <h1 className="h1">Aseguradoras</h1>
          <p className="psub">Compañías con las que operas</p>
        </div>
        <Link to="/configuracion/aseguradoras/nueva" className="btn btn-pri">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Crear aseguradora
        </Link>
      </div>

      <div className="tabs">
        <div className={`tab${tab === 'activas' ? ' on' : ''}`} onClick={() => setTab('activas')}>
          Activas<span className="tab-ct">{aseguradoras.length}</span>
        </div>
        <div className={`tab${tab === 'inactivas' ? ' on' : ''}`} onClick={() => setTab('inactivas')}>
          Inactivas<span className="tab-ct">0</span>
        </div>
      </div>

      <div className="toolbar">
        <div className="tb-search" style={{ maxWidth: 320 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4-4" />
          </svg>
          <input
            placeholder="Buscar nombre o NIT…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ flex: 1 }} />
        <button className="btn btn-sm" type="button">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
          </svg>
          Exportar
        </button>
      </div>

      {tab === 'inactivas' ? (
        <div className="card empty">No hay aseguradoras inactivas</div>
      ) : (
        <>
          <div className="card tblwrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Aseguradora</th>
                  <th>NIT</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Ramos</th>
                  <th style={{ width: 70 }} />
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr className="prow" key={a.nit}>
                    <td>
                      <div className="cli-row">
                        <div className="cav emp">{a.name.charAt(0).toUpperCase()}</div>
                        <div className="cli-nm">{a.name}</div>
                      </div>
                    </td>
                    <td className="mono">{a.nit}</td>
                    <td>{a.email}</td>
                    <td>{a.tel}</td>
                    <td>
                      <span className="pz-count">{a.ramos}</span>
                    </td>
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
            <span>Mostrando {filtered.length} de {aseguradoras.length} aseguradoras</span>
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
