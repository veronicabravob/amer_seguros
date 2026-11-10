import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { users } from '../../data/mockData';
import { initialsOf } from '../../data/helpers';
import StatusBadge from '../../components/ui/StatusBadge';

export default function UsuariosListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [search]);

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
          <h1 className="h1">Usuarios</h1>
          <p className="psub">Cuentas, roles y permisos del equipo</p>
        </div>
        <Link to="/configuracion/usuarios/nuevo" className="btn btn-pri">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Crear usuario
        </Link>
      </div>

      <div className="toolbar">
        <div className="tb-search" style={{ maxWidth: 320 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4-4" />
          </svg>
          <input placeholder="Buscar usuario…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div style={{ flex: 1 }} />
        <div className="selctl">
          <select className="sel" defaultValue="Todos los perfiles">
            <option>Todos los perfiles</option>
            <option>Administrador</option>
            <option>Asesor comercial</option>
            <option>Cobros</option>
            <option>Recepción</option>
          </select>
        </div>
      </div>

      <div className="card tblwrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Perfil</th>
              <th>Sede</th>
              <th>Estado</th>
              <th style={{ width: 70 }} />
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr className="prow" key={u.email}>
                <td>
                  <div className="cli-row">
                    <div className="cav">{initialsOf(u.name)}</div>
                    <div className="cli-nm">{u.name}</div>
                  </div>
                </td>
                <td>{u.email}</td>
                <td>{u.rol}</td>
                <td>{u.sede}</td>
                <td>
                  <StatusBadge label={u.estado} cls={u.estado === 'Activo' ? 'st-vigente' : 'st-off'} />
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
    </>
  );
}
