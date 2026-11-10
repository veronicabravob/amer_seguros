/** Utilidades compartidas por las pruebas E2E de sesión. */

import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import type { Page } from '@playwright/test';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const API = path.join(RAIZ, 'api');

export const CUENTAS = {
  administradora: {
    correo: 'laura.gomez@amerseguros.com',
    nombre: 'Laura Gómez',
    rol: 'Administrador',
  },
  asesor: {
    correo: 'carlos.rincon@amerseguros.com',
    nombre: 'Carlos Rincón',
    rol: 'Asesor comercial',
  },
  cobros: {
    correo: 'julian.castro@amerseguros.com',
    nombre: 'Julián Castro',
    rol: 'Cobros',
  },
  inactiva: {
    correo: 'paula.ruiz@amerseguros.com',
    nombre: 'Paula Ruiz',
    rol: 'Recepción',
  },
} as const;

export const PASSWORD = 'Amer2026*demo';

/** Segundos que dura el bloqueo de RN-2 en el entorno de pruebas (ver playwright.config.ts). */
export const VENTANA_BLOQUEO_SEG = Number(process.env.AMER_VENTANA_BLOQUEO_SEGUNDOS ?? 20);

/** Rellena y envía el formulario de ingreso. */
export async function ingresar(page: Page, correo: string, password: string = PASSWORD) {
  await page.getByTestId('login-correo').fill(correo);
  await page.getByTestId('login-password').fill(password);
  await page.getByTestId('login-enviar').click();
}

/**
 * Ejecuta código contra la base de datos de las pruebas.
 *
 * Es la forma de comprobar los escenarios que dependen del paso del tiempo (una sesión con
 * 9 horas de inactividad) o de un cambio administrativo que todavía no tiene pantalla
 * (desactivar una cuenta, que llega con HU-019), sin abrir endpoints de prueba en el API.
 */
export function enLaBaseDePruebas(codigo: string): string {
  const salida = execFileSync('uv', ['run', 'python', 'manage.py', 'shell', '-c', codigo], {
    cwd: API,
    encoding: 'utf-8',
    env: { ...process.env, AMER_DB: 'e2e' },
  });
  // El shell de Django imprime antes un aviso de los modelos que auto-importa: lo que
  // interesa es la última línea, la que imprime el código.
  const lineas = salida.split(/\r?\n/).filter((linea) => linea.trim() !== '');
  return lineas.length === 0 ? '' : lineas[lineas.length - 1].trim();
}

/** Pone el estado de una cuenta (`Activo` / `Inactivo`). */
export function fijarEstadoDeCuenta(correo: string, estado: 'Activo' | 'Inactivo') {
  enLaBaseDePruebas(
    'from apps.usuarios.models import Usuario;' +
      `Usuario.objects.filter(correo="${correo}").update(estado="${estado}")`,
  );
}

/** Envejece la última actividad de todas las sesiones de una cuenta. */
export function envejecerSesiones(correo: string, horas: number) {
  enLaBaseDePruebas(
    'from datetime import timedelta;' +
      'from django.utils import timezone;' +
      'from apps.usuarios.models import SesionToken;' +
      `SesionToken.objects.filter(usuario__correo="${correo}").update(` +
      `ultimo_uso=timezone.now() - timedelta(hours=${horas}))`,
  );
}

/** Última actividad registrada de la sesión viva más reciente de una cuenta. */
export function ultimoUsoDeLaSesion(correo: string): string {
  return enLaBaseDePruebas(
    'from apps.usuarios.models import SesionToken;' +
      `s = SesionToken.objects.filter(usuario__correo="${correo}", ` +
      'revocado_en__isnull=True).order_by("-creado_en").first();' +
      'print(s.ultimo_uso.isoformat())',
  );
}

/** Borra los intentos de ingreso de un correo, para que RN-2 no se filtre entre pruebas. */
export function limpiarIntentos(correo: string) {
  enLaBaseDePruebas(
    'from apps.usuarios.models import IntentoIngreso;' +
      `IntentoIngreso.objects.filter(correo_normalizado="${correo}").delete()`,
  );
}
