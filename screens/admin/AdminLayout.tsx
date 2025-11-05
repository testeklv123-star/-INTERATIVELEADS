import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTenantStore } from '../../stores/tenantStore';
import tenantService from '../../services/tenantService';
import useAdminAuthStore from '../../stores/adminAuthStore';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const tenantConfig = useTenantStore((state) => state.tenantConfig);
  const clearTenant = useTenantStore((state) => state.clearTenant);
  const signOut = useAdminAuthStore((state) => state.signOut);

  const handleLogout = () => {
    void (async () => {
      try {
        await tenantService.clearActiveTenantId();
      } catch (error) {
        console.warn('⚠️ [AdminLayout] Falha ao limpar tenant ativo:', error);
      }

      clearTenant();
      signOut();
      navigate('/setup', { replace: true });
    })();
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700 text-center">
          <p className="text-sm text-gray-400 uppercase tracking-wide">Painel Administrativo</p>
          <h1 className="text-2xl font-bold mt-2">{tenantConfig?.brand_name ?? 'Tenant'}</h1>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          <NavLink to="/admin/leads" className={({ isActive }) => `block py-2.5 px-4 rounded transition-colors ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>📊 Leads</NavLink>
          <NavLink to="/admin/brand" className={({ isActive }) => `block py-2.5 px-4 rounded transition-colors ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>🎨 Marca</NavLink>
          <NavLink to="/admin/prizes" className={({ isActive }) => `block py-2.5 px-4 rounded transition-colors ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>🎁 Prêmios (Roda)</NavLink>
          <NavLink to="/admin/games" className={({ isActive }) => `block py-2.5 px-4 rounded transition-colors ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>⚙️ Config. Jogos</NavLink>
        </nav>
        <div className="p-4 border-t border-gray-700">
            <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">
                Resetar e Sair
            </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;