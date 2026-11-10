/** Tareas 5.4 y 5.5 — ninguna pantalla es alcanzable sin sesión (CA-4). */

import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SesionProvider } from '../../context/SesionContext';
import RutaProtegida from './RutaProtegida';

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

function LoginFalso() {
  const ubicacion = useLocation();
  const estado = ubicacion.state as { desde?: { pathname: string } } | null;
  return (
    <div>
      <span>pantalla de ingreso</span>
      <span data-testid="desde">{estado?.desde?.pathname ?? 'sin-origen'}</span>
    </div>
  );
}

function montar(rutaInicial = '/polizas') {
  return render(
    <MemoryRouter initialEntries={[rutaInicial]}>
      <SesionProvider>
        <Routes>
          <Route path="/login" element={<LoginFalso />} />
          <Route element={<RutaProtegida />}>
            <Route path="/polizas" element={<div>listado de pólizas</div>} />
            <Route path="/dashboard" element={<div>tablero</div>} />
          </Route>
        </Routes>
      </SesionProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('sin sesión', () => {
  it('redirige a /login', async () => {
    vi.mocked(fetch).mockResolvedValue(respuesta(401, { codigo: 'sin_sesion' }));

    montar('/polizas');

    expect(await screen.findByText('pantalla de ingreso')).toBeInTheDocument();
    expect(screen.queryByText('listado de pólizas')).not.toBeInTheDocument();
  });

  it('recuerda la ruta que se había pedido', async () => {
    vi.mocked(fetch).mockResolvedValue(respuesta(401, {}));

    montar('/polizas');

    await waitFor(() => expect(screen.getByTestId('desde')).toHaveTextContent('/polizas'));
  });
});

describe('mientras se averigua si hay sesión', () => {
  it('no pinta la pantalla protegida', () => {
    vi.mocked(fetch).mockReturnValue(new Promise(() => {}));

    montar('/polizas');

    expect(screen.queryByText('listado de pólizas')).not.toBeInTheDocument();
  });

  it('no parpadea hacia /login', () => {
    vi.mocked(fetch).mockReturnValue(new Promise(() => {}));

    montar('/polizas');

    expect(screen.queryByText('pantalla de ingreso')).not.toBeInTheDocument();
  });
});

describe('con sesión', () => {
  it('deja ver la pantalla protegida', async () => {
    vi.mocked(fetch).mockResolvedValue(respuesta(200, laura));

    montar('/polizas');

    expect(await screen.findByText('listado de pólizas')).toBeInTheDocument();
  });

  it('el tablero también queda detrás de la puerta', async () => {
    vi.mocked(fetch).mockResolvedValue(respuesta(200, laura));

    montar('/dashboard');

    expect(await screen.findByText('tablero')).toBeInTheDocument();
  });
});
