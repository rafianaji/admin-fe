import {
  CButton,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from '@coreui/react';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLocation, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import queryString from 'query-string';
import {
  createClient,
  deleteClient,
  getClientList,
  updateClient
} from 'src/services/client';
import { ChromePicker } from 'react-color';
import Pagination from 'src/shared/components/Pagination';

export default function Client() {
  const [clientList, setClientList] = useState([]);
  const [clientDetail, setClientDetail] = useState();
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setShowModalTitle] = useState('');
  const [modalActionType, setModalActionType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [color, setColor] = useState('#fff');
  const [errorForm, setErrorForm] = useState({});
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const { search } = useLocation();
  const [, setQuery] = useSearchParams('');

  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    phone: yup
      .string()
      .min(8, 'Phone number must be valid and contain 8 - 13 digits')
      .max(13, 'Phone number must be valid and contain 8 - 13 digits')
      .required('Phone number required'),
    email: yup.string().email().required('Email is required'),
    password: yup.string().required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      email: '',
      password: '',
      plain_password: ''
    },
    validationSchema: schema,
    onSubmit: () => {
      if (modalActionType === 'create') {
        addClient();
      } else if (modalActionType === 'detail') {
        editClient();
      }
    }
  });

  const formValidation = () => {
    setErrorForm(formik.errors);
  };

  useEffect(() => {
    const parseQuery = queryString.parse(search);
    if (parseQuery.name) {
      setNameFilter(parseQuery.name);
    } else {
      delete parseQuery.name;
    }
    if (parseQuery.phone) {
      setPhoneFilter(parseQuery.phone);
    } else {
      delete parseQuery.phone;
    }
    if (parseQuery.email) {
      setEmailFilter(parseQuery.email);
    } else {
      delete parseQuery.email;
    }
    if (parseQuery.page) {
      setPage(Number(parseQuery.page));
    }
    if (parseQuery.count) {
      setCount(parseQuery.count);
    }
    if (!parseQuery.page || !parseQuery.count || parseQuery.page === '0') {
      parseQuery.page = 1;
      parseQuery.count = 20;
      setQuery(queryString.stringify(parseQuery));
    }
    setQuery(queryString.stringify(parseQuery));
  }, [search]);

  useEffect(() => {
    formValidation();
  }, [formik]);

  const closeModal = () => {
    setShowModalTitle('');
    setModalActionType('');
    setClientDetail('');
    setShowModal(false);
    formik.setErrors({});
  };

  const fetchClientList = () => {
    getClientList(search).then((res) => {
      setClientList(res.data.result);
      setTotalCount(res.data.count);
    });
  };

  useEffect(() => {
    fetchClientList();
  }, [search]);

  useEffect(() => {
    if (clientDetail) {
      setShowModal(true);
    }
  }, [clientDetail]);

  const ModalClientDelete = () => {
    return <h4>Are you sure?</h4>;
  };

  const removeClient = () => {
    deleteClient(clientDetail.id).then((res) => {
      closeModal();
      fetchClientList();
    });
  };

  const addClient = () => {
    let isError = false;
    const body = {
      name: formik.values.name,
      email: formik.values.email,
      password: formik.values.password,
      color,
      phone: formik.values.phone,
      plain_password: formik.values.password
    };
    // let phoneTemp = formik.values.phone;
    // if (phoneTemp[0] == 0) {
    //   body.phone = '62' + phoneTemp.slice(1, phoneTemp.length);
    // } else if (phoneTemp[0] == 8) {
    //   body.phone = '62' + phoneTemp;
    // } else {
    //   isError = true;
    //   toast.error('Invalid phone number format');
    // }

    if (!isError) {
      createClient(body).then(() => {
        closeModal();
        fetchClientList();
        setColor('');
        formik.setValues({ name: '', phone: '', email: '', password: '' });
      });
    }
  };

  const editClient = () => {
    let isError = false;
    const body = {
      name: formik.values.name,
      email: formik.values.email,
      password: formik.values.plain_password,
      color,
      phone: formik.values.phone
    };
    // let phoneTemp = formik.values.phone;
    // if (phoneTemp[0] == 0) {
    //   body.phone = '62' + phoneTemp.slice(1, phoneTemp.length);
    // } else if (phoneTemp[0] == 8) {
    //   body.phone = '62' + phoneTemp;
    // } else if (phoneTemp.slice(0, 2) == '62') {
    //   body.phone = phoneTemp;
    // } else {
    //   isError = true;
    //   toast.error('Invalid phone number format');
    // }

    if (!isError) {
      updateClient(clientDetail.id, body).then(() => {
        closeModal();
        fetchClientList();
        setColor('');
        formik.setValues({ name: '', phone: '', email: '', password: '' });
      });
    }
  };

  const filterHandle = () => {
    const parseQuery = queryString.parse(search);
    parseQuery.name = nameFilter;
    parseQuery.phone = phoneFilter;
    parseQuery.email = emailFilter;
    setQuery(queryString.stringify(parseQuery));
  };

  const setPreviousPagination = () => {
    const parseQuery = queryString.parse(search);
    parseQuery.page = Number(page) - 1;
    setQuery(queryString.stringify(parseQuery));
  };

  const setPagination = (page) => {
    const parseQuery = queryString.parse(search);
    parseQuery.page = Number(page);
    setQuery(queryString.stringify(parseQuery));
  };

  const setNextPagination = () => {
    const parseQuery = queryString.parse(search);
    parseQuery.page = Number(page) + 1;
    setQuery(queryString.stringify(parseQuery));
  };

  return (
    <>
      <CContainer fluid className="mb-4">
        <CForm className="row">
          <CRow className="mb-3">
            <CCol>
              <CRow>
                <CFormLabel className="col-sm-3 col-form-label">
                  Name
                </CFormLabel>
                <CCol>
                  <CFormInput
                    type="text"
                    placeholder="John"
                    value={nameFilter}
                    onBlur={filterHandle}
                    onChange={(e) => {
                      setNameFilter(e.target.value);
                    }}
                  />
                </CCol>
              </CRow>
            </CCol>
            <CCol>
              <CRow>
                <CFormLabel className="col-sm-3 col-form-label">
                  Email
                </CFormLabel>
                <CCol>
                  <CFormInput
                    type="email"
                    placeholder="john@mail.com"
                    value={emailFilter}
                    onChange={(e) => {
                      setEmailFilter(e.target.value);
                    }}
                    onBlur={filterHandle}
                  />
                </CCol>
              </CRow>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol>
              <CRow>
                <CFormLabel className="col-sm-3 col-form-label">
                  Phone
                </CFormLabel>
                <CCol>
                  <CInputGroup>
                    {/* <CInputGroupText className="secondary">62</CInputGroupText> */}
                    <CFormInput
                      type="number"
                      placeholder="62856999888"
                      value={phoneFilter}
                      onChange={(e) => {
                        setPhoneFilter(e.target.value);
                      }}
                      onBlur={filterHandle}
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
            </CCol>
            <CCol>
              <CButton
                className="col-sm-12"
                color="info"
                onClick={filterHandle}
              >
                Cari
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </CContainer>
      <CContainer fluid>
        <CButton
          color="info"
          onClick={() => {
            setShowModal(true);
            setShowModalTitle('Add Client');
            setModalActionType('create');
            formik.setErrors({});
            formik.setTouched({}, false);
            formik.setValues({
              name: '',
              phone: '',
              email: '',
              password: ''
            });
          }}
          className="mb-3"
        >
          Add Client
        </CButton>
        {clientList && (
          <>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">No.</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Phone</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Aksi</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {clientList.map((el, i) => (
                  <CTableRow key={i}>
                    <CTableDataCell align="middle">{i + 1}</CTableDataCell>
                    <CTableDataCell align="middle">{el.name}</CTableDataCell>
                    <CTableDataCell align="middle">{el.phone}</CTableDataCell>
                    <CTableDataCell align="middle">{el.email}</CTableDataCell>
                    <CTableDataCell align="middle">
                      <CButton
                        size="sm"
                        color="info"
                        onClick={() => {
                          setClientDetail(el);
                          setColor(el.color);
                          setModalActionType('detail');
                          setShowModalTitle('Detail');
                          formik.setErrors({});
                          formik.setValues({
                            name: el.name,
                            phone: el.phone.slice(2, el.phone.length),
                            email: el.email,
                            color: el.color,
                            password: 'aaa'
                          });
                        }}
                      >
                        Detail & Update
                      </CButton>
                      <CButton
                        size="sm"
                        color="danger"
                        className="ms-2 text-white"
                        onClick={() => {
                          setClientDetail(el);
                          setModalActionType('delete');
                          setShowModalTitle('Delete');
                        }}
                      >
                        Delete
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <span>Result: {totalCount}</span>
            <Pagination
              setNextPagination={setNextPagination}
              totalCount={totalCount}
              count={count}
              page={page}
              setPreviousPagination={setPreviousPagination}
              setPagination={(e) => {
                setPagination(e);
              }}
            />
          </>
        )}
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
            {modalActionType === 'delete' && <ModalClientDelete />}
            {modalActionType === 'detail' && (
              <>
                <CForm className="row" onSubmit={formik.handleSubmit}>
                  <CRow>
                    <CRow className="mb-3">
                      <CFormLabel className="col-sm-2 col-form-label">
                        Name
                      </CFormLabel>
                      <CCol>
                        <CFormInput
                          value={formik.values.name}
                          onChange={(e) => {
                            formik.setFieldValue('name', e.target.value);
                          }}
                        />
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
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CFormLabel className="col-sm-2 col-form-label">
                        Password
                      </CFormLabel>
                      <CCol>
                        <CInputGroup className="mb-3">
                          <CFormInput
                            value={formik.values.plain_password}
                            type={showPassword ? 'text' : 'password'}
                            onChange={(e) => {
                              formik.setFieldValue(
                                'plain_password',
                                e.target.value
                              );
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
                    <CRow className="mb-3">
                      <CFormLabel className="col-sm-2 col-form-label">
                        Email
                      </CFormLabel>
                      <CCol>
                        <CFormInput
                          value={formik.values.email}
                          onChange={(e) => {
                            formik.setFieldValue('email', e.target.value);
                          }}
                        />
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CFormLabel className="col-sm-2 col-form-label">
                        Color
                      </CFormLabel>
                      <CCol>
                        <ChromePicker
                          color={color}
                          onChange={(color) => {
                            setColor(color.hex);
                          }}
                        />
                      </CCol>
                    </CRow>
                  </CRow>
                </CForm>
              </>
            )}
            {modalActionType === 'create' && (
              <>
                <CForm className="row" onSubmit={formik.handleSubmit}>
                  <CRow>
                    <CRow className="mb-3">
                      <CFormLabel className="col-sm-2 col-form-label">
                        Name
                      </CFormLabel>
                      <CCol>
                        <CFormInput
                          key="name"
                          type="text"
                          placeholder="John Doe"
                          value={formik.values.name}
                          onChange={(e) => {
                            formik.setFieldValue('name', e.target.value);
                          }}
                        />
                        <div className="text-danger text-sm">
                          {errorForm.name}
                        </div>
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
                            required
                            value={formik.values.phone}
                            onChange={(e) => {
                              formik.setFieldValue('phone', e.target.value);
                            }}
                          />
                        </CInputGroup>
                        <div className="text-danger text-sm">
                          {errorForm.phone}
                        </div>
                      </CCol>
                    </CRow>
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
                        <div className="text-danger text-sm">
                          {errorForm.email}
                        </div>
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
                    <CRow className="mb-3">
                      <CFormLabel className="col-sm-2 col-form-label">
                        Color
                      </CFormLabel>
                      <CCol>
                        <ChromePicker
                          color={color}
                          onChange={(color) => {
                            setColor(color.hex);
                          }}
                        />
                      </CCol>
                    </CRow>
                  </CRow>
                </CForm>
              </>
            )}
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
            {modalActionType === 'delete' && (
              <CButton
                color="danger text-white"
                onClick={() => {
                  removeClient();
                }}
              >
                Delete
              </CButton>
            )}
            {modalActionType === 'create' && (
              <CButton
                color="info text-white"
                onClick={() => {
                  formik.handleSubmit();
                }}
              >
                Add
              </CButton>
            )}
            {modalActionType === 'detail' && (
              <CButton
                color="info text-white"
                onClick={() => {
                  formik.handleSubmit();
                }}
              >
                Save
              </CButton>
            )}
          </CModalFooter>
        </CModal>
      </CContainer>
    </>
  );
}
