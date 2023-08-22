import React, { Component, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

// Pages
const FormDownline = React.lazy(() => import('./views/form/Form'));
const ClientLogin = React.lazy(() => import('./views/client/Login'));
const AdminLogin = React.lazy(() => import('./views/admin/Login'));

class App extends Component {
  render() {
    return (
      <Router>
        <Suspense fallback={loading}>
          <Routes>
            <Route exact path="/" name="Form" element={<FormDownline />} />
            <Route
              exact
              path="/client/login"
              name="Form"
              element={<ClientLogin />}
            />
            <Route
              exact
              path="/admin/login"
              name="Form"
              element={<AdminLogin />}
            />
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
