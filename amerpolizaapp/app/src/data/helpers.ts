import type { Client, Policy, PolizaEstado } from '../types';

export function fmt(n: number): string {
  return '$ ' + new Intl.NumberFormat('es-CO').format(Math.round(n));
}

export function stCls(e: PolizaEstado): string {
  return e === 'Vigente' ? 'st-vigente' : e === 'Por vencer' ? 'st-vencer' : 'st-vencida';
}

export function pctColor(e: PolizaEstado): string {
  return e === 'Vigente' ? 'var(--grn)' : e === 'Por vencer' ? 'var(--amb)' : 'var(--red)';
}

export function leftLabel(l: number): string {
  if (l < 0) return `Vencida hace ${Math.abs(l)} días`;
  if (l <= 30) return `Vence en ${l} días`;
  return `${l} días restantes`;
}

const MESES: Record<string, number> = { Ene: 0, Feb: 1, Mar: 2, Abr: 3, May: 4, Jun: 5, Jul: 6, Ago: 7, Sep: 8, Oct: 9, Nov: 10, Dic: 11 };
const MESES_KEYS = Object.keys(MESES);

/** Fecha de expedición estimada: 8 días antes del inicio de vigencia */
export function expedicionOf(inicio: string): string {
  const parts = inicio.split(' ');
  const dt = new Date(+parts[2], MESES[parts[1]], +parts[0]);
  dt.setDate(dt.getDate() - 8);
  return String(dt.getDate()).padStart(2, '0') + ' ' + MESES_KEYS[dt.getMonth()] + ' ' + dt.getFullYear();
}

export function initialsOf(name: string): string {
  const p = name.replace(/[—-].*/, '').trim().split(/\s+/);
  return (((p[0] || '')[0] || '') + ((p[1] || '')[0] || '')).toUpperCase();
}

export interface ClientPolicy {
  num: string;
  ramo: string;
  aseg: string;
  prima: number;
  estado: PolizaEstado;
}

/** Genera pólizas sintéticas para el detalle de un cliente, en función de su conteo `polizas` */
export function genPolizasFor(c: Client): ClientPolicy[] {
  if (!c.polizas) return [];
  const ramosList = ['Autos', 'Cumplimiento', 'RC', 'Vida', 'Salud'];
  const asegs = ['Seguros SURA', 'Mundial de Seguros', 'Seguros Bolívar', 'Allianz', 'Solidaria'];
  const bases = [2980000, 8320000, 5640000, 18600000, 9420000];
  const prefs = ['AUT', 'CUM', 'RC', 'VID', 'SAL'];
  const out: ClientPolicy[] = [];
  for (let i = 0; i < c.polizas; i++) {
    const k = i % 5;
    out.push({
      num: prefs[k] + '-' + (1000 + (i * 137) % 9000) + '-' + c.id.slice(1),
      ramo: ramosList[k],
      aseg: asegs[i % 5],
      prima: bases[k] + i * 250000,
      estado: i === 0 && c.polizas > 1 ? 'Por vencer' : 'Vigente',
    });
  }
  return out;
}

export function agFlag(v: boolean): string {
  return v ? 'ag-yes' : 'ag-no';
}

export function clientTipoClasses(tipo: Client['tipo']) {
  return {
    cavCls: tipo === 'Empresa' ? 'emp' : tipo === 'Consorcio' ? 'con' : '',
    tpCls: tipo === 'Empresa' ? 'tp-emp' : tipo === 'Consorcio' ? 'tp-con' : 'tp-per',
    tpLabel: tipo.toUpperCase(),
  };
}

export function clientEstadoCls(estado: Client['estado']): string {
  return estado === 'Cliente' ? 'st-vigente' : estado === 'Prospecto' ? 'st-vencer' : 'st-off';
}

export function productionChart(raw: { m: string; v: number }[]) {
  const maxP = Math.max(...raw.map((x) => x.v));
  return raw.map((x, i) => ({
    m: x.m,
    pct: Math.round((x.v / maxP) * 100) + '%',
    cls: i === raw.length - 1 ? 'on' : '',
  }));
}

export interface RamoCartera {
  name: string;
  label: string;
  count: string;
  pct: string;
}

export function ramosCartera(policies: Policy[]): RamoCartera[] {
  const agg: Record<string, number> = {};
  const count: Record<string, number> = {};
  policies.forEach((p) => {
    agg[p.ramo] = (agg[p.ramo] || 0) + p.prima;
    count[p.ramo] = (count[p.ramo] || 0) + 1;
  });
  const maxR = Math.max(...Object.values(agg));
  return Object.entries(agg)
    .sort((a, b) => b[1] - a[1])
    .map(([name, v]) => ({
      name,
      label: fmt(v),
      count: count[name] + ' pólizas',
      pct: Math.round((v / maxR) * 100) + '%',
    }));
}

export interface PolicyDetail extends PolicyRow {
  neta: string;
  iva: string;
  comision: string;
  asegurado: string;
  gastos: string;
  renovable: string;
  expedicion: string;
  formaPago: string;
  tomador: string;
  tomadorDoc: string;
  asegurado2: string;
  aseguradoDoc: string;
  benefOneroso: string;
  benefDoc: string;
  benefRemision: string;
}

export function buildPolicyDetail(p: Policy): PolicyDetail {
  const tieneBeneficiario = p.ramo === 'Cumplimiento' || p.ramo === 'Autos';
  return {
    ...toPolicyRow(p),
    neta: fmt(p.prima / 1.19),
    iva: fmt(p.prima - p.prima / 1.19),
    comision: fmt((p.prima / 1.19) * 0.3),
    asegurado: fmt(p.prima * 40),
    gastos: fmt(Math.max(5000, p.prima * 0.003)),
    renovable: 'Sí',
    expedicion: expedicionOf(p.inicio),
    formaPago: 'Financiado',
    tomador: p.cliente,
    tomadorDoc: p.doc,
    asegurado2: p.cliente,
    aseguradoDoc: p.doc,
    benefOneroso: tieneBeneficiario ? 'Banco de los Andes S.A.' : 'No aplica',
    benefDoc: tieneBeneficiario ? '890.900.150-4' : '—',
    benefRemision: 'Sí',
  };
}

export interface PolicyRow extends Policy {
  primaFmt: string;
  stCls: string;
  pctLabel: string;
  pctColor: string;
  leftLabel: string;
}

export function toPolicyRow(p: Policy): PolicyRow {
  return {
    ...p,
    primaFmt: fmt(p.prima),
    stCls: stCls(p.estado),
    pctLabel: p.pct + '%',
    pctColor: pctColor(p.estado),
    leftLabel: leftLabel(p.left),
  };
}
