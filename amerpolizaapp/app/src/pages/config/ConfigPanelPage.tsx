import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface CardDef {
  to?: string;
  icon: ReactNode;
  title: string;
  desc: string;
}

const orgCards: CardDef[] = [
  {
    to: '/configuracion/usuarios',
    title: 'Usuarios',
    desc: 'Cuentas, roles y permisos del equipo',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      </svg>
    ),
  },
  {
    to: '/configuracion/sedes',
    title: 'Sedes',
    desc: 'Oficinas y puntos de atención',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M15 9h.01M9 13h.01M15 13h.01" />
      </svg>
    ),
  },
  {
    to: '/configuracion/vendedores',
    title: 'Vendedores',
    desc: 'Asesores y esquema de comisiones',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M7 8h4M7 12h6M7 16h3" />
      </svg>
    ),
  },
  {
    to: '/configuracion/afiliacion',
    title: 'Tipos de afiliación',
    desc: 'Categorías de vinculación de clientes',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20M6 15h4" />
      </svg>
    ),
  },
];

const catalogCards: CardDef[] = [
  {
    to: '/configuracion/aseguradoras',
    title: 'Aseguradoras',
    desc: 'Compañías con las que operas',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    to: '/configuracion/ramos',
    title: 'Ramos',
    desc: 'Líneas de negocio y subramos',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    to: '/configuracion/coberturas',
    title: 'Coberturas',
    desc: 'Amparos disponibles por ramo',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    to: '/configuracion/motivos',
    title: 'Motivos de estado de póliza',
    desc: 'Cancelación, no renovación, anexos',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M8 13h8M8 17h5" />
      </svg>
    ),
  },
  {
    to: '/configuracion/siniestros',
    title: 'Estados de siniestros',
    desc: 'Etapas del proceso de siniestro',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
    ),
  },
];

const commsCards: CardDef[] = [
  {
    title: 'WhatsApp',
    desc: 'Conexión y plantillas de mensajes',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 21l2.1-5.6A8.4 8.4 0 1 1 21 11.5z" />
      </svg>
    ),
  },
  {
    title: 'Correos',
    desc: 'Remitentes y notificaciones por email',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 7l-10 5L2 7" />
      </svg>
    ),
  },
  {
    title: 'Mensajeros',
    desc: 'Envío y recepción de documentos',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
      </svg>
    ),
  },
  {
    title: 'Plantillas',
    desc: 'Formatos de remisión y documentos',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
];

function CfgCard({ card }: { card: CardDef }) {
  const inner = (
    <>
      <div className="cfg-ic">{card.icon}</div>
      <div style={{ minWidth: 0 }}>
        <div className="cfg-t">{card.title}</div>
        <div className="cfg-d">{card.desc}</div>
      </div>
      {card.to && (
        <svg className="cfg-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      )}
    </>
  );
  if (card.to) {
    return (
      <Link to={card.to} className="card cfg-card">
        {inner}
      </Link>
    );
  }
  return (
    <div className="card cfg-card" style={{ cursor: 'default' }}>
      {inner}
    </div>
  );
}

export default function ConfigPanelPage() {
  return (
    <>
      <div className="pagehd">
        <div>
          <h1 className="h1">Configuración de la agencia</h1>
          <p className="psub">Administra catálogos, usuarios y comunicaciones de AMER Seguros</p>
        </div>
      </div>

      <div className="cfg-group">
        <p className="cfg-glbl">Organización</p>
        <div className="cfg-grid">
          {orgCards.map((c) => (
            <CfgCard key={c.title} card={c} />
          ))}
        </div>
      </div>

      <div className="cfg-group">
        <p className="cfg-glbl">Catálogos de pólizas</p>
        <div className="cfg-grid">
          {catalogCards.map((c) => (
            <CfgCard key={c.title} card={c} />
          ))}
        </div>
      </div>

      <div className="cfg-group">
        <p className="cfg-glbl">Comunicaciones</p>
        <div className="cfg-grid">
          {commsCards.map((c) => (
            <CfgCard key={c.title} card={c} />
          ))}
        </div>
      </div>
    </>
  );
}
