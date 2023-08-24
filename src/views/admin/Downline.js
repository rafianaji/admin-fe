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
import CopyToClipboard from 'react-copy-to-clipboard';
import { toast } from 'react-hot-toast';
import { useLocation, useSearchParams } from 'react-router-dom';
import {
  createDownline,
  deleteDownline,
  getDownlineList,
  updateDownline
} from 'src/services/downline';
import * as yup from 'yup';
import queryString from 'query-string';
import Pagination from 'src/shared/components/Pagination';
import { BASE_URL } from 'src/shared/config/config';

export default function Downline() {
  const [downlineList, setDownlineList] = useState([]);
  const [downlineDetail, setDownlineDetail] = useState();
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setShowModalTitle] = useState('');
  const [modalActionType, setModalActionType] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
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
    email: yup.string().email().required('Email is required')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      email: ''
    },
    validationSchema: schema,
    onSubmit: () => {
      if (modalActionType === 'create') {
        addDownline();
      } else if (modalActionType === 'detail') {
        editDownline();
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

  const fetchDownlineList = () => {
    getDownlineList(search).then((res) => {
      setDownlineList(res.data.result);
      setTotalCount(res.data.count);
    });
  };

  useEffect(() => {
    fetchDownlineList();
  }, [search]);

  useEffect(() => {
    if (downlineDetail) {
      setShowModal(true);
    }
  }, [downlineDetail]);

  const ModalDownlineDelete = () => {
    return <h4>Are you sure?</h4>;
  };

  const removeDownline = () => {
    deleteDownline(downlineDetail.id).then((res) => {
      onCloseModalHandle();
      fetchDownlineList();
    });
  };

  const addDownline = () => {
    let isError = false;
    const body = {
      name: formik.values.name,
      email: formik.values.email,
      phone: formik.values.phone
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
      createDownline(body).then(() => {
        onCloseModalHandle();
        fetchDownlineList();
        formik.values.name = '';
        formik.values.phone = '';
        formik.values.email = '';
      });
    }
  };

  const editDownline = () => {
    let isError = false;
    const body = {
      name: formik.values.name,
      email: formik.values.email,
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
      updateDownline(downlineDetail.id, body).then(() => {
        onCloseModalHandle();
        fetchDownlineList();
        formik.values.name = '';
        formik.values.phone = '';
        formik.values.email = '';
      });
    }
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

  const filterHandle = () => {
    const parseQuery = queryString.parse(search);
    parseQuery.name = nameFilter;
    parseQuery.phone = phoneFilter;
    parseQuery.email = emailFilter;
    setQuery(queryString.stringify(parseQuery));
  };

  const onCloseModalHandle = () => {
    setShowModalTitle('');
    setModalActionType('');
    setDownlineDetail('');
    setShowModal(false);
    formik.setErrors({});
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
            setShowModalTitle('Add Downline');
            setModalActionType('create');
            formik.setErrors({});
            formik.setValues({
              name: '',
              phone: '',
              email: ''
            });
          }}
          className="mb-3"
        >
          Add Downline
        </CButton>
        {downlineList && (
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
                {downlineList.map((el, i) => (
                  <CTableRow key={i}>
                    <CTableDataCell align="middle">{i + 1}</CTableDataCell>
                    <CTableDataCell align="middle">{el.name}</CTableDataCell>
                    <CTableDataCell align="middle">{el.phone}</CTableDataCell>
                    <CTableDataCell align="middle">{el.email}</CTableDataCell>
                    <CTableDataCell align="middle">
                      <CopyToClipboard
                        text={`${BASE_URL}?downline_code=${el.code}`}
                        onCopy={() => {
                          {
                            toast.success('Copied');
                          }
                        }}
                      >
                        <CButton
                          size="sm"
                          color="info"
                          className="ms-2"
                          onClick={() => {}}
                        >
                          Copy Link
                        </CButton>
                      </CopyToClipboard>
                      <CButton
                        size="sm"
                        color="success"
                        className="ms-2"
                        onClick={() => {
                          window.location.href = `https://wa.me/${el.phone}?text=Ini URL kamu, silahkan klik atau copy dan paste ${BASE_URL}?downline_code=${el.code}`;
                        }}
                      >
                        Chat WA
                      </CButton>
                      <CButton
                        size="sm"
                        color="info"
                        className="ms-2"
                        onClick={() => {
                          setDownlineDetail(el);
                          setModalActionType('detail');
                          setShowModalTitle('Detail');
                          formik.setErrors({});
                          formik.setValues({
                            name: el.name,
                            phone: el.phone.slice(2, el.phone.length),
                            email: el.email
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
                          setDownlineDetail(el);
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
            onCloseModalHandle();
          }}
        >
          <CModalHeader>
            <CModalTitle>{modalTitle}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {modalActionType === 'delete' && <ModalDownlineDelete />}
            {modalActionType === 'detail' && (
              <>
                <CForm className="row">
                  <CRow>
                    <CCol>
                      <CRow>
                        <CFormLabel className="col-sm-2 col-form-label">
                          Code
                        </CFormLabel>
                        <CCol>
                          <CInputGroup className="mb-3">
                            <CFormInput disabled value={downlineDetail.code} />
                            <CopyToClipboard
                              text={downlineDetail.code}
                              onCopy={() => {
                                {
                                  toast.success('Copied');
                                }
                              }}
                            >
                              <CButton
                                type="button"
                                color="info"
                                variant="outline"
                              >
                                Copy
                              </CButton>
                            </CopyToClipboard>
                          </CInputGroup>
                        </CCol>
                      </CRow>
                    </CCol>
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
                  </CRow>
                </CForm>
              </>
            )}
            {modalActionType === 'create' && (
              <>
                <CForm
                  className="row"
                  onSubmit={() => {
                    formik.handleSubmit();
                  }}
                >
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
                            placeholder="856999888"
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
                  </CRow>
                </CForm>
              </>
            )}
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary text-white"
              onClick={() => {
                onCloseModalHandle();
              }}
            >
              Cancel
            </CButton>
            {modalActionType === 'delete' && (
              <CButton
                color="danger text-white"
                onClick={() => {
                  removeDownline();
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
