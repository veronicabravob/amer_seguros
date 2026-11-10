import type {
  Aseguradora,
  Client,
  Cobertura,
  EstadoSiniestro,
  MotivoPoliza,
  Policy,
  Ramo,
  Sede,
  TipoAfiliacion,
  AppUser,
  Vendedor,
} from '../types';

export const policies: Policy[] = [
  { id: 'PZ001', num: '994-0024-14', nueva: true, ren: false, cliente: 'Constructora Los Cerros SAS', doc: '900.611.470-2', aseguradora: 'Seguros SURA', ramo: 'Cumplimiento', riesgo: 'Contrato 024-2024', prima: 14880000, estado: 'Vigente', inicio: '01 Feb 2025', fin: '01 Feb 2027', pct: 52, left: 78, vendedor: 'Laura Gómez' },
  { id: 'PZ002', num: '100-0575-31', nueva: true, ren: false, cliente: 'Orbe Ingeniería SAS', doc: '900.512.980-4', aseguradora: 'Mundial de Seguros', ramo: 'Cumplimiento', riesgo: 'Orden de compra 118', prima: 8320000, estado: 'Por vencer', inicio: '15 Ago 2025', fin: '20 Jul 2026', pct: 96, left: 12, vendedor: 'Carlos Rincón' },
  { id: 'PZ003', num: '100-0598-47', nueva: false, ren: true, cliente: 'Escuela MJ Capacitaciones SAS', doc: '900.774.310-6', aseguradora: 'Mundial de Seguros', ramo: 'RC', riesgo: 'CW-2347470', prima: 5640000, estado: 'Por vencer', inicio: '01 Sep 2025', fin: '28 Jul 2026', pct: 92, left: 20, vendedor: 'Andrea Martínez' },
  { id: 'PZ004', num: '100-0162-23', nueva: false, ren: false, cliente: 'Escuela MJ Capacitaciones SAS', doc: '900.774.310-6', aseguradora: 'Seguros Bolívar', ramo: 'RC', riesgo: 'Otro sí No.1', prima: 3210000, estado: 'Vigente', inicio: '10 Mar 2025', fin: '10 Mar 2027', pct: 44, left: 245, vendedor: 'Laura Gómez' },
  { id: 'PZ005', num: '100-0624-92', nueva: true, ren: false, cliente: 'Consultores del Llano SAS', doc: '804.002.910-7', aseguradora: 'Mundial de Seguros', ramo: 'Cumplimiento', riesgo: '192-2024', prima: 22400000, estado: 'Vigente', inicio: '05 Ene 2026', fin: '05 Ene 2027', pct: 50, left: 181, vendedor: 'Carlos Rincón' },
  { id: 'PZ006', num: '994-0039-79', nueva: false, ren: false, cliente: 'Consorcio Vía Andina', doc: '901.777.222-9', aseguradora: 'Solidaria', ramo: 'RC', riesgo: 'Consorcio Vía Andina', prima: 11750000, estado: 'Vigente', inicio: '20 Abr 2025', fin: '20 Abr 2027', pct: 38, left: 286, vendedor: 'Andrea Martínez' },
  { id: 'PZ007', num: 'AUT-4451-08', nueva: false, ren: false, cliente: 'Distribuidora El Roble SAS', doc: '830.117.640-9', aseguradora: 'Allianz', ramo: 'Autos', riesgo: 'Placa KLM-482', prima: 2980000, estado: 'Vencida', inicio: '12 Jun 2024', fin: '12 Jun 2025', pct: 100, left: -26, vendedor: 'Laura Gómez' },
  { id: 'PZ008', num: 'VID-2210-33', nueva: false, ren: true, cliente: 'Manufacturas Andinas SAS', doc: '860.507.220-8', aseguradora: 'Seguros SURA', ramo: 'Vida', riesgo: 'Grupo empleados', prima: 18600000, estado: 'Vigente', inicio: '01 Ene 2026', fin: '01 Ene 2027', pct: 51, left: 177, vendedor: 'Andrea Martínez' },
  { id: 'PZ009', num: 'SAL-0087-15', nueva: false, ren: false, cliente: 'Alimentos Frescos del Valle SAS', doc: '900.226.150-3', aseguradora: 'Seguros Bolívar', ramo: 'Salud', riesgo: 'Plan corporativo', prima: 9420000, estado: 'Por vencer', inicio: '05 Ago 2025', fin: '02 Ago 2026', pct: 90, left: 25, vendedor: 'Carlos Rincón' },
  { id: 'PZ010', num: 'CUM-9932-77', nueva: false, ren: false, cliente: 'Ingeniería Vial del Norte SAS', doc: '901.444.888-3', aseguradora: 'Solidaria', ramo: 'Cumplimiento', riesgo: 'Licitación LP-08', prima: 31500000, estado: 'Vigente', inicio: '18 Feb 2026', fin: '18 Feb 2028', pct: 22, left: 590, vendedor: 'Laura Gómez' },
  { id: 'PZ011', num: 'AUT-7788-21', nueva: false, ren: false, cliente: 'Transportes La Sabana SAS', doc: '830.992.470-1', aseguradora: 'Allianz', ramo: 'Autos', riesgo: 'Flota 14 vehículos', prima: 42800000, estado: 'Vigente', inicio: '10 Nov 2025', fin: '10 Nov 2026', pct: 66, left: 125, vendedor: 'Carlos Rincón' },
  { id: 'PZ012', num: 'RC-3320-90', nueva: true, ren: false, cliente: 'Clínica Santa Marta SAS', doc: '900.662.905-7', aseguradora: 'Seguros SURA', ramo: 'RC', riesgo: 'RC profesional médica', prima: 27300000, estado: 'Vigente', inicio: '01 Mar 2026', fin: '01 Mar 2027', pct: 41, left: 236, vendedor: 'Andrea Martínez' },
];

