import {
  CButton,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
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

import { useLocation, useSearchParams } from 'react-router-dom';
import {
  createAccountType,
  deleteAccountType,
  getAccountTypeList,
  updateAccountType
} from 'src/services/accountType';
import * as yup from 'yup';
import queryString from 'query-string';
import Pagination from 'src/shared/components/Pagination';

export default function AccountType() {
  const [AccountTypeList, setAccountTypeList] = useState([]);
  const [AccountTypeDetail, setAccountTypeDetail] = useState();
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setShowModalTitle] = useState('');
  const [modalActionType, setModalActionType] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [errorForm, setErrorForm] = useState({});
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const { search } = useLocation();
  const [, setQuery] = useSearchParams('');

  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    category: yup.string().required('Category is required')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      category: ''
    },
    validationSchema: schema,
    onSubmit: () => {
      if (modalActionType === 'create') {
        addAccountType();
      } else if (modalActionType === 'detail') {
        editAccountType();
      }
    }
  });

  const formValidation = () => {
    if (Object.keys(formik.errors).length > 0 && formik.isSubmitting) {
      setErrorForm(formik.errors);
    }
  };

  useEffect(() => {
    const parseQuery = queryString.parse(search);
    if (parseQuery.name) {
      setNameFilter(parseQuery.name);
      setQuery(queryString.stringify(parseQuery));
    } else {
      delete parseQuery.name;
      setQuery(queryString.stringify(parseQuery));
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
  }, [search]);

  useEffect(() => {
    formValidation();
  }, [formik]);

  const closeModal = () => {
    setShowModalTitle('');
    setModalActionType('');
    setAccountTypeDetail('');
    setShowModal(false);
    formik.setErrors({});
    formik.setValues({ name: '', category: '' });
  };

  const fetchAccountTypeList = () => {
    const parseQuery = queryString.parse(search);
    getAccountTypeList(parseQuery).then((res) => {
      setAccountTypeList(res.data.result);
      setTotalCount(res.data.count);
    });
  };

  useEffect(() => {
    fetchAccountTypeList();
  }, [search]);

  useEffect(() => {
    if (AccountTypeDetail) {
      setShowModal(true);
    }
  }, [AccountTypeDetail]);

  const ModalAccountTypeDelete = () => {
    return <h4>Are you sure?</h4>;
  };

  const removeAccountType = () => {
    deleteAccountType(AccountTypeDetail.id).then((res) => {
      closeModal();
      fetchAccountTypeList();
    });
  };

  const addAccountType = () => {
    createAccountType({
      name: formik.values.name,
      category: formik.values.category
    }).then(() => {
      closeModal();
      fetchAccountTypeList();
      formik.setValues({ name: '', category: '' });
    });
  };

  const editAccountType = () => {
    updateAccountType(AccountTypeDetail.id, {
      name: formik.values.name,
      category: formik.values.category
    }).then(() => {
      closeModal();
      fetchAccountTypeList();
      formik.setValues({ name: '', category: '' });
    });
  };

  const filterHandle = () => {
    const parseQuery = queryString.parse(search);
    parseQuery.name = nameFilter;
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
                    placeholder="BCA"
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
            setShowModalTitle('Add Account Type');
            setModalActionType('create');
          }}
          className="mb-3"
        >
          Add Account Type
        </CButton>
        {AccountTypeList && (
          <>
            <CTable responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">No.</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Aksi</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {AccountTypeList.map((el, i) => (
                  <CTableRow key={i}>
                    <CTableDataCell align="middle">{i + 1}</CTableDataCell>
                    <CTableDataCell align="middle">{el.name}</CTableDataCell>
                    <CTableDataCell className="text-capitalize" align="middle">
                      {el.category}
                    </CTableDataCell>
                    <CTableDataCell align="middle">
                      <CButton
                        size="sm"
                        color="info"
                        onClick={() => {
                          setAccountTypeDetail(el);
                          setModalActionType('detail');
                          setShowModalTitle('Detail');
                          formik.setValues({
                            name: el.name,
                            category: el.category
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
                          setAccountTypeDetail(el);
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
            {modalActionType === 'delete' && <ModalAccountTypeDelete />}
            {modalActionType === 'detail' && (
              <>
                <CForm className="row">
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
                        Category
                      </CFormLabel>
                      <CCol>
                        <CFormSelect
                          value={formik.values.category}
                          onChange={(e) => {
                            if (e.target.value != 0) {
                              formik.setFieldValue('category', e.target.value);
                            } else {
                              formik.setFieldValue('category', '');
                            }
                          }}
                        >
                          <option value="0">-- Select Category --</option>
                          <option value="rekening">Rekening</option>
                          <option value="e-wallet">E-Wallet</option>
                        </CFormSelect>
                        <div className="text-danger text-sm">
                          {errorForm.category}
                        </div>
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
                          placeholder="BCA"
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
                  </CRow>
                  <CRow>
                    <CRow className="mb-3">
                      <CFormLabel className="col-sm-2 col-form-label">
                        Category
                      </CFormLabel>
                      <CCol>
                        <CFormSelect
                          value={formik.values.category}
                          onChange={(e) => {
                            if (e.target.value != 0) {
                              formik.setFieldValue('category', e.target.value);
                            } else {
                              formik.setFieldValue('category', '');
                            }
                          }}
                        >
                          <option value="0">-- Select Category --</option>
                          <option value="rekening">Rekening</option>
                          <option value="e-wallet">E-Wallet</option>
                        </CFormSelect>
                        <div className="text-danger text-sm">
                          {errorForm.category}
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
                closeModal();
              }}
            >
              Cancel
            </CButton>
            {modalActionType === 'delete' && (
              <CButton
                color="danger text-white"
                onClick={() => {
                  removeAccountType();
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
