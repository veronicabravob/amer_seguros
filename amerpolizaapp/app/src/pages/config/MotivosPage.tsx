import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motivosPoliza } from '../../data/mockData';
import { agFlag } from '../../data/helpers';
import Modal from '../../components/ui/Modal';
import Switch from '../../components/ui/Switch';

export default function MotivosPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [canc, setCanc] = useState(false);
  const [noren, setNoren] = useState(false);
  const [anexo, setAnexo] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return motivosPoliza;
    return motivosPoliza.filter((m) => m.name.toLowerCase().includes(q));
  }, [search]);

  function closeModal() {
    setModalOpen(false);
    setNombre('');
    setCanc(false);
    setNoren(false);
    setAnexo(false);
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
          <h1 className="h1">Motivos de estado de póliza</h1>
          <p className="psub">Razones de cancelación, no renovación y creación de anexos</p>
        </div>
        <button className="btn btn-pri" onClick={() => setModalOpen(true)} type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Crear motivo
        </button>
      </div>

      <div className="toolbar">
        <div className="tb-search" style={{ maxWidth: 320 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4-4" />
          </svg>
          <input
            placeholder="Buscar motivo…"
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
              <th className="tc">Cancelación</th>
              <th className="tc">No renovación</th>
              <th className="tc">Creación anexo</th>
              <th>Fecha de creación</th>
              <th style={{ width: 70 }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr className="prow" key={m.name}>
                <td>
                  <div className="cli-nm">{m.name}</div>
                </td>
                <td className="tc">
                  <span className={agFlag(m.canc)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                </td>
                <td className="tc">
                  <span className={agFlag(m.noren)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                </td>
                <td className="tc">
                  <span className={agFlag(m.anexo)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                </td>
                <td>{m.fecha}</td>
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
        <Modal title="Crear motivo de estado" onClose={closeModal}>
          <div className="field">
            <label className="lbl">Nombre <span className="req">*</span></label>
            <input
              className="inp"
              placeholder="Ej. Cambio de asesor, Prórroga…"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="hint" style={{ marginTop: 2 }}>¿En qué acciones aplica este motivo?</div>
          <div className="trow">
            <span className="trow-l">Cancelación</span>
            <Switch on={canc} onToggle={() => setCanc((v) => !v)} />
          </div>
          <div className="trow">
            <span className="trow-l">No renovación</span>
            <Switch on={noren} onToggle={() => setNoren((v) => !v)} />
          </div>
          <div className="trow" style={{ borderBottom: 'none' }}>
            <span className="trow-l">Creación de anexo</span>
            <Switch on={anexo} onToggle={() => setAnexo((v) => !v)} />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
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
