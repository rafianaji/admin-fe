import { CNavItem } from '@coreui/react';

const clientNav = [
  // {
  //   component: CNavItem,
  //   name: 'Main Data',
  //   to: '/client/main-data',
  // },
  {
    component: CNavItem,
    name: 'Main Data',
    to: '/client/main-data',
    items: [
      {
        component: CNavItem,
        name: 'Main Data',
        to: '/client/main-data'
      },
      {
        component: CNavItem,
        name: 'E-Wallet',
        to: '/client/main-data?category=e-wallet'
      },
      {
        component: CNavItem,
        name: 'Rekening',
        to: '/client/main-data?category=rekening'
      }
    ]
  }
];

export default clientNav;
