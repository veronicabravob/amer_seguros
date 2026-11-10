/**
 * Estado de la sesión en la SPA.
 *
 * El token vive en una cookie HttpOnly, así que el JavaScript no puede leerlo: la única
 * forma de saber si hay sesión es preguntárselo al backend con GET /api/auth/me. Mientras
 * esa consulta está en vuelo, `cargando` es true y nadie debe decidir redirecciones (si no,
 * se vería un parpadeo hacia /login en cada recarga).
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { alPerderLaSesion } from '../api/client';
import { login as loginApi, logout as logoutApi, me, type UsuarioSesion } from '../api/sesion';

type Sesion = {
  usuario: UsuarioSesion | null;
  cargando: boolean;
  ingresar: (correo: string, password: string) => Promise<UsuarioSesion>;
  cerrarSesion: () => Promise<void>;
};

const SesionCtx = createContext<Sesion | null>(null);

export function SesionProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let vigente = true;

    me()
      .then((datos) => {
        if (vigente) setUsuario(datos);
      })
      .catch(() => {
        if (vigente) setUsuario(null);
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });

    return () => {
      vigente = false;
    };
  }, []);

  // Cualquier 401 del API (sesión caducada o cuenta desactivada) vacía la sesión; de la
  // redirección se encarga RutaProtegida al quedarse sin usuario.
  useEffect(() => alPerderLaSesion(() => setUsuario(null)), []);

  const ingresar = useCallback(async (correo: string, password: string) => {
    const { usuario: datos } = await loginApi(correo, password);
    setUsuario(datos);
    return datos;
  }, []);

  const cerrarSesion = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // Aunque la llamada falle (sin red, token ya caducado), en este navegador la sesión
      // se da por terminada: propagar el error sólo dejaría al usuario atrapado en una
      // pantalla sin sesión.
    }
    setUsuario(null);
  }, []);

  const valor = useMemo<Sesion>(
    () => ({ usuario, cargando, ingresar, cerrarSesion }),
    [usuario, cargando, ingresar, cerrarSesion],
  );

  return <SesionCtx.Provider value={valor}>{children}</SesionCtx.Provider>;
}

export function useSesion(): Sesion {
  const valor = useContext(SesionCtx);
  if (valor === null) {
    throw new Error('useSesion debe usarse dentro de <SesionProvider>');
  }
  return valor;
}
