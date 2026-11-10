import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { SearchProvider } from '../../context/SearchContext';

export default function AppShell() {
  return (
    <SearchProvider>
      <div className="app">
        <Sidebar />
        <main className="main">
          <Topbar />
          <div className="content">
            <Outlet />
          </div>
        </main>
      </div>
    </SearchProvider>
  );
}
