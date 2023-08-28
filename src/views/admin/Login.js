import {
  CButton,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CRow
} from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from 'src/services/admin';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submitLogin = () => {
    adminLogin({
      email,
      password
    })
      .then((res) => {
        const data = res.data;

        if (data.code == 200) {
          localStorage.setItem('admin_token', data.token);
          window.location.href = '/admin/main-data';
        }
      })
      .catch(() => {});
  };

  const checkToken = async () => {
    const adminToken = await localStorage.getItem('admin_token');
    if (adminToken) {
      navigate('/admin/main-data');
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <CContainer className="">
      <CCol className="d-flex align-items-center justify-content-center min-vh-100">
        <CForm onSubmit={submitLogin} className="col-4">
          <h4>Admin Login</h4>
          <div>
            <CFormLabel className="col-form-label">Email</CFormLabel>
            <br />
            <CFormInput
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  submitLogin();
                }
              }}
            />
          </div>
          <div>
            <CFormLabel className="col-form-label">Password</CFormLabel>
            <br />
            <CFormInput
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  submitLogin();
                }
              }}
            />
          </div>
          <div>
            <CButton
              className="primary-bg-color primary-font-color full-width mt-3"
              onClick={() => {
                submitLogin();
              }}
            >
              Login
            </CButton>
          </div>
        </CForm>
      </CCol>
    </CContainer>
  );
}
