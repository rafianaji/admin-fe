import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CRow
} from '@coreui/react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { changePassword } from 'src/services/admin';

export default function ForgotPassword() {
  const [errorForm, setErrorForm] = useState({});
  const navigate = useNavigate();

  const schema = yup.object().shape({
    email: yup.string().email().required('Email is required'),
    password: yup.string().required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: schema,
    onSubmit: () => {
      changePassword({
        email: formik.values.email,
        password: formik.values.password
      }).then(() => {
        navigate('/admin/login');
      });
    }
  });

  const formValidation = () => {
    setErrorForm(formik.errors);
  };

  useEffect(() => {
    formValidation();
  }, [formik]);

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Forgot Password</h1>
                    <br />
                    <CInputGroup className="mb-1">
                      <CFormInput
                        placeholder="Email"
                        value={formik.values.email}
                        onChange={(e) => {
                          formik.setFieldValue('email', e.target.value);
                        }}
                      />
                    </CInputGroup>
                    <div className="text-danger text-sm">{errorForm.email}</div>
                    <br />
                    <CInputGroup className="mb-1">
                      <CFormInput
                        type="password"
                        placeholder="New Password"
                        value={formik.values.password}
                        onChange={(e) => {
                          formik.setFieldValue('password', e.target.value);
                        }}
                      />
                    </CInputGroup>
                    <div className="text-danger text-sm">
                      {errorForm.password}
                    </div>
                    <br />
                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          color="primary"
                          className="px-4"
                          onClick={formik.handleSubmit}
                        >
                          Submit
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
}
