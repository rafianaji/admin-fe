import React from 'react';
import { AppContent, AppHeader, AppSidebar } from 'src/components';
import AdminContent from 'src/components/AdminContent';
import ClientContent from 'src/components/ClientContent';
import ClientSidebar from 'src/components/ClientSidebar';

export default function ClientLayout() {
  return (
    <>
      <div>
        <ClientSidebar />
        <div className="wrapper d-flex flex-column min-vh-100">
          <AppHeader />
          <div className="body flex-grow-1">
            <ClientContent />
          </div>
        </div>
      </div>
    </>
  );
}
