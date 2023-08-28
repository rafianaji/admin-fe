import React, { useEffect } from 'react';
import { AppContent, AppHeader, AppSidebar } from 'src/components';
import AdminContent from 'src/components/AdminContent';
import AdminSidebar from 'src/components/AdminSidebar';

export default function AdminLayout() {
  const checkToken = async () => {
    const adminToken = await localStorage.getItem('admin_token');
    if (!adminToken) {
      window.location.href = '/admin/login';
    }
  };

  useEffect(() => {
    checkToken();
  }, []);
  return (
    <>
      <div>
        <AdminSidebar />
        <div className="wrapper d-flex flex-column min-vh-100">
          <AppHeader />
          <div className="body flex-grow-1">
            <AdminContent />
          </div>
        </div>
      </div>
    </>
  );
}