export const TOTAL_POLIZAS = 685;
export const TOTAL_CLIENTES = 358;

export const clients: Client[] = [
  { id: 'C01', tipo: 'Empresa', name: 'Andina Construcciones SAS', doc: '800.451.223-7', docType: 'NIT', tel: '+57 310 200 1101', email: 'contacto@andinaconstrucciones.co', ciudad: 'Duitama', polizas: 4, estado: 'Cliente' },
  { id: 'C02', tipo: 'Persona', name: 'Alberto Guzmán Latorre', doc: '79.512.334', docType: 'C.C.', tel: '+57 310 200 1102', email: '', ciudad: 'Tunja', polizas: 2, estado: 'Cliente' },
  { id: 'C03', tipo: 'Persona', name: 'Adriana Lucía Rendón Parra', doc: '1.010.555.201', docType: 'C.C.', tel: '+57 310 200 1103', email: '', ciudad: 'Sogamoso', polizas: 1, estado: 'Prospecto' },
  { id: 'C04', tipo: 'Persona', name: 'Amparo Gil Rojas', doc: '41.887.220', docType: 'C.C.', tel: '+57 310 200 1104', email: '', ciudad: 'Duitama', polizas: 1, estado: 'Cliente' },
  { id: 'C05', tipo: 'Empresa', name: 'Estructuras Livianas SAS', doc: '901.222.334-5', docType: 'NIT', tel: '+57 310 200 1105', email: 'contacto@estructuraslivianas.co', ciudad: 'Bogotá', polizas: 3, estado: 'Cliente' },
  { id: 'C06', tipo: 'Persona', name: 'Alonso Serrano Guerra', doc: '79.664.108', docType: 'C.C.', tel: '+57 310 200 1106', email: '', ciudad: 'Paipa', polizas: 2, estado: 'Cliente' },
  { id: 'C07', tipo: 'Persona', name: 'Álvaro Salgado Guzmán', doc: '19.334.556', docType: 'C.C.', tel: '+57 310 200 1107', email: 'a.salgado@correo.co', ciudad: 'Tunja', polizas: 5, estado: 'Cliente' },
  { id: 'C08', tipo: 'Empresa', name: 'AMER Consultoría de Seguros SAS', doc: '901.900.100-1', docType: 'NIT', tel: '+57 310 200 1108', email: 'ejecutivo@amerseguros.com', ciudad: 'Duitama', polizas: 8, estado: 'Cliente' },
  { id: 'C09', tipo: 'Empresa', name: 'Ágora Soluciones SAS', doc: '901.333.555-2', docType: 'NIT', tel: '+57 310 200 1109', email: 'contacto@agorasoluciones.co', ciudad: 'Bogotá', polizas: 2, estado: 'Prospecto' },
  { id: 'C10', tipo: 'Persona', name: 'Ana Carolina Herrera Vela', doc: '1.020.777.313', docType: 'C.C.', tel: '+57 310 200 1110', email: '', ciudad: 'Sogamoso', polizas: 0, estado: 'Inactivo' },
  { id: 'C11', tipo: 'Consorcio', name: 'Consorcio Vía Andina', doc: '901.777.222-9', docType: 'NIT', tel: '+57 310 200 1111', email: 'contacto@consorcioviaandina.co', ciudad: 'Duitama', polizas: 2, estado: 'Cliente' },
  { id: 'C12', tipo: 'Empresa', name: 'Ingeniería Vial del Norte SAS', doc: '901.444.888-3', docType: 'NIT', tel: '+57 310 200 1112', email: 'contacto@ingvialnorte.co', ciudad: 'Tunja', polizas: 1, estado: 'Cliente' },
];

