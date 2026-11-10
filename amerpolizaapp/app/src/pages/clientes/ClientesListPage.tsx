import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clients, TOTAL_CLIENTES } from '../../data/mockData';
import { clientEstadoCls, clientTipoClasses, initialsOf } from '../../data/helpers';
import type { Client, ClientEstado } from '../../types';
import Chips from '../../components/ui/Chips';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';

type StatusKey = 'all' | ClientEstado;

export default function ClientesListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusKey>('all');
  const [sel, setSel] = useState<Record<string, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return clients.filter((c: Client) => {
      if (status !== 'all' && c.estado !== status) return false;
      if (
        q &&
        !(
          c.name.toLowerCase().includes(q) ||
          c.doc.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
        )
      )
        return false;
      return true;
    });
  }, [status, search]);

  const rows = filtered.map((c) => {
    const { cavCls, tpCls, tpLabel } = clientTipoClasses(c.tipo);
    return {
      ...c,
      checked: !!sel[c.id],
      initials: initialsOf(c.name),
      cavCls,
      tpCls,
      tpLabel,
      estadoCls: clientEstadoCls(c.estado),
      emailShow: c.email || '—',
    };
  });
  const selCount = Object.values(sel).filter(Boolean).length;
  const allChecked = filtered.length > 0 && selCount >= filtered.length;

  const statusChips = [
    { key: 'all', label: 'Todos', count: clients.length },
    { key: 'Cliente', label: 'Clientes', count: clients.filter((c) => c.estado === 'Cliente').length },
    { key: 'Prospecto', label: 'Prospectos', count: clients.filter((c) => c.estado === 'Prospecto').length },
    { key: 'Inactivo', label: 'Inactivos', count: clients.filter((c) => c.estado === 'Inactivo').length },
  ];

  function toggleRow(id: string) {
    setSel((s) => ({ ...s, [id]: !s[id] }));
  }
  function toggleAll(checked: boolean) {
    if (!checked) return setSel({});
    const next: Record<string, boolean> = {};
    filtered.forEach((c) => (next[c.id] = true));
    setSel(next);
  }

  function goToForm(tipo: string) {
    setModalOpen(false);
    navigate(`/clientes/nuevo?tipo=${tipo}`);
  }

  return (
    <>
      <div className="pagehd">
        <div>
          <h1 className="h1">Clientes</h1>
          <p className="psub">{rows.length} de {TOTAL_CLIENTES} clientes · {selCount} seleccionados</p>
        </div>
        <button className="btn btn-pri" onClick={() => setModalOpen(true)} type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Crear cliente
        </button>
      </div>

      <div className="tabs">
        <div className="tab on">Clientes<span className="tab-ct">{TOTAL_CLIENTES}</span></div>
        <div className="tab">Contactos<span className="tab-ct">0</span></div>
      </div>

      <div className="toolbar">
        <div className="tb-search" style={{ maxWidth: 300 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4-4" />
          </svg>
          <input
            placeholder="Buscar nombre, documento, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Chips chips={statusChips} active={status} onChange={(k) => setStatus(k as StatusKey)} />
        <div style={{ flex: 1 }} />
        <div className="selctl">
          <select className="sel" defaultValue="Todos los tipos">
            <option>Todos los tipos</option>
            <option>Persona</option>
            <option>Empresa</option>
            <option>Consorcio</option>
          </select>
          <select className="sel" defaultValue="Todas las ciudades">
            <option>Todas las ciudades</option>
            <option>Duitama</option>
            <option>Tunja</option>
            <option>Sogamoso</option>
            <option>Bogotá</option>
          </select>
        </div>
      </div>

      {selCount > 0 && (
        <div className="bulkbar">
          <span className="bulk-n">{selCount} seleccionados</span>
          <button className="bulkbtn" type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 7l-10 5L2 7" />
            </svg>
            Enviar email
          </button>
          <button className="bulkbtn" type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
            </svg>
            Exportar
          </button>
          <button className="bulkbtn" type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
            </svg>
            Segmentar
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
              <th>Cliente</th>
              <th>Documento</th>
              <th>Contacto</th>
              <th>Ciudad</th>
              <th>Pólizas</th>
              <th>Estado</th>
              <th style={{ width: 70 }} />
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr
                key={c.id}
                className={`prow${c.checked ? ' sel' : ''}`}
                onClick={() => navigate(`/clientes/${c.id}`)}
              >
                <td onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="ck"
                    checked={c.checked}
                    onChange={() => toggleRow(c.id)}
                  />
                </td>
                <td>
                  <div className="cli-row">
                    <div className={`cav ${c.cavCls}`}>{c.initials}</div>
                    <div>
                      <div className="cli-nm">{c.name}</div>
                      <div style={{ marginTop: 3 }}>
                        <span className={`tp ${c.tpCls}`}>{c.tpLabel}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="cli-nm mono">{c.doc}</div>
                  <div className="cli-doc">{c.docType}</div>
                </td>
                <td>
                  <div>{c.tel}</div>
                  <div className="cli-doc">{c.emailShow}</div>
                </td>
                <td>{c.ciudad}</td>
                <td>
                  <span className="pz-count">{c.polizas}</span>
                </td>
                <td>
                  <StatusBadge label={c.estado} cls={c.estadoCls} />
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div className="rowact">
                    <button className="actbtn" onClick={() => navigate(`/clientes/${c.id}`)} type="button">
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
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pager">
        <span>Mostrando {rows.length} de {TOTAL_CLIENTES} clientes</span>
        <div className="pg-btns">
          <button className="pgb" type="button">‹</button>
          <button className="pgb on" type="button">1</button>
          <button className="pgb" type="button">2</button>
          <button className="pgb" type="button">3</button>
          <button className="pgb" type="button">›</button>
        </div>
      </div>

      {modalOpen && (
        <Modal title="Crear cliente" onClose={() => setModalOpen(false)}>
          <div className="ctype" onClick={() => goToForm('Persona')}>
            <div className="ctype-ic">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
              </svg>
            </div>
            <div>
              <div className="ctype-t">Cliente persona</div>
              <div className="ctype-d">Persona natural con cédula</div>
            </div>
          </div>
          <div className="ctype" onClick={() => goToForm('Empresa')}>
            <div className="ctype-ic">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M15 9h.01M9 13h.01M15 13h.01" />
              </svg>
            </div>
            <div>
              <div className="ctype-t">Cliente empresa</div>
              <div className="ctype-d">Persona jurídica con NIT</div>
            </div>
          </div>
          <div className="ctype" onClick={() => goToForm('Consorcio')}>
            <div className="ctype-ic">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <div className="ctype-t">Cliente consorcio</div>
              <div className="ctype-d">Unión temporal o consorcio</div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
