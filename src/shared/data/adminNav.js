import { CNavItem } from '@coreui/react';

const adminNav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/admin/dashboard'
  },
  {
    component: CNavItem,
    name: 'Main Data',
    to: '/admin/main-data',
    items: [
      {
        component: CNavItem,
        name: 'Main Data',
        to: '/admin/main-data'
      },
      {
        component: CNavItem,
        name: 'E-Wallet',
        to: '/admin/main-data?category=e-wallet'
      },
      {
        component: CNavItem,
        name: 'Rekening',
        to: '/admin/main-data?category=rekening'
      }
    ]
  },
  {
    component: CNavItem,
    name: 'Master Downline',
    to: '/admin/downline'
  },
  {
    component: CNavItem,
    name: 'Master Client',
    to: '/admin/client'
  },
  {
    component: CNavItem,
    name: 'Master Account Type',
    to: '/admin/account-type'
  }
  // {
  //   component: CNavGroup,
  //   name: 'Buttons',
  //   to: '/buttons',
  //   icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Buttons',
  //       to: '/buttons/buttons',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Buttons groups',
  //       to: '/buttons/button-groups',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Dropdowns',
  //       to: '/buttons/dropdowns',
  //     },
  //   ],
  // },
];

export default adminNav;
