import React from 'react';

const ClientMainDataMenu = React.lazy(() => import('./views/client/MainData'));

const clientRoutes = [
  {
    path: '/main-data',
    name: 'Client Main Data Menu',
    element: ClientMainDataMenu,
  },
];

export default clientRoutes;
