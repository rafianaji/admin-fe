import { CButton, CCol, CContainer, CForm, CFormInput, CFormLabel, CRow } from '@coreui/react';
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
      password,
    }).then((res) => {
      const data = res.data;

      if (data.code == 200) {
        localStorage.setItem('admin_token', data.token);
        window.location.href = '/admin/main-data';
      }
    });
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
        <CForm>
          <h4>Admin Login</h4>
          <div>
            <CFormLabel className="col-sm-2 col-form-label">Email</CFormLabel>
            <br />
            <CFormInput
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div>
            <CFormLabel className="col-sm-2 col-form-label">Password</CFormLabel>
            <br />
            <CFormInput
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
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
