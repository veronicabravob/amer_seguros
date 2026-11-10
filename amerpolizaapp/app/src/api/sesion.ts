/** Llamadas de sesión (HU-001). */

import { pedir } from './client';

export type UsuarioSesion = {
  nombre: string;
  correo: string;
  rol: string;
  sede: string;
  estado: string;
  iniciales: string;
};

type LoginOut = {
  token: string;
  usuario: UsuarioSesion;
};

export function login(correo: string, password: string): Promise<LoginOut> {
  return pedir<LoginOut>('/auth/login', {
    metodo: 'POST',
    cuerpo: { correo, password },
    // Un 401 aquí significa "credenciales incorrectas", no "se acabó la sesión".
    silenciarSinSesion: true,
  });
}

export function logout(): Promise<{ mensaje: string }> {
  return pedir<{ mensaje: string }>('/auth/logout', {
    metodo: 'POST',
    silenciarSinSesion: true,
  });
}

export function me(): Promise<UsuarioSesion> {
  // Al arrancar la SPA no se sabe si hay sesión: un 401 aquí es la respuesta normal.
  return pedir<UsuarioSesion>('/auth/me', { silenciarSinSesion: true });
}
