import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tiposAfiliacion as afilSeed } from '../../data/mockData';
import type { TipoAfiliacion } from '../../types';
import Modal from '../../components/ui/Modal';

export default function AfiliacionPage() {
  const navigate = useNavigate();
  const [tipos, setTipos] = useState<TipoAfiliacion[]>(afilSeed);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [nombre, setNombre] = useState('');

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tipos;
    return tipos.filter((t) => t.name.toLowerCase().includes(q));
  }, [tipos, search]);

  function openModal() {
    setNombre('');
    setModalOpen(true);
  }

  function crear() {
    if (nombre.trim()) {
      const hoy = new Date();
      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const fecha = `${String(hoy.getDate()).padStart(2, '0')} ${meses[hoy.getMonth()]} ${hoy.getFullYear()}`;
      setTipos((prev) => [...prev, { name: nombre, fecha }]);
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
          <h1 className="h1">Tipos de afiliación</h1>
          <p className="psub">Categorías de vinculación de clientes</p>
        </div>
        <button className="btn btn-pri" type="button" onClick={openModal}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Crear tipo de afiliación
        </button>
      </div>

      <div className="toolbar">
        <div className="tb-search" style={{ maxWidth: 320 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4-4" />
          </svg>
          <input placeholder="Buscar tipo de afiliación…" value={search} onChange={(e) => setSearch(e.target.value)} />
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
            {rows.map((a) => (
              <tr className="prow" key={a.name}>
                <td>
                  <div className="cli-nm">{a.name}</div>
                </td>
                <td>{a.fecha}</td>
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

      {modalOpen && (
        <Modal title="Crear tipo de afiliación" onClose={() => setModalOpen(false)}>
          <div className="field">
            <label className="lbl">Nombre <span className="req">*</span></label>
            <input
              className="inp"
              placeholder="Ej. Titular, Cónyuge, Hijo(a)…"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn" style={{ flex: 1 }} type="button" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button className="btn btn-pri" style={{ flex: 2, justifyContent: 'center' }} type="button" onClick={crear}>Crear</button>
          </div>
        </Modal>
      )}
    </>
  );
}