export const users: AppUser[] = [
  { name: 'Laura Gómez', email: 'laura.gomez@amerseguros.com', rol: 'Administrador', sede: 'Duitama', estado: 'Activo' },
  { name: 'Carlos Rincón', email: 'carlos.rincon@amerseguros.com', rol: 'Asesor comercial', sede: 'Tunja', estado: 'Activo' },
  { name: 'Andrea Martínez', email: 'andrea.martinez@amerseguros.com', rol: 'Asesor comercial', sede: 'Sogamoso', estado: 'Activo' },
  { name: 'Julián Castro', email: 'julian.castro@amerseguros.com', rol: 'Cobros', sede: 'Duitama', estado: 'Activo' },
  { name: 'Paula Ruiz', email: 'paula.ruiz@amerseguros.com', rol: 'Recepción', sede: 'Duitama', estado: 'Inactivo' },
];

export const sedes: Sede[] = [
  { name: 'Principal', email: 'principal@amerseguros.com', tel: '+57 (608) 700 1001', dir: 'Cra 15 # 10-20, Duitama', users: 9, ppal: true },
  { name: 'Tunja', email: 'tunja@amerseguros.com', tel: '+57 (608) 700 1002', dir: 'Cll 20 # 11-15, Tunja', users: 5, ppal: false },
  { name: 'Sogamoso', email: 'sogamoso@amerseguros.com', tel: '+57 (608) 700 1003', dir: 'Cra 12 # 14-30, Sogamoso', users: 3, ppal: false },
];

export const vendedores: Vendedor[] = [
  { name: 'Álvaro Rueda Tovar', ced: '1.098.100.201', com: '30.00', sobre: 'Prima neta', ret: '0.00', tipo: 'Natural', agencia: true, sede: 'Principal' },
  { name: 'AMER Consultoría de Seguros', ced: '901.900.100-1', com: '100.00', sobre: 'Agencia', ret: '0.00', tipo: 'Jurídica', agencia: true, sede: 'Principal' },
  { name: 'Ángela Ximena Cortés', ced: '1.052.100.202', com: '0.00', sobre: 'Agencia', ret: '0.00', tipo: 'Natural', agencia: false, sede: 'Principal' },
  { name: 'Ana Rivera', ced: '—', com: '30.00', sobre: 'Agencia', ret: '0.00', tipo: 'Natural', agencia: false, sede: 'Principal' },
  { name: 'Bryan Nicolás Solano Herrán', ced: '1.099.100.203', com: '0.00', sobre: 'Agencia', ret: '0.00', tipo: 'Natural', agencia: false, sede: 'Tunja' },
  { name: 'Carlos Andrés Quiroga', ced: '1.057.100.204', com: '10.00', sobre: 'Agencia', ret: '0.00', tipo: 'Natural', agencia: false, sede: 'Principal' },
  { name: 'Jair Alexis Suescún Rojas', ced: '1.192.100.205', com: '10.00', sobre: 'Agencia', ret: '0.00', tipo: 'Natural', agencia: false, sede: 'Sogamoso' },
  { name: 'John Fredy Gaitán Silva', ced: '79.100.206', com: '5.00', sobre: 'Prima neta', ret: '0.00', tipo: 'Natural', agencia: false, sede: 'Principal' },
  { name: 'Leonardo Andrés Lozano', ced: '1.005.100.207', com: '10.00', sobre: 'Agencia', ret: '0.00', tipo: 'Natural', agencia: false, sede: 'Principal' },
  { name: 'Luis Eduardo Pineda Torres', ced: '1.002.100.208', com: '0.00', sobre: 'Agencia', ret: '0.00', tipo: 'Natural', agencia: false, sede: 'Tunja' },
];

