/** Tarea 5.2 — el cliente de API centraliza la cookie y el manejo del 401. */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { alPerderLaSesion, ApiError, pedir } from './client';

function respuesta(estado: number, cuerpo: unknown) {
  return {
    ok: estado >= 200 && estado < 300,
    status: estado,
    json: async () => cuerpo,
  } as Response;
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('pedir', () => {
  it('antepone /api a la ruta', async () => {
    vi.mocked(fetch).mockResolvedValue(respuesta(200, { ok: true }));

    await pedir('/auth/me');

    expect(fetch).toHaveBeenCalledWith('/api/auth/me', expect.anything());
  });

  it('envía siempre las credenciales para que viaje la cookie de sesión', async () => {
    vi.mocked(fetch).mockResolvedValue(respuesta(200, {}));

    await pedir('/auth/me');

    expect(vi.mocked(fetch).mock.calls[0][1]).toMatchObject({ credentials: 'include' });
  });

  it('serializa el cuerpo como JSON', async () => {
    vi.mocked(fetch).mockResolvedValue(respuesta(200, {}));

    await pedir('/auth/login', { metodo: 'POST', cuerpo: { correo: 'a@b.co' } });

    const opciones = vi.mocked(fetch).mock.calls[0][1]!;
    expect(opciones.method).toBe('POST');
    expect(opciones.body).toBe('{"correo":"a@b.co"}');
    expect(opciones.headers).toMatchObject({ 'Content-Type': 'application/json' });
  });

  it('devuelve el cuerpo ya convertido', async () => {
    vi.mocked(fetch).mockResolvedValue(respuesta(200, { nombre: 'Laura Gómez' }));

    await expect(pedir<{ nombre: string }>('/auth/me')).resolves.toEqual({
      nombre: 'Laura Gómez',
    });
  });

  it('lanza ApiError con el código y el mensaje del backend', async () => {
    vi.mocked(fetch).mockResolvedValue(
      respuesta(403, { codigo: 'cuenta_inactiva', mensaje: 'Tu cuenta está inactiva' }),
    );

    await expect(pedir('/auth/login')).rejects.toMatchObject({
      estado: 403,
      codigo: 'cuenta_inactiva',
      message: 'Tu cuenta está inactiva',
    });
  });

  it('sobrevive a una respuesta que no es JSON', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => {
        throw new Error('no es JSON');
      },
    } as unknown as Response);

    await expect(pedir('/auth/me')).rejects.toBeInstanceOf(ApiError);
  });
});

describe('manejo del 401', () => {
  it('avisa a quien escuche cuando el API responde 401', async () => {
    const escucha = vi.fn();
    const dejar = alPerderLaSesion(escucha);
    vi.mocked(fetch).mockResolvedValue(respuesta(401, { codigo: 'sin_sesion' }));

    await expect(pedir('/polizas')).rejects.toBeInstanceOf(ApiError);

    expect(escucha).toHaveBeenCalledOnce();
    dejar();
  });

  it('no avisa cuando la llamada pidió silenciar el 401', async () => {
    const escucha = vi.fn();
    const dejar = alPerderLaSesion(escucha);
    vi.mocked(fetch).mockResolvedValue(respuesta(401, { codigo: 'credenciales_invalidas' }));

    await expect(
      pedir('/auth/login', { metodo: 'POST', silenciarSinSesion: true }),
    ).rejects.toBeInstanceOf(ApiError);

    expect(escucha).not.toHaveBeenCalled();
    dejar();
  });

  it('deja de avisar después de darse de baja', async () => {
    const escucha = vi.fn();
    alPerderLaSesion(escucha)();
    vi.mocked(fetch).mockResolvedValue(respuesta(401, {}));

    await expect(pedir('/polizas')).rejects.toBeInstanceOf(ApiError);

    expect(escucha).not.toHaveBeenCalled();
  });
});
