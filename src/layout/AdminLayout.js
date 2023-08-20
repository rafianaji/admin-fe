import React from 'react';
import { AppContent, AppHeader, AppSidebar } from 'src/components';
import AdminContent from 'src/components/AdminContent';
import AdminSidebar from 'src/components/AdminSidebar';

export default function AdminLayout() {
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