export const tiposAfiliacion: TipoAfiliacion[] = [
  { name: 'Titular', fecha: '02 Sep 2025' },
  { name: 'Cónyuge', fecha: '02 Sep 2025' },
  { name: 'Hijo(a)', fecha: '02 Sep 2025' },
  { name: 'Beneficiario adicional', fecha: '12 Mar 2025' },
  { name: 'Grupo familiar', fecha: '21 Mar 2025' },
];

export const aseguradoras: Aseguradora[] = [
  { name: 'Allianz Seguros', nit: '860.026.182-5', email: 'contacto@allianz.co', tel: '+57 601 743 7700', ramos: 6 },
  { name: 'AXA Colpatria Seguros', nit: '860.002.184-6', email: 'servicio@axacolpatria.co', tel: '+57 601 423 5757', ramos: 8 },
  { name: 'Berkley International Seguros', nit: '900.814.916-1', email: 'info@berkley.com.co', tel: '+57 601 650 9000', ramos: 3 },
  { name: 'HDI Seguros', nit: '860.004.875-6', email: 'contacto@hdi.com.co', tel: '+57 601 307 7050', ramos: 5 },
  { name: 'La Equidad Seguros', nit: '860.028.415-5', email: 'servicio@laequidad.coop', tel: '+57 601 344 2500', ramos: 7 },
  { name: 'La Previsora S.A.', nit: '860.002.400-2', email: 'contacto@previsora.gov.co', tel: '+57 601 743 5555', ramos: 4 },
  { name: 'Mapfre Seguros Generales', nit: '891.700.037-9', email: 'servicio@mapfre.com.co', tel: '+57 601 650 4000', ramos: 9 },
  { name: 'Mundial de Seguros SA', nit: '860.037.013-6', email: 'contacto@mundialseguros.com.co', tel: '+57 601 307 8000', ramos: 6 },
  { name: 'Nacional de Seguros', nit: '860.002.527-9', email: 'info@nacionaldeseguros.com.co', tel: '+57 601 620 4040', ramos: 2 },
  { name: 'Seguros Comerciales Bolívar', nit: '860.002.503-2', email: 'servicio@segurosbolivar.com', tel: '+57 601 312 4700', ramos: 10 },
];

export const ramos: Ramo[] = [
  { name: 'Autos / Vehículos livianos', aseg: 'AXA Colpatria Seguros', mas: '+10', iva: true, fecha: '02 Ene 2026' },
  { name: 'Cumplimiento', aseg: 'Berkley International', mas: '+4', iva: true, fecha: '02 Ene 2026' },
  { name: 'RC Contratos', aseg: 'Berkley International', mas: '+4', iva: true, fecha: '02 Ene 2026' },
  { name: 'Responsabilidad Civil General', aseg: 'La Previsora S.A.', mas: '+3', iva: false, fecha: '29 Ene 2026' },
  { name: 'Vida Grupo', aseg: 'La Previsora S.A.', mas: '+1', iva: false, fecha: '29 Ene 2026' },
  { name: 'Todo Riesgo Daño Material', aseg: 'La Previsora S.A.', mas: '+1', iva: false, fecha: '29 Ene 2026' },
  { name: 'Seriedad', aseg: 'Berkley International', mas: '+4', iva: false, fecha: '27 Ene 2026' },
  { name: 'PYME', aseg: 'AXA Colpatria Seguros', mas: '+4', iva: true, fecha: '26 Ene 2026' },
  { name: 'Disposiciones Legales', aseg: 'Berkley International', mas: '+2', iva: false, fecha: '24 Ene 2026' },
  { name: 'Pesados', aseg: 'HDI Seguros', mas: '+4', iva: false, fecha: '23 Ene 2026' },
];

