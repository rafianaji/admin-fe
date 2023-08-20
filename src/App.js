import React, { Component, Suspense } from 'react';
import { HashRouter, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './scss/style.scss';
import { Toaster } from 'react-hot-toast';
import AdminLayout from './layout/AdminLayout';
import ClientLayout from './layout/ClientLayout';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));
const FormDownline = React.lazy(() => import('./views/form/Form'));
const ClientLogin = React.lazy(() => import('./views/client/Login'));
const AdminLogin = React.lazy(() => import('./views/admin/Login'));

class App extends Component {
  render() {
    return (
      <Router>
        <Suspense fallback={loading}>
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="/register" name="Register Page" element={<Register />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            <Route exact path="/form" name="Form" element={<FormDownline />} />
            <Route exact path="/client/login" name="Form" element={<ClientLogin />} />
            <Route exact path="/admin/login" name="Form" element={<AdminLogin />} />
            <Route path="/admin/*" name="Home" element={<AdminLayout />} />
            <Route path="/client/*" name="Home" element={<ClientLayout />} />
          </Routes>
        </Suspense>
        <Toaster position="top-right" reverseOrder={false} />
        <div id="loader-spinner" className="backdrop-container">
          <div className="loader-spinner"></div>
          <div className="backdrop-bg" />
        </div>
      </Router>
    );
  }
}

export default App;
