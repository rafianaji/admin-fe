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
  CTableRow,
} from '@coreui/react';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';

import { useLocation, useSearchParams } from 'react-router-dom';
import { createAccountType, deleteAccountType, getAccountTypeList, updateAccountType } from 'src/services/accountType';
import * as yup from 'yup';
import queryString from 'query-string';

export default function AccountType() {
  const [AccountTypeList, setAccountTypeList] = useState([]);
  const [AccountTypeDetail, setAccountTypeDetail] = useState();
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setShowModalTitle] = useState('');
  const [modalActionType, setModalActionType] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [errorForm, setErrorForm] = useState({});
  const { search } = useLocation();
  const [, setQuery] = useSearchParams('');

  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    category: yup.string().required('Category is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      category: '',
    },
    validationSchema: schema,
    onSubmit: () => {
      if (modalActionType === 'create') {
        addAccountType();
      } else if (modalActionType === 'detail') {
        editAccountType();
      }
    },
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
    setQuery(queryString.stringify(parseQuery));
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
    getAccountTypeList(search).then((res) => {
      setAccountTypeList(res.data);
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
    createAccountType({ name: formik.values.name, category: formik.values.category }).then(() => {
      closeModal();
      fetchAccountTypeList();
      formik.setValues({ name: '', category: '' });
    });
  };

  const editAccountType = () => {
    updateAccountType(AccountTypeDetail.id, { name: formik.values.name, category: formik.values.category }).then(() => {
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

  return (
    <>
      <CContainer fluid className="mb-4">
        <CForm className="row">
          <CRow className="mb-3">
            <CCol>
              <CRow>
                <CFormLabel className="col-sm-3 col-form-label">Name</CFormLabel>
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
              <CButton className="col-sm-12" color="info" onClick={filterHandle}>
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
          <CTable>
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
                          category: el.category,
                        });
                      }}
                    >
                      Cek Detail
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
                      <CFormLabel className="col-sm-2 col-form-label">Name</CFormLabel>
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
                      <CFormLabel className="col-sm-2 col-form-label">Category</CFormLabel>
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
                        <div className="text-danger text-sm">{errorForm.category}</div>
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
                      <CFormLabel className="col-sm-2 col-form-label">Name</CFormLabel>
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
                        <div className="text-danger text-sm">{errorForm.name}</div>
                      </CCol>
                    </CRow>
                  </CRow>
                  <CRow>
                    <CRow className="mb-3">
                      <CFormLabel className="col-sm-2 col-form-label">Category</CFormLabel>
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
                        <div className="text-danger text-sm">{errorForm.category}</div>
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