/** Ramos reales de AMER (Excel de Ramos Activos), para el selector de "Crear póliza" */
export const ramosCatalogo = [
  'Autos / Vehículos', 'Cumplimiento', 'Responsabilidad Civil', 'Vida', 'Vida Grupo',
  'Salud', 'Transporte', 'Todo Riesgo', 'Manejo', 'Hogar', 'Accidentes Personales',
  'ARL', 'Copropiedades', 'Maquinaria y Equipo',
];

export const coberturas: Cobertura[] = [
  { name: 'Incendio y/o rayo', fecha: '02 Sep 2025' },
  { name: 'Terremoto, temblor y/o erupción volcánica', fecha: '02 Sep 2025' },
  { name: 'Responsabilidad civil', fecha: '02 Sep 2025' },
  { name: 'Pérdida total por hurto', fecha: '02 Sep 2025' },
  { name: 'Pérdida parcial por daños', fecha: '02 Sep 2025' },
  { name: 'Asistencia en viaje', fecha: '02 Sep 2025' },
  { name: 'Vehículo de reemplazo', fecha: '02 Sep 2025' },
  { name: 'Muerte accidental', fecha: '02 Sep 2025' },
  { name: 'Gastos médicos por accidente', fecha: '02 Sep 2025' },
  { name: 'Rotura de maquinaria', fecha: '02 Sep 2025' },
];

export const motivosPoliza: MotivoPoliza[] = [
  { name: 'Cambio de asesor', canc: true, noren: true, anexo: false, fecha: '02 Sep 2025' },
  { name: 'Cambio valor asegurado', canc: false, noren: false, anexo: true, fecha: '02 Sep 2025' },
  { name: 'Falleció asegurado', canc: true, noren: true, anexo: false, fecha: '02 Sep 2025' },
  { name: 'Prórroga', canc: false, noren: false, anexo: true, fecha: '12 Mar 2025' },
  { name: 'Vendió el objeto', canc: true, noren: true, anexo: false, fecha: '02 Sep 2025' },
  { name: 'Vigencia finalizada', canc: false, noren: true, anexo: false, fecha: '21 Mar 2025' },
];

export const estadosSiniestro: EstadoSiniestro[] = [
  { name: 'Solicitado', color: '#1466D6', fecha: '02 Sep 2025' },
  { name: 'En proceso', color: '#C77A05', fecha: '02 Sep 2025' },
  { name: 'Objetado', color: '#DC2F3B', fecha: '02 Sep 2025' },
  { name: 'Pagado', color: '#0E9F6E', fecha: '02 Sep 2025' },
];

export const asesores = ['Laura Gómez', 'Carlos Rincón', 'Andrea Martínez'];

export interface AttentionItem {
  client: string;
  detail: string;
  type: string;
  cta: string;
  cls: 'red' | 'amb' | 'teal';
}

export const attentionItems: AttentionItem[] = [
  { client: 'Distribuidora El Roble SAS', detail: 'AUT-4451-08 · Autos · vencida hace 26 días', type: 'Cobro', cta: 'Gestionar', cls: 'red' },
  { client: 'Orbe Ingeniería SAS', detail: '100-0575-31 · Cumplimiento · vence en 12 días', type: 'Por vencer', cta: 'Renovar', cls: 'amb' },
  { client: 'Escuela MJ Capacitaciones SAS', detail: '100-0598-47 · RC · vence en 20 días', type: 'Renovación', cta: 'Renovar', cls: 'teal' },
  { client: 'Alimentos Frescos del Valle SAS', detail: 'SAL-0087-15 · cuota vence en 25 días', type: 'Cobro', cta: 'Recordar', cls: 'amb' },
  { client: 'Manufacturas Andinas SAS', detail: 'VID-2210-33 · renovación pendiente', type: 'Renovación', cta: 'Contactar', cls: 'teal' },
];

export const productionRaw = [
  { m: 'Feb', v: 9 },
  { m: 'Mar', v: 12 },
  { m: 'Abr', v: 8 },
  { m: 'May', v: 14 },
  { m: 'Jun', v: 11 },
  { m: 'Jul', v: 18 },
];
