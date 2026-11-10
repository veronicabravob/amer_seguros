import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ramos } from '../../data/mockData';
import { agFlag } from '../../data/helpers';

export default function RamosListPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'activos' | 'inactivos'>('activos');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (tab === 'inactivos') return [];
    const q = search.trim().toLowerCase();
    if (!q) return ramos;
    return ramos.filter(
      (r) => r.name.toLowerCase().includes(q) || r.aseg.toLowerCase().includes(q)
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
          <h1 className="h1">Ramos</h1>
          <p className="psub">Líneas de negocio y subramos</p>
        </div>
        <Link to="/configuracion/ramos/nuevo" className="btn btn-pri">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Crear ramo
        </Link>
      </div>

      <div className="tabs">
        <div className={`tab${tab === 'activos' ? ' on' : ''}`} onClick={() => setTab('activos')}>
          Activos<span className="tab-ct">{ramos.length}</span>
        </div>
        <div className={`tab${tab === 'inactivos' ? ' on' : ''}`} onClick={() => setTab('inactivos')}>
          Inactivos<span className="tab-ct">0</span>
        </div>
      </div>

      <div className="toolbar">
        <div className="tb-search" style={{ maxWidth: 320 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4-4" />
          </svg>
          <input
            placeholder="Buscar ramo o aseguradora…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {tab === 'inactivos' ? (
        <div className="card empty">No hay ramos inactivos</div>
      ) : (
        <>
          <div className="card tblwrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Aseguradoras</th>
                  <th>IVA en gastos</th>
                  <th>Fecha de creación</th>
                  <th style={{ width: 70 }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr className="prow" key={r.name}>
                    <td>
                      <div className="cli-nm">{r.name}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>{r.aseg}</span>
                        <span className="pz-count" style={{ minWidth: 'auto', height: 20, fontSize: 11 }}>{r.mas}</span>
                      </div>
                    </td>
                    <td>
                      <span className={agFlag(r.iva)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </span>
                    </td>
                    <td>{r.fecha}</td>
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
            <span>Mostrando {filtered.length} de {ramos.length} ramos</span>
            <div className="pg-btns">
              <button className="pgb" type="button">‹</button>
              <button className="pgb on" type="button">1</button>
              <button className="pgb" type="button">2</button>
              <button className="pgb" type="button">3</button>
              <button className="pgb" type="button">4</button>
              <button className="pgb" type="button">›</button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
