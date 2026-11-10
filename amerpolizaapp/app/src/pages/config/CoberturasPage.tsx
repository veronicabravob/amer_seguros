import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { coberturas } from '../../data/mockData';
import Modal from '../../components/ui/Modal';

export default function CoberturasPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [nombre, setNombre] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return coberturas;
    return coberturas.filter((c) => c.name.toLowerCase().includes(q));
  }, [search]);

  function closeModal() {
    setModalOpen(false);
    setNombre('');
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
          <h1 className="h1">Coberturas</h1>
          <p className="psub">Amparos disponibles por ramo</p>
        </div>
        <button className="btn btn-pri" onClick={() => setModalOpen(true)} type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Crear cobertura
        </button>
      </div>

      <div className="toolbar">
        <div className="tb-search" style={{ maxWidth: 320 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4-4" />
          </svg>
          <input
            placeholder="Buscar cobertura…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card tblwrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Fecha de creación</th>
              <th style={{ width: 70 }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr className="prow" key={c.name}>
                <td>
                  <div className="cli-nm">{c.name}</div>
                </td>
                <td>{c.fecha}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div className="rowact">
                    <button className="actbtn" type="button">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" />
                      </svg>
                    </button>
                    <button className="actbtn" type="button">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
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
        <span>Mostrando {filtered.length} de {coberturas.length} coberturas</span>
        <div className="pg-btns">
          <button className="pgb" type="button">‹</button>
          <button className="pgb on" type="button">1</button>
          <button className="pgb" type="button">2</button>
          <button className="pgb" type="button">3</button>
          <button className="pgb" type="button">4</button>
          <button className="pgb" type="button">›</button>
        </div>
      </div>

      {modalOpen && (
        <Modal title="Crear cobertura" onClose={closeModal}>
          <div className="field">
            <label className="lbl">Nombre <span className="req">*</span></label>
            <input
              className="inp"
              placeholder="Ej. Incendio y/o rayo, Asistencia en viaje…"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn" style={{ flex: 1 }} onClick={closeModal} type="button">Cancelar</button>
            <button className="btn btn-pri" style={{ flex: 2, justifyContent: 'center' }} onClick={closeModal} type="button">
              Crear
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
