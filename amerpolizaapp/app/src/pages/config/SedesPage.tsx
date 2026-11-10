import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sedes as sedesSeed } from '../../data/mockData';
import type { Sede } from '../../types';
import Modal from '../../components/ui/Modal';
import Switch from '../../components/ui/Switch';

export default function SedesPage() {
  const navigate = useNavigate();
  const [sedes, setSedes] = useState<Sede[]>(sedesSeed);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [dir, setDir] = useState('');
  const [ppal, setPpal] = useState(false);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sedes;
    return sedes.filter((s) => s.name.toLowerCase().includes(q));
  }, [sedes, search]);

  function openModal() {
    setNombre('');
    setEmail('');
    setTel('');
    setDir('');
    setPpal(false);
    setModalOpen(true);
  }

  function crearSede() {
    if (nombre.trim()) {
      setSedes((prev) => [...prev, { name: nombre, email, tel, dir, users: 0, ppal }]);
    }
    setModalOpen(false);
  }

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
          <h1 className="h1">Sedes</h1>
          <p className="psub">Oficinas y puntos de atención</p>
        </div>
        <button className="btn btn-pri" type="button" onClick={openModal}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Crear sede
        </button>
      </div>

      <div className="toolbar">
        <div className="tb-search" style={{ maxWidth: 320 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4-4" />
          </svg>
          <input placeholder="Buscar sede…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card tblwrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>Sede</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Usuarios</th>
              <th style={{ width: 70 }} />
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr className="prow" key={s.name}>
                <td>
                  <div className="cli-row">
                    <div className="cav emp">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M15 9h.01M9 13h.01M15 13h.01" />
                      </svg>
                    </div>
                    <div>
                      <div className="cli-nm">{s.name}</div>
                      {s.ppal && <span className="tag-new">PRINCIPAL</span>}
                    </div>
                  </div>
                </td>
                <td>{s.email}</td>
                <td>{s.tel}</td>
                <td>{s.dir}</td>
                <td>
                  <span className="pz-count">{s.users}</span>
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

      {modalOpen && (
        <Modal title="Crear sede" onClose={() => setModalOpen(false)}>
          <div className="field">
            <label className="lbl">Nombre <span className="req">*</span></label>
            <input className="inp" placeholder="Nombre de la sede" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div className="field">
            <label className="lbl">Email <span className="req">*</span></label>
            <input className="inp" placeholder="correo@amerseguros.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label className="lbl">Teléfono <span className="req">*</span></label>
            <input className="inp" placeholder="+57" value={tel} onChange={(e) => setTel(e.target.value)} />
          </div>
          <div className="field">
            <label className="lbl">Dirección <span className="req">*</span></label>
            <input className="inp" placeholder="Dirección de la sede" value={dir} onChange={(e) => setDir(e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 }}>
            <Switch on={ppal} onToggle={() => setPpal((v) => !v)} />
            <span style={{ fontSize: 13, color: 'var(--ink2)' }}>Marcar como sede principal</span>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn" style={{ flex: 1 }} type="button" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button className="btn btn-pri" style={{ flex: 2, justifyContent: 'center' }} type="button" onClick={crearSede}>Crear sede</button>
          </div>
        </Modal>
      )}
    </>
  );
}
