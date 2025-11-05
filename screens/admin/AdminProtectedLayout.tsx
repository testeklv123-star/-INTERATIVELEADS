import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AdminPasswordModal from '../../components/common/AdminPasswordModal';
import { useTenantStore } from '../../stores/tenantStore';
import useAdminAuthStore from '../../stores/adminAuthStore';
import AdminLayout from './AdminLayout';

const AdminProtectedLayout: React.FC = () => {
  const navigate = useNavigate();
  const tenantConfig = useTenantStore((state) => state.tenantConfig);
  const {
    isAuthenticated,
    authenticatedTenantId,
    authenticate,
    signOut,
  } = useAdminAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!tenantConfig) {
      setIsModalOpen(false);
      return;
    }

    if (isAuthenticated && authenticatedTenantId === tenantConfig.tenant_id) {
      setIsModalOpen(false);
    } else {
      setIsModalOpen(true);
    }
  }, [tenantConfig, isAuthenticated, authenticatedTenantId]);

  useEffect(() => {
    if (!tenantConfig) {
      return;
    }

    if (
      isAuthenticated &&
      authenticatedTenantId &&
      authenticatedTenantId !== tenantConfig.tenant_id
    ) {
      signOut();
    }
  }, [tenantConfig, isAuthenticated, authenticatedTenantId, signOut]);

  if (!tenantConfig) {
    return <Navigate to="/setup" replace />;
  }

  const handleSuccess = () => {
    authenticate(tenantConfig.tenant_id);
    setIsModalOpen(false);
  };

  if (isAuthenticated && authenticatedTenantId === tenantConfig.tenant_id) {
    return <AdminLayout />;
  }

  return (
    <>
      <AdminPasswordModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          navigate('/');
        }}
        onSuccess={handleSuccess}
        correctPassword={tenantConfig.behavior.admin_password}
      />
      <div className="w-full h-screen flex items-center justify-center bg-gray-900 bg-opacity-80 text-white text-center p-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Acesso Restrito</h1>
          <p>Informe a senha administrativa para visualizar o painel.</p>
        </div>
      </div>
    </>
  );
};

export default AdminProtectedLayout;
