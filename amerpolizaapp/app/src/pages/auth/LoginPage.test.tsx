/** Tarea 6.3 — comportamiento de la pantalla de ingreso (CA-1 a CA-4). */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SesionProvider } from '../../context/SesionContext';
import LoginPage from './LoginPage';

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

function montar(estadoRuta?: { desde: { pathname: string } }) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/login', state: estadoRuta }]}>
      <SesionProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<div>tablero</div>} />
          <Route path="/polizas" element={<div>listado de pólizas</div>} />
        </Routes>
      </SesionProvider>
    </MemoryRouter>,
  );
}

/** Deja la pantalla lista: sin sesión y con el formulario pintado. */
async function montarSinSesion(estadoRuta?: { desde: { pathname: string } }) {
  vi.mocked(fetch).mockResolvedValueOnce(respuesta(401, { codigo: 'sin_sesion' }));
  montar(estadoRuta);
  return await screen.findByTestId('login-enviar');
}

async function ingresar(correo = 'laura.gomez@amerseguros.com', password = 'Amer2026*demo') {
  await userEvent.type(screen.getByTestId('login-correo'), correo);
  await userEvent.type(screen.getByTestId('login-password'), password);
  await userEvent.click(screen.getByTestId('login-enviar'));
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('el formulario', () => {
  it('pinta los campos con sus etiquetas', async () => {
    await montarSinSesion();

    expect(screen.getByLabelText(/Correo/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/)).toBeInTheDocument();
  });

  it('no muestra ningún error antes de intentar entrar', async () => {
    await montarSinSesion();

    expect(screen.queryByTestId('login-error')).not.toBeInTheDocument();
  });
});

describe('ingreso correcto (CA-1)', () => {
  it('lleva al tablero', async () => {
    await montarSinSesion();
    vi.mocked(fetch).mockResolvedValueOnce(respuesta(200, { token: 'jwt', usuario: laura }));

    await ingresar();

    expect(await screen.findByText('tablero')).toBeInTheDocument();
  });

  it('envía el correo y la contraseña al backend', async () => {
    await montarSinSesion();
    vi.mocked(fetch).mockResolvedValueOnce(respuesta(200, { token: 'jwt', usuario: laura }));

    await ingresar();

    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        '/api/auth/login',
        expect.objectContaining({
          body: JSON.stringify({
            correo: 'laura.gomez@amerseguros.com',
            password: 'Amer2026*demo',
          }),
        }),
      ),
    );
  });
});

describe('mensajes de error', () => {
  it('credenciales inválidas (CA-2)', async () => {
    await montarSinSesion();
    vi.mocked(fetch).mockResolvedValueOnce(
      respuesta(401, {
        codigo: 'credenciales_invalidas',
        mensaje: 'Correo o contraseña incorrectos',
      }),
    );

    await ingresar();

    expect(await screen.findByTestId('login-error')).toHaveTextContent(
      'Correo o contraseña incorrectos',
    );
  });

  it('cuenta inactiva (CA-3)', async () => {
    await montarSinSesion();
    vi.mocked(fetch).mockResolvedValueOnce(
      respuesta(403, {
        codigo: 'cuenta_inactiva',
        mensaje: 'Tu cuenta está inactiva, contacta al administrador',
      }),
    );

    await ingresar('paula.ruiz@amerseguros.com');

    expect(await screen.findByTestId('login-error')).toHaveTextContent(
      'Tu cuenta está inactiva, contacta al administrador',
    );
  });

  it('bloqueo por intentos fallidos (RN-2)', async () => {
    await montarSinSesion();
    vi.mocked(fetch).mockResolvedValueOnce(
      respuesta(429, {
        codigo: 'demasiados_intentos',
        mensaje: 'Demasiados intentos. Intenta de nuevo en 15 minutos',
      }),
    );

    await ingresar();

    expect(await screen.findByTestId('login-error')).toHaveTextContent(
      'Demasiados intentos. Intenta de nuevo en 15 minutos',
    );
  });

  it('si no hay servidor, lo dice sin dejar la pantalla en blanco', async () => {
    await montarSinSesion();
    vi.mocked(fetch).mockRejectedValueOnce(new Error('sin red'));

    await ingresar();

    expect(await screen.findByTestId('login-error')).toHaveTextContent(
      'No se pudo conectar con el servidor',
    );
  });
});

describe('tras un error', () => {
  it('conserva el correo escrito y vacía la contraseña', async () => {
    await montarSinSesion();
    vi.mocked(fetch).mockResolvedValueOnce(
      respuesta(401, { codigo: 'credenciales_invalidas', mensaje: 'Correo o contraseña incorrectos' }),
    );

    await ingresar();
    await screen.findByTestId('login-error');

    expect(screen.getByTestId('login-correo')).toHaveValue('laura.gomez@amerseguros.com');
    expect(screen.getByTestId('login-password')).toHaveValue('');
  });

  it('se queda en la pantalla de ingreso', async () => {
    await montarSinSesion();
    vi.mocked(fetch).mockResolvedValueOnce(respuesta(401, { mensaje: 'Correo o contraseña incorrectos' }));

    await ingresar();
    await screen.findByTestId('login-error');

    expect(screen.queryByText('tablero')).not.toBeInTheDocument();
  });

  it('el botón vuelve a quedar disponible', async () => {
    await montarSinSesion();
    vi.mocked(fetch).mockResolvedValueOnce(respuesta(401, { mensaje: 'Correo o contraseña incorrectos' }));

    await ingresar();
    await screen.findByTestId('login-error');

    expect(screen.getByTestId('login-enviar')).toBeEnabled();
  });
});

describe('vuelta a la ruta pedida (CA-4)', () => {
  it('regresa a la pantalla que se había intentado abrir', async () => {
    await montarSinSesion({ desde: { pathname: '/polizas' } });
    vi.mocked(fetch).mockResolvedValueOnce(respuesta(200, { token: 'jwt', usuario: laura }));

    await ingresar();

    expect(await screen.findByText('listado de pólizas')).toBeInTheDocument();
  });

  it('sin ruta previa, va al tablero', async () => {
    await montarSinSesion();
    vi.mocked(fetch).mockResolvedValueOnce(respuesta(200, { token: 'jwt', usuario: laura }));

    await ingresar();

    expect(await screen.findByText('tablero')).toBeInTheDocument();
  });
});

describe('con sesión ya iniciada', () => {
  it('no se queda en /login', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(respuesta(200, laura));

    montar();

    expect(await screen.findByText('tablero')).toBeInTheDocument();
  });
});
