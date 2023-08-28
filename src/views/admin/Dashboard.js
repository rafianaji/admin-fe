import {
  CButton,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow
} from '@coreui/react';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { createAdmin } from 'src/services/admin';
import {
  getTotalClient,
  getTotalDownline,
  getTotalForm,
  getTotalFormPending,
  getTotalFormSettlement
} from 'src/services/dashboard';
import * as yup from 'yup';

export default function Dashboard() {
  const [totalDownline, setTotalDownline] = useState(0);
  const [totalForm, setTotalForm] = useState(0);
  const [totalFormPending, setTotalFormPending] = useState(0);
  const [totalFormSettlement, setTotalFormSettlement] = useState(0);
  const [totalClient, setTotalClient] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalAction, setModalAction] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [errorForm, setErrorForm] = useState({});

  const schema = yup.object().shape({
    email: yup.string().email().required('Email is required'),
    password: yup.string().required('Password is required'),
    phone: yup
      .string()
      .min(8, 'Phone number must be valid and contain 8 - 13 digits')
      .max(13, 'Phone number must be valid and contain 8 - 13 digits')
      .required('Phone number required')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      phone: ''
    },
    validationSchema: schema,
    onSubmit: () => {
      addAdmin();
    }
  });

  useEffect(() => {
    fetchTotalDownline();
    fetchTotalForm();
    fetchTotalFormPending();
    fetchTotalFormSettlement();
    fetchTotalClient();
  }, []);

  const fetchTotalDownline = () => {
    getTotalDownline().then((res) => {
      setTotalDownline(res.data.total);
    });
  };

  const fetchTotalFormPending = () => {
    getTotalFormPending().then((res) => {
      setTotalFormPending(res.data.total);
    });
  };

  const fetchTotalFormSettlement = () => {
    getTotalFormSettlement().then((res) => {
      setTotalFormSettlement(res.data.total);
    });
  };

  const fetchTotalClient = () => {
    getTotalClient().then((res) => {
      setTotalClient(res.data.total);
    });
  };

  const fetchTotalForm = () => {
    getTotalForm().then((res) => {
      setTotalForm(res.data.total);
    });
  };

  const closeModal = () => {
    setModalTitle('');
    setModalAction('');
    setShowModal(false);
    formik.setErrors({});
  };

  const formValidation = () => {
    setErrorForm(formik.errors);
  };

  useEffect(() => {
    formValidation();
  }, [formik]);

  const addAdmin = () => {
    createAdmin({
      email: formik.values.email,
      password: formik.values.password,
      phone: formik.values.phone
    }).then((res) => {
      closeModal();
    });
  };

  return (
    <>
      <CContainer fluid className="mb-4 d-flex flex-wrap">
        <div className="pt-4 pb-3 px-4 d-flex flex-column justify-content-center width-dashboard mb-3 mx-1 dashboard-blue">
          <div className="mb-1">Total Downline</div>
          <div className="h2 mt-1">{totalDownline}</div>
        </div>
        <div className="pt-4 pb-3 px-4 d-flex flex-column justify-content-center width-dashboard mb-3 mx-1 dashboard-purple">
          <div className="mb-1">Total Form </div>
          <div className="h2 mt-1">{totalForm}</div>
        </div>
        <div className="pt-4 pb-3 px-4 d-flex flex-column justify-content-center width-dashboard mb-3 mx-1 dashboard-orange">
          <div className="mb-1">Total Form Pending</div>
          <div className="h2 mt-1">{totalFormPending}</div>
        </div>
        <div className="pt-4 pb-3 px-4 d-flex flex-column justify-content-center width-dashboard mb-3 mx-1 dashboard-green">
          <div className="mb-1">Total Form Settlement</div>
          <div className="h2 mt-1">{totalFormSettlement}</div>
        </div>
        <div className="pt-4 pb-3 px-4 d-flex flex-column justify-content-center width-dashboard mb-3 mx-1 dashboard-grey">
          <div className="mb-1">Total Client</div>
          <div className="h2 mt-1">{totalClient}</div>
        </div>
        <div
          className="pt-4 pb-3 px-4 d-flex flex-column justify-content-center width-dashboard mb-3 mx-1 cursor-pointer"
          onClick={() => {
            setShowModal(true);
            setModalTitle('Add Admin');
            setModalAction('admin');
          }}
        >
          <h4 className="text-info text-center">+ Add Admin</h4>
        </div>
      </CContainer>
      <CModal
        backdrop="static"
        size="lg"
        visible={showModal}
        onClose={() => {
          closeModal();
        }}
      >
        <CModalHeader>
          <CModalTitle>{modalTitle}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <>
            <CForm className="row" onSubmit={formik.handleSubmit}>
              <CRow>
                <CRow className="mb-3">
                  <CFormLabel className="col-sm-2 col-form-label">
                    Email
                  </CFormLabel>
                  <CCol>
                    <CFormInput
                      placeholder="johndoe@mail.com"
                      type="email"
                      value={formik.values.email}
                      onChange={(e) => {
                        formik.setFieldValue('email', e.target.value);
                      }}
                    />
                    <div className="text-danger text-sm">{errorForm.email}</div>
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CFormLabel className="col-sm-2 col-form-label">
                    Phone
                  </CFormLabel>
                  <CCol>
                    <CInputGroup>
                      {/* <CInputGroupText className="secondary">
                            62
                          </CInputGroupText> */}
                      <CFormInput
                        placeholder="62856999888"
                        type="number"
                        value={formik.values.phone}
                        onChange={(e) => {
                          formik.setFieldValue('phone', e.target.value);
                        }}
                      />
                    </CInputGroup>
                    <div className="text-danger text-sm">{errorForm.phone}</div>
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CFormLabel className="col-sm-2 col-form-label">
                    Password
                  </CFormLabel>
                  <CCol>
                    <CInputGroup className="mb-3">
                      <CFormInput
                        value={formik.values.password}
                        type={showPassword ? 'text' : 'password'}
                        onChange={(e) => {
                          formik.setFieldValue('password', e.target.value);
                        }}
                      />
                      <CButton
                        type="button"
                        color="info"
                        variant="outline"
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </CButton>
                    </CInputGroup>
                    <div className="text-danger text-sm">
                      {errorForm.password}
                    </div>
                  </CCol>
                </CRow>
              </CRow>
            </CForm>
          </>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary text-white"
            onClick={() => {
              closeModal();
            }}
          >
            Cancel
          </CButton>
          <CButton
            color="info text-white"
            onClick={() => {
              formik.handleSubmit();
            }}
          >
            Add
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
}
