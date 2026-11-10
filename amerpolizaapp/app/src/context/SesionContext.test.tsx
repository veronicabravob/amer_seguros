/** Tarea 5.3 — el contexto de sesión pregunta al backend y trata el 401. */

import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SesionProvider, useSesion } from './SesionContext';

const laura = {
  nombre: 'Laura Gómez',
  correo: 'laura.gomez@amerseguros.com',
  rol: 'Administrador',
  sede: 'Duitama',
  estado: 'Activo',
  iniciales: 'LG',
};

function respuesta(estado: number, cuerpo: unknown) {
  return {
    ok: estado >= 200 && estado < 300,
    status: estado,
    json: async () => cuerpo,
  } as Response;
}

function Sonda() {
  const { usuario, cargando, ingresar, cerrarSesion } = useSesion();
  return (
    <div>
      <span data-testid="estado">
        {cargando ? 'cargando' : (usuario?.nombre ?? 'sin-sesion')}
      </span>
      <button onClick={() => ingresar('laura.gomez@amerseguros.com', 'Amer2026*demo')}>
        entrar
      </button>
      <button onClick={() => cerrarSesion()}>salir</button>
    </div>
  );
}

function montar() {
  return render(
    <SesionProvider>
      <Sonda />
    </SesionProvider>,
  );
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('arranque', () => {
  it('empieza en cargando antes de saber si hay sesión', () => {
    vi.mocked(fetch).mockReturnValue(new Promise(() => {}));

    montar();

    expect(screen.getByTestId('estado')).toHaveTextContent('cargando');
  });

  it('consulta GET /api/auth/me al montar', async () => {
    vi.mocked(fetch).mockResolvedValue(respuesta(200, laura));

    montar();

    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/auth/me', expect.anything()));
  });

  it('deja el usuario cuando hay sesión', async () => {
    vi.mocked(fetch).mockResolvedValue(respuesta(200, laura));

    montar();

    await waitFor(() => expect(screen.getByTestId('estado')).toHaveTextContent('Laura Gómez'));
  });

  it('un 401 al arrancar deja el usuario en nulo', async () => {
    vi.mocked(fetch).mockResolvedValue(respuesta(401, { codigo: 'sin_sesion' }));

    montar();

    await waitFor(() => expect(screen.getByTestId('estado')).toHaveTextContent('sin-sesion'));
  });

  it('un fallo de red también deja el usuario en nulo', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('sin red'));

    montar();

    await waitFor(() => expect(screen.getByTestId('estado')).toHaveTextContent('sin-sesion'));
  });
});

describe('ingresar y salir', () => {
  it('ingresar guarda el usuario que devuelve el backend', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(respuesta(401, {}))
      .mockResolvedValueOnce(respuesta(200, { token: 'jwt', usuario: laura }));
    montar();
    await waitFor(() => expect(screen.getByTestId('estado')).toHaveTextContent('sin-sesion'));

    await userEvent.click(screen.getByText('entrar'));

    await waitFor(() => expect(screen.getByTestId('estado')).toHaveTextContent('Laura Gómez'));
  });

  it('cerrar sesión vacía el usuario', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(respuesta(200, laura))
      .mockResolvedValueOnce(respuesta(200, { mensaje: 'Sesión cerrada' }));
    montar();
    await waitFor(() => expect(screen.getByTestId('estado')).toHaveTextContent('Laura Gómez'));

    await userEvent.click(screen.getByText('salir'));

    await waitFor(() => expect(screen.getByTestId('estado')).toHaveTextContent('sin-sesion'));
  });

  it('si el logout falla, la sesión se da por terminada igualmente', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(respuesta(200, laura))
      .mockRejectedValueOnce(new Error('sin red'));
    montar();
    await waitFor(() => expect(screen.getByTestId('estado')).toHaveTextContent('Laura Gómez'));

    await userEvent.click(screen.getByText('salir'));

    await waitFor(() => expect(screen.getByTestId('estado')).toHaveTextContent('sin-sesion'));
  });
});

describe('pérdida de sesión durante el uso', () => {
  it('un 401 de cualquier llamada vacía la sesión (cuenta desactivada o caducidad)', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(respuesta(200, laura));
    montar();
    await waitFor(() => expect(screen.getByTestId('estado')).toHaveTextContent('Laura Gómez'));

    vi.mocked(fetch).mockResolvedValue(respuesta(401, { codigo: 'sin_sesion' }));
    const { pedir } = await import('../api/client');
    // El aviso de "sin sesión" cambia el estado del proveedor: va dentro de act.
    await act(async () => {
      await expect(pedir('/polizas')).rejects.toBeTruthy();
    });

    await waitFor(() => expect(screen.getByTestId('estado')).toHaveTextContent('sin-sesion'));
  });
});
