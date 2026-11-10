export type PolizaEstado = 'Vigente' | 'Por vencer' | 'Vencida';

export interface Policy {
  id: string;
  num: string;
  nueva: boolean;
  ren: boolean;
  cliente: string;
  doc: string;
  aseguradora: string;
  ramo: string;
  riesgo: string;
  prima: number;
  estado: PolizaEstado;
  inicio: string;
  fin: string;
  /** % of the term elapsed, 0-100 */
  pct: number;
  /** days remaining until `fin` (negative if already expired) */
  left: number;
  vendedor: string;
}

export type ClientTipo = 'Persona' | 'Empresa' | 'Consorcio';
export type ClientEstado = 'Cliente' | 'Prospecto' | 'Inactivo';

export interface Client {
  id: string;
  tipo: ClientTipo;
  name: string;
  doc: string;
  docType: string;
  tel: string;
  email: string;
  ciudad: string;
  polizas: number;
  estado: ClientEstado;
}

export interface AppUser {
  name: string;
  email: string;
  rol: string;
  sede: string;
  estado: 'Activo' | 'Inactivo';
}

export interface Sede {
  name: string;
  email: string;
  tel: string;
  dir: string;
  users: number;
  ppal: boolean;
}

export interface Vendedor {
  name: string;
  ced: string;
  com: string;
  sobre: string;
  ret: string;
  tipo: 'Natural' | 'Jurídica';
  agencia: boolean;
  sede: string;
}

export interface TipoAfiliacion {
  name: string;
  fecha: string;
}

export interface Aseguradora {
  name: string;
  nit: string;
  email: string;
  tel: string;
  ramos: number;
}

export interface Ramo {
  name: string;
  aseg: string;
  mas: string;
  iva: boolean;
  fecha: string;
}

export interface Cobertura {
  name: string;
  fecha: string;
}

export interface MotivoPoliza {
  name: string;
  canc: boolean;
  noren: boolean;
  anexo: boolean;
  fecha: string;
}

export interface EstadoSiniestro {
  name: string;
  color: string;
  fecha: string;
}
