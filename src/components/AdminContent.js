import { CContainer, CSpinner } from '@coreui/react';
import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import routes from 'src/routes';

export default function AdminContent() {
  return (
    <>
      <CContainer fluid className="px-4">
        <Suspense>
          <Routes>
            {routes.map((route, idx) => {
              return route.element && <Route key={idx} path={route.path} exact={route.exact} name={route.name} element={<route.element />} />;
            })}
            <Route path="/*" element={<Navigate to="/admin/login" replace />} />
          </Routes>
        </Suspense>
      </CContainer>
    </>
  );
}
