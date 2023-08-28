import React from 'react';

// Admin
const AdminLogin = React.lazy(() => import('./views/admin/Login'));
const AdminDownlineMenu = React.lazy(() => import('./views/admin/Downline'));
const AdminMainDataMenu = React.lazy(() => import('./views/admin/MainData'));
const AdminClientMenu = React.lazy(() => import('./views/admin/Client'));
const AdminAccountTypeMenu = React.lazy(() =>
  import('./views/admin/AccountType')
);
const AdminDashboardMenu = React.lazy(() => import('./views/admin/Dashboard'));

// Client
const ClientMainDataMenu = React.lazy(() => import('./views/client/MainData'));

const routes = [
  {
    path: '/main-data',
    name: 'Admin Main Data Menu',
    element: AdminMainDataMenu
  },
  {
    path: '/downline',
    name: 'Admin Downline Menu',
    element: AdminDownlineMenu
  },
  {
    path: '/client',
    name: 'Admin Client Menu',
    element: AdminClientMenu
  },
  {
    path: '/account-type',
    name: 'Admin Account Type Menu',
    element: AdminAccountTypeMenu
  },
  {
    path: '/dashboard',
    name: 'Admin Dashboard Menu',
    element: AdminDashboardMenu
  },
  {
    path: '/client/main-data',
    name: 'Client Main Data Menu',
    element: ClientMainDataMenu
  }
];

export default routes;
