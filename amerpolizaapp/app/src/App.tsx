import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import RutaProtegida from './components/auth/RutaProtegida';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PolizasListPage from './pages/polizas/PolizasListPage';
import PolizaDetailPage from './pages/polizas/PolizaDetailPage';
import PolizaCreatePage from './pages/polizas/PolizaCreatePage';
import ClientesListPage from './pages/clientes/ClientesListPage';
import ClienteFormPage from './pages/clientes/ClienteFormPage';
import ClienteDetailPage from './pages/clientes/ClienteDetailPage';
import ConfigPanelPage from './pages/config/ConfigPanelPage';
import UsuariosListPage from './pages/config/UsuariosListPage';
import UsuarioFormPage from './pages/config/UsuarioFormPage';
import SedesPage from './pages/config/SedesPage';
import VendedoresListPage from './pages/config/VendedoresListPage';
import VendedorFormPage from './pages/config/VendedorFormPage';
import AfiliacionPage from './pages/config/AfiliacionPage';
import AseguradorasListPage from './pages/config/AseguradorasListPage';
import AseguradoraFormPage from './pages/config/AseguradoraFormPage';
import RamosListPage from './pages/config/RamosListPage';
import RamoFormPage from './pages/config/RamoFormPage';
import CoberturasPage from './pages/config/CoberturasPage';
import MotivosPage from './pages/config/MotivosPage';
import SiniestrosPage from './pages/config/SiniestrosPage';

function App() {
  return (
    <Routes>
      {/* Única ruta pública de la aplicación (CA-4). */}
      <Route path="login" element={<LoginPage />} />

      <Route element={<RutaProtegida />}>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />

          <Route path="polizas">
            <Route index element={<PolizasListPage />} />
            <Route path="nueva" element={<PolizaCreatePage />} />
            <Route path=":id" element={<PolizaDetailPage />} />
          </Route>

          <Route path="clientes">
            <Route index element={<ClientesListPage />} />
            <Route path="nuevo" element={<ClienteFormPage />} />
            <Route path=":id" element={<ClienteDetailPage />} />
          </Route>

          <Route path="configuracion">
            <Route index element={<ConfigPanelPage />} />
            <Route path="usuarios">
              <Route index element={<UsuariosListPage />} />
              <Route path="nuevo" element={<UsuarioFormPage />} />
            </Route>
            <Route path="sedes" element={<SedesPage />} />
            <Route path="vendedores">
              <Route index element={<VendedoresListPage />} />
              <Route path="nuevo" element={<VendedorFormPage />} />
            </Route>
            <Route path="afiliacion" element={<AfiliacionPage />} />
            <Route path="aseguradoras">
              <Route index element={<AseguradorasListPage />} />
              <Route path="nueva" element={<AseguradoraFormPage />} />
            </Route>
            <Route path="ramos">
              <Route index element={<RamosListPage />} />
              <Route path="nuevo" element={<RamoFormPage />} />
            </Route>
            <Route path="coberturas" element={<CoberturasPage />} />
            <Route path="motivos" element={<MotivosPage />} />
            <Route path="siniestros" element={<SiniestrosPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
