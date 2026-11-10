/**
 * Cliente único del API.
 *
 * Todas las llamadas pasan por aquí para que el token (cookie HttpOnly) viaje siempre y
 * para que el 401 se trate en un solo sitio: caducidad, cuenta desactivada o cierre de
 * sesión se notan igual en cualquier pantalla, sin repetir código.
 */

export type ErrorApi = {
  codigo: string;
  mensaje: string;
  campo?: string | null;
};

export class ApiError extends Error {
  readonly estado: number;
  readonly codigo: string;
  readonly campo: string | null;

  constructor(estado: number, cuerpo: Partial<ErrorApi>) {
    super(cuerpo.mensaje ?? 'No se pudo completar la operación');
    this.name = 'ApiError';
    this.estado = estado;
    this.codigo = cuerpo.codigo ?? 'error_desconocido';
    this.campo = cuerpo.campo ?? null;
  }
}

type Escucha = () => void;

const escuchasSinSesion = new Set<Escucha>();

/** Avisa cuando el API responde 401, para que la sesión se limpie y se vaya a /login. */
export function alPerderLaSesion(escucha: Escucha): () => void {
  escuchasSinSesion.add(escucha);
  return () => {
    escuchasSinSesion.delete(escucha);
  };
}

function avisarSinSesion() {
  escuchasSinSesion.forEach((escucha) => escucha());
}

type Opciones = {
  metodo?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  cuerpo?: unknown;
  /** Para el propio login: un 401 ahí es "credenciales malas", no "perdí la sesión". */
  silenciarSinSesion?: boolean;
};

export async function pedir<T>(ruta: string, opciones: Opciones = {}): Promise<T> {
  const { metodo = 'GET', cuerpo, silenciarSinSesion = false } = opciones;

  const respuesta = await fetch(`/api${ruta}`, {
    method: metodo,
    // La cookie de sesión es HttpOnly: sin esto no viaja.
    credentials: 'include',
    headers: cuerpo === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
  });

  if (respuesta.status === 401 && !silenciarSinSesion) {
    avisarSinSesion();
  }

  if (!respuesta.ok) {
    throw new ApiError(respuesta.status, await leerError(respuesta));
  }

  if (respuesta.status === 204) {
    return undefined as T;
  }

  return (await respuesta.json()) as T;
}

async function leerError(respuesta: Response): Promise<Partial<ErrorApi>> {
  try {
    return (await respuesta.json()) as Partial<ErrorApi>;
  } catch {
    // El backend siempre responde JSON; si llega otra cosa (un 502 del proxy, por
    // ejemplo) hace falta un mensaje igualmente.
    return { codigo: 'respuesta_no_valida', mensaje: 'El servidor no respondió correctamente' };
  }
}
