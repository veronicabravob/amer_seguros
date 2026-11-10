/**
 * Puerta de todas las pantallas de la aplicación (CA-4).
 *
 * Sin sesión no se llega a ninguna ruta distinta de /login, y la ruta que se había pedido
 * se guarda para volver a ella justo después de ingresar.
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSesion } from '../../context/SesionContext';

export default function RutaProtegida() {
  const { usuario, cargando } = useSesion();
  const ubicacion = useLocation();

  // Mientras no se sabe si hay sesión no se decide nada: redirigir aquí haría parpadear
  // /login en cada recarga de una persona que sí tiene sesión.
  if (cargando) {
    return null;
  }

  if (usuario === null) {
    return <Navigate to="/login" state={{ desde: ubicacion }} replace />;
  }

  return <Outlet />;
}
