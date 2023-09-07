import {
  CButton,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CInputGroup,
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
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { toast } from 'react-hot-toast';
import { useLocation, useSearchParams } from 'react-router-dom';
import { getAccountTypeList } from 'src/services/accountType';
import { getClientList } from 'src/services/client';
import { getDownlineList } from 'src/services/downline';
import {
  cancelMainData,
  deleteMainData,
  getMainDataList,
  updateMainData
} from 'src/services/mainDataApi';
import Pagination from 'src/shared/components/Pagination';
import { ASSET_URL, BASE_URL } from 'src/shared/config/config';
import { dateConvertToDMY } from 'src/shared/helpers/dateHelper';
import { ccNumber, expFormat } from 'src/shared/helpers/ccFormat';

export default function MainData() {
  const { search } = useLocation();
  const [, setQuery] = useSearchParams('');
  const [mainDataList, setMainDataList] = useState([]);
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [mainDataDetail, setMainDataDetail] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [remark, setRemark] = useState('');
  const [actionStatus, setActionStatus] = useState('');
  const [showModalClientList, setShowModalClientList] = useState();
  const [clientList, setClientList] = useState([]);
  const [downlineList, setDownlineList] = useState([]);
  const [accountTypeList, setAccountTypeList] = useState([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(20);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [ktpNumber, setKtpNumber] = useState('');
  const [downlineId, setDownlineId] = useState(0);
  const [accountTypeId, setAccountTypeId] = useState(0);
  const [clientId, setClientId] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [assetName, setAssetName] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [downlineStatus, setDownlineStatus] = useState('');
  const [exportDataClientId, setExportDataClientId] = useState('');
  const [exportDataDownlineId, setExportDataDownlineId] = useState('');
  const [exportDataStatus, setExportDataStatus] = useState('');
  const [exportDataDownload, setExportDataDownload] = useState('');

  useEffect(() => {
    const parseQuery = queryString.parse(search);
    if (parseQuery.downline_id) {
      setDownlineId(parseQuery.downline_id);
    }
    if (parseQuery.account_type_id) {
      setAccountTypeId(parseQuery.account_type_id);
    }
    if (parseQuery.client_id) {
      setClientId(parseQuery.client_id);
    }
    if (parseQuery.status) {
      setStatus(parseQuery.status);
    }
    if (parseQuery.is_downline_paid) {
      setDownlineStatus(parseQuery.is_downline_paid);
    }
    if (parseQuery.name) {
      setName(parseQuery.name);
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
      window.location.reload();
    }
  }, [search]);

  const fetchMainData = async () => {
    const adminToken = await localStorage.getItem('admin_token');
    getMainDataList(adminToken, search)
      .then((res) => {
        setMainDataList(res.data.result);
        setTotalCount(res.data.count);
      })
      .catch(() => {});
  };

  const fetchClientList = () => {
    getClientList()
      .then((res) => {
        setClientList(res.data.result);
      })
      .catch(() => {});
  };

  const fetchDownlineList = () => {
    getDownlineList()
      .then((res) => {
        setDownlineList(res.data.result);
      })
      .catch(() => {});
  };

  const fetchAccountTypeList = () => {
    getAccountTypeList()
      .then((res) => {
        setAccountTypeList(res.data.result);
      })
      .catch(() => {});
  };

  const mainDataDetailHandle = (data) => {
    setMainDataDetail(data);
    setShowModalDetail(true);
  };

  useEffect(() => {
    fetchMainData();
  }, [search]);

  const editMainDataStatus = (body) => {
    updateMainData(mainDataDetail.id, body)
      .then((res) => {
        fetchMainData();
        setShowConfirmModal(false);
        setShowModalDetail(false);
        setMainDataDetail({});
      })
      .catch(() => {});
  };

  const changeStatusHandle = (status) => {
    setActionStatus(status);
    setShowConfirmModal(true);
    setShowModalDetail(false);
  };

  const chooseClientHandle = () => {
    setShowModalClientList(true);
  };

  const updateClient = (clientId) => {
    updateMainData(mainDataDetail.id, {
      client_id: clientId
    })
      .then(() => {
        fetchMainData();
        setShowModalClientList(false);
      })
      .catch(() => {});
  };

  const checkToken = async () => {
    const adminToken = await localStorage.getItem('admin_token');
    if (!adminToken) {
      window.location.href = '/admin/login';
    }
  };

  useEffect(() => {
    checkToken();
    fetchClientList();
    fetchDownlineList();
    fetchAccountTypeList();
  }, []);

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
    if (ktpNumber) {
      parseQuery.ktp_number = ktpNumber;
    } else {
      delete parseQuery.ktp_number;
    }
    if (phoneNumber) {
      parseQuery.phone_number = phoneNumber;
    } else {
      delete parseQuery.phone_number;
    }
    if (name) {
      parseQuery.name = name;
    } else {
      delete parseQuery.name;
    }
    setQuery(queryString.stringify(parseQuery));
  };

  const closeModal = () => {
    fetchMainData();
    setShowConfirmModal(false);
    setShowModalDetail(false);
    setMainDataDetail({});
  };

  const removeMainData = (id) => {
    deleteMainData(id).then((res) => {
      closeModal();
    });
  };

  const rejectMainData = (id) => {
    cancelMainData(id, {}).then((res) => {
      closeModal();
    });
  };

  return (
    <>
      <CContainer fluid className="mb-4">
        <CForm className="row">
          <CRow className="mb-3">
            <CCol>
              <CRow>
                <CFormLabel className="col-sm-3 col-form-label">
                  Sumber Akun
                </CFormLabel>
                <CCol>
                  <CFormSelect
                    className="mb-3"
                    value={accountTypeId}
                    onChange={(e) => {
                      if (e.target.value == 0) {
                        const parseQuery = queryString.parse(search);
                        delete parseQuery.account_type_id;
                        setQuery(queryString.stringify(parseQuery));
                        setAccountTypeId(0);
                      } else {
                        const parseQuery = queryString.parse(search);
                        parseQuery.account_type_id = e.target.value;
                        setQuery(queryString.stringify(parseQuery));
                      }
                    }}
                  >
                    <option value="">--- Pilih Sumber Akun ---</option>
                    {accountTypeList.map((el, i) => {
                      return (
                        <option key={i} value={el.id}>
                          {el.name}
                        </option>
                      );
                    })}
                  </CFormSelect>
                </CCol>
              </CRow>
            </CCol>
            <CCol>
              <CRow>
                <CFormLabel className="col-sm-3 col-form-label">
                  No. Handphone
                </CFormLabel>
                <CCol>
                  <CInputGroup>
                    <CFormInput
                      type="number"
                      placeholder="62856999888"
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                      }}
                      onBlur={filterHandle}
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol>
              <CRow>
                <CFormLabel className="col-sm-3 col-form-label">
                  Downline
                </CFormLabel>
                <CCol>
                  <CFormSelect
                    className="mb-3"
                    value={downlineId}
                    onChange={(e) => {
                      if (e.target.value == 0) {
                        const parseQuery = queryString.parse(search);
                        delete parseQuery.downline_id;
                        setQuery(queryString.stringify(parseQuery));
                        setDownlineId(0);
                      } else {
                        const parseQuery = queryString.parse(search);
                        parseQuery.downline_id = e.target.value;
                        setQuery(queryString.stringify(parseQuery));
                      }
                    }}
                  >
                    <option value="0">--- Pilih Downline ---</option>
                    {downlineList.map((el, i) => {
                      return (
                        <option key={i} value={el.id}>
                          {el?.name}
                        </option>
                      );
                    })}
                  </CFormSelect>
                </CCol>
              </CRow>
            </CCol>
            <CCol>
              <CRow>
                <CFormLabel className="col-sm-3 col-form-label">KTP</CFormLabel>
                <CCol>
                  <CFormInput
                    type="number"
                    placeholder="20101234567890123"
                    value={ktpNumber}
                    onChange={(e) => {
                      setKtpNumber(e.target.value);
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
                  Klien
                </CFormLabel>
                <CCol>
                  <CFormSelect
                    className="mb-3"
                    value={clientId}
                    onChange={(e) => {
                      if (e.target.value == 0) {
                        const parseQuery = queryString.parse(search);
                        delete parseQuery.client_id;
                        setQuery(queryString.stringify(parseQuery));
                        setClientId(0);
                      } else {
                        const parseQuery = queryString.parse(search);
                        parseQuery.client_id = e.target.value;
                        setQuery(queryString.stringify(parseQuery));
                      }
                    }}
                  >
                    <option value="0">--- Pilih Klien ---</option>
                    {clientList.map((el, i) => {
                      return (
                        <option key={i} value={el.id}>
                          {el?.name}
                        </option>
                      );
                    })}
                  </CFormSelect>
                </CCol>
              </CRow>
            </CCol>
            <CCol>
              <CRow>
                <CFormLabel className="col-sm-3 col-form-label">
                  Name
                </CFormLabel>
                <CCol>
                  <CFormInput
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
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
                  Bayar Downline
                </CFormLabel>
                <CCol>
                  <CFormSelect
                    className="mb-3"
                    value={downlineStatus}
                    onChange={(e) => {
                      if (e.target.value === '0') {
                        const parseQuery = queryString.parse(search);
                        delete parseQuery.is_downline_paid;
                        setQuery(queryString.stringify(parseQuery));
                        setDownlineStatus('');
                      } else {
                        const parseQuery = queryString.parse(search);
                        parseQuery.is_downline_paid = e.target.value;
                        setQuery(queryString.stringify(parseQuery));
                        setDownlineStatus(e.target.value);
                      }
                    }}
                  >
                    <option value="0">
                      --- Pilih Downline Paid Status ---
                    </option>
                    <option value="belum">Belum</option>
                    <option value="sudah">Sudah</option>
                  </CFormSelect>
                </CCol>
              </CRow>
            </CCol>
            <CCol>
              <CRow>
                <CFormLabel className="col-sm-3 col-form-label">
                  Status
                </CFormLabel>
                <CCol>
                  <CFormSelect
                    className="mb-3"
                    value={status}
                    onChange={(e) => {
                      if (e.target.value == 0) {
                        const parseQuery = queryString.parse(search);
                        delete parseQuery.status;
                        setQuery(queryString.stringify(parseQuery));
                        setStatus('');
                      } else {
                        const parseQuery = queryString.parse(search);
                        parseQuery.status = e.target.value;
                        setQuery(queryString.stringify(parseQuery));
                        setStatus(e.target.value);
                      }
                    }}
                  >
                    <option value="0">--- Pilih Status ---</option>
                    <option value="waiting">Waiting</option>
                    <option value="approve">Approve</option>
                    <option value="reject">Reject</option>
                    <option value="settlement">Settlement</option>
                  </CFormSelect>
                </CCol>
              </CRow>
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CRow>
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
            </CCol>
            <CCol></CCol>
          </CRow>
        </CForm>
      </CContainer>
      <CContainer className="mt-4 d-flex justify-content-end" fluid>
        <CButton
          className="btn btn-info"
          onClick={() => {
            setShowConfirmModal(true);
            setActionStatus('export_data');
          }}
        >
          Export Data
        </CButton>
      </CContainer>
      <CTable responsive className="mt-4">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">ID</CTableHeaderCell>
            <CTableHeaderCell scope="col">Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Downline</CTableHeaderCell>
            <CTableHeaderCell scope="col">Source</CTableHeaderCell>
            <CTableHeaderCell scope="col">Phone</CTableHeaderCell>
            <CTableHeaderCell scope="col">KTP</CTableHeaderCell>
            <CTableHeaderCell scope="col">Request Date</CTableHeaderCell>
            <CTableHeaderCell scope="col">Client</CTableHeaderCell>
            <CTableHeaderCell scope="col">DW Paid Status</CTableHeaderCell>
            <CTableHeaderCell scope="col">DW Paid At</CTableHeaderCell>
            <CTableHeaderCell scope="col">Status</CTableHeaderCell>
            <CTableHeaderCell scope="col">Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {mainDataList.map((el, i) => {
            const styleTableDataCell = el.client_id
              ? {
                  backgroundColor: el.client_id.color
                }
              : {};
            return (
              <CTableRow key={i}>
                <CTableDataCell
                  style={styleTableDataCell}
                  align="middle"
                  scope="row"
                >
                  {el.id}
                </CTableDataCell>
                <CTableDataCell style={styleTableDataCell} align="middle">
                  {el.name}
                </CTableDataCell>
                <CTableDataCell style={styleTableDataCell} align="middle">
                  {el.downline_id?.name}
                </CTableDataCell>
                <CTableDataCell style={styleTableDataCell} align="middle">
                  {el.account_type_id?.name}
                </CTableDataCell>
                <CTableDataCell style={styleTableDataCell} align="middle">
                  {el.phone_number}
                </CTableDataCell>
                <CTableDataCell style={styleTableDataCell} align="middle">
                  {el.ktp_number}
                </CTableDataCell>
                <CTableDataCell style={styleTableDataCell} align="middle">
                  {dateConvertToDMY(el.created_at)}
                </CTableDataCell>
                <CTableDataCell style={styleTableDataCell} align="middle">
                  {el.client_id ? el?.client_id?.name : '-'}
                </CTableDataCell>
                <CTableDataCell style={styleTableDataCell} align="middle">
                  {el.is_downline_paid ? (
                    <span className="badge text-bg-success rounded-pill px-2">
                      Sudah
                    </span>
                  ) : (
                    <span className="badge text-bg-danger text-white rounded-pill px-2">
                      Belum
                    </span>
                  )}
                </CTableDataCell>
                <CTableDataCell style={styleTableDataCell} align="middle">
                  {el.downline_paid_date
                    ? dateConvertToDMY(el?.downline_paid_date)
                    : '-'}
                </CTableDataCell>
                <CTableDataCell style={styleTableDataCell} align="middle">
                  <span
                    className={`text-capitalize ${
                      el.status.toLowerCase() === 'waiting' &&
                      'badge text-bg-warning rounded-pill px-2'
                    } ${
                      el.status.toLowerCase() === 'reject' &&
                      'badge text-bg-danger text-white rounded-pill px-2'
                    } ${
                      el.status.toLowerCase() === 'approve' &&
                      'badge text-bg-info rounded-pill px-2'
                    } ${
                      el.status.toLowerCase() === 'settlement' &&
                      'badge text-bg-success rounded-pill px-2'
                    }`}
                  >
                    {el.status}
                  </span>
                </CTableDataCell>
                <CTableDataCell align="middle" style={styleTableDataCell}>
                  {(el.status.toLowerCase() === 'settlement' ||
                    el.status.toLowerCase() === 'reject' ||
                    el.status.toLowerCase() === 'approve') && (
                    <>
                      <CButton
                        color="info"
                        size="sm"
                        className="me-2 mb-1 mt-1"
                        onClick={() => {
                          mainDataDetailHandle(el);
                        }}
                      >
                        Detail
                      </CButton>
                    </>
                  )}
                  {(el.status.toLowerCase() === 'settlement' ||
                    el.status.toLowerCase() === 'approve') && (
                    <>
                      <CButton
                        color="dark"
                        size="sm"
                        className="me-2 mb-1 mt-1"
                        onClick={() => {
                          setShowConfirmModal(true);
                          setActionStatus('cancel');
                          setMainDataDetail(el);
                        }}
                      >
                        Cancel
                      </CButton>
                      <br />
                    </>
                  )}
                  {el.status.toLowerCase() === 'waiting' && (
                    <CButton
                      color="warning"
                      size="sm"
                      className="me-2 mb-1 mt-1"
                      onClick={() => {
                        mainDataDetailHandle(el);
                      }}
                    >
                      Verifikasi
                    </CButton>
                  )}
                  {el.status === 'approve' && !el.client_id && (
                    <>
                      <CButton
                        size="sm"
                        color="text-white"
                        className="bg-aqua me-2"
                        onClick={() => {
                          chooseClientHandle();
                          setMainDataDetail(el);
                        }}
                      >
                        Choose Client
                      </CButton>
                    </>
                  )}
                  {el.status === 'approve' && el?.client_id && (
                    <CButton
                      size="sm"
                      className="me-2 mb-1 mt-1 bg-yellow border-0 text-black"
                      onClick={() => {
                        setMainDataDetail(el);
                        setShowConfirmModal(true);
                        setActionStatus('downline_paid');
                      }}
                    >
                      Bayar Downline
                    </CButton>
                  )}
                  {el.status === 'reject' && (
                    <>
                      <CButton
                        // color="info"
                        size="sm"
                        className="me-2 bg-pink text-white border-0 mb-1 mt-1"
                        onClick={() => {
                          window.open(
                            `/?downline_code=${el.downline_id?.code}&edit=true&main_data_id=${el.id}`,
                            '_blank'
                          );
                        }}
                      >
                        Edit
                      </CButton>
                      <br />
                      <CopyToClipboard
                        text={`${BASE_URL}?downline_code=${el.downline_id?.code}&edit=true&main_data_id=${el?.id}`}
                        onCopy={() => {
                          {
                            toast.success('Copied');
                          }
                        }}
                      >
                        <CButton
                          size="sm"
                          className="me-2"
                          color="primary"
                          onClick={() => {}}
                        >
                          Copy Link
                        </CButton>
                      </CopyToClipboard>
                      <CButton
                        size="sm"
                        color="success"
                        className="mb-1 mt-1"
                        onClick={() => {
                          window.location.href = `https://wa.me/${el?.phone_number}?text=Ini URL kamu, silahkan klik atau copy dan paste ${BASE_URL}?downline_code=${el.downline_id?.code}&edit=true&main_data_id=${el.id}`;
                        }}
                      >
                        Chat WA
                      </CButton>
                      <br />
                    </>
                  )}
                  <CButton
                    color="danger"
                    size="sm"
                    className="mb-1 mt-1"
                    onClick={() => {
                      setMainDataDetail(el);
                      setShowConfirmModal(true);
                      setActionStatus('delete');
                    }}
                  >
                    Delete
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            );
          })}
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
      <CModal
        size="lg"
        backdrop="static"
        visible={showModalDetail}
        onClose={() => setShowModalDetail(false)}
      >
        <CModalHeader>
          <CModalTitle>Main Data Detail</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="d-flex flex-wrap">
            <div className="my-3 col-4">
              <div className="h6">Type</div>
              <div className="text-capitalize">
                {mainDataDetail?.account_type_id?.category}
              </div>
            </div>
            <div className="my-3 col-4">
              <div className="h6">Account</div>
              <div>{mainDataDetail?.account_type_id?.name}</div>
            </div>
            <div className="my-3 col-4">
              <div className="h6">Name</div>
              <div>{mainDataDetail?.name}</div>
            </div>
            <div className="my-3 col-4">
              <div className="h6">Phone Number</div>
              <div>{mainDataDetail?.phone_number}</div>
            </div>
            <div className="my-3 col-4">
              <div className="h6">KTP</div>
              <div>{mainDataDetail.ktp_number}</div>
            </div>
            <div className="my-3 col-4">
              <div className="h6">KK</div>
              <div>{mainDataDetail.kk_number}</div>
            </div>
            <div className="my-3 col-4">
              <div className="h6">Mother Name</div>
              <div>{mainDataDetail.mother_name}</div>
            </div>
            <div className="my-3 col-4">
              <div className="h6">Full Address</div>
              <div>{mainDataDetail.full_ktp_address}</div>
            </div>
            {mainDataDetail.account_type_id?.category === 'rekening' && (
              <div className="my-3 col-4">
                <div className="h6">Bank Branch</div>
                <div>{mainDataDetail.bank_branch}</div>
              </div>
            )}
            <div className="my-3 col-4">
              <div className="h6">Email</div>
              <div>{mainDataDetail.email}</div>
            </div>
            <div className="my-3 col-4">
              <div className="h6">Email Password</div>
              <div>{mainDataDetail.email_password}</div>
            </div>
            {mainDataDetail.account_type_id?.category === 'rekening' && (
              <>
                <div className="my-3 col-4">
                  <div className="h6">Card Number</div>
                  <div>{ccNumber(mainDataDetail.card_number)}</div>
                </div>
                <div className="my-3 col-4">
                  <div className="h6">Exp. Date</div>
                  <div>{expFormat(mainDataDetail.exp_date)}</div>
                </div>
                <div className="my-3 col-4">
                  <div className="h6">Access Code</div>
                  <div>{mainDataDetail.access_code}</div>
                </div>
                <div className="my-3 col-4">
                  <div className="h6">mBanking Password</div>
                  <div>{mainDataDetail.mbanking_password}</div>
                </div>
              </>
            )}
            <div className="my-3 col-4">
              <div className="h6">PIN</div>
              <div>{mainDataDetail.pin}</div>
            </div>
            {mainDataDetail.account_type_id?.category === 'rekening' && (
              <>
                <div className="my-3 col-4">
                  <div className="h6">Username App</div>
                  <div>{mainDataDetail.username_acct}</div>
                </div>
                <div className="my-3 col-4">
                  <div className="h6">Password App</div>
                  <div>{mainDataDetail.password_acct}</div>
                </div>
                <div className="my-3 col-4">
                  <div className="h6">Transaction Password App</div>
                  <div>{mainDataDetail.transaction_password_acct}</div>
                </div>
                <div className="my-3 col-4">
                  <div className="h6">Username iBanking</div>
                  <div>{mainDataDetail.username_ibanking}</div>
                </div>
                <div className="my-3 col-4">
                  <div className="h6">Password iBanking</div>
                  <div>{mainDataDetail.password_ibanking}</div>
                </div>
              </>
            )}
            <div className="my-3 col-4">
              <div className="h6">Active Period</div>
              <div>
                {mainDataDetail.active_period
                  ? dateConvertToDMY(mainDataDetail.active_period)
                  : '-'}
              </div>
            </div>
            {mainDataDetail.account_type_id?.category === 'rekening' && (
              <>
                <div className="my-3 col-4">
                  <div className="h6">PIN Token iBanking</div>
                  <div>{mainDataDetail.pin_token_ibanking}</div>
                </div>
              </>
            )}
            <div className="my-3 col-4">
              <div className="h6">Remark</div>
              <div>{mainDataDetail.remark ? mainDataDetail.remark : '-'}</div>
            </div>
          </div>
          <hr />
          <div className="d-flex justify-content-between flex-wrap">
            <div className="my-3 col-4">
              <div className="h6">Photo KTP</div>
              <img
                src={`${ASSET_URL}/${mainDataDetail.ktp_photo_url}`}
                className="col-10"
                onClick={() => {
                  setAssetName(mainDataDetail.ktp_photo_url);
                }}
              />
            </div>
            <div className="my-3 col-4">
              <div className="h6">Photo Selfie</div>
              <img
                src={`${ASSET_URL}/${mainDataDetail.selfie_photo_url}`}
                className="col-10"
                onClick={() => {
                  setAssetName(mainDataDetail.selfie_photo_url);
                }}
              />
            </div>
            <div className="my-3 col-4">
              <div className="h6">Video Verification</div>
              <video
                src={`${ASSET_URL}/${mainDataDetail.video_verification_url}`}
                className="col-10"
                controls
              />
            </div>
          </div>
          <div className="d-flex flex-wrap">
            {mainDataDetail.another_file_1_url && (
              <div className="my-3 col-4">
                <div className="h6">Another File 1</div>
                {mainDataDetail.another_file_1_url[0] === 'I' && (
                  <img
                    src={`${ASSET_URL}/${mainDataDetail.another_file_1_url}`}
                    className="col-10"
                    onClick={() => {
                      setAssetName(mainDataDetail.another_file_1_url);
                    }}
                  />
                )}
                {mainDataDetail.another_file_1_url[0] === 'V' && (
                  <video
                    src={`${ASSET_URL}/${mainDataDetail.another_file_1_url}`}
                    className="col-10"
                    controls
                  />
                )}
              </div>
            )}
            {mainDataDetail.another_file_2_url && (
              <div className="my-3 col-4">
                <div className="h6">Another File 2</div>
                {mainDataDetail.another_file_2_url[0] === 'I' && (
                  <img
                    src={`${ASSET_URL}/${mainDataDetail.another_file_2_url}`}
                    className="col-10"
                    onClick={() => {
                      setAssetName(mainDataDetail.another_file_2_url);
                    }}
                  />
                )}
                {mainDataDetail.another_file_2_url[0] === 'V' && (
                  <video
                    src={`${ASSET_URL}/${mainDataDetail.another_file_2_url}`}
                    className="col-10"
                    controls
                  />
                )}
              </div>
            )}
            {mainDataDetail.another_file_3_url && (
              <div className="my-3 col-4">
                <div className="h6">Another File 3</div>
                {mainDataDetail.another_file_3_url[0] === 'I' && (
                  <img
                    src={`${ASSET_URL}/${mainDataDetail.another_file_3_url}`}
                    className="col-10"
                    onClick={() => {
                      setAssetName(mainDataDetail.another_file_3_url);
                    }}
                  />
                )}
                {mainDataDetail.another_file_3_url[0] === 'V' && (
                  <video
                    src={`${ASSET_URL}/${mainDataDetail.another_file_3_url}`}
                    className="col-10"
                    controls
                  />
                )}
              </div>
            )}
            {mainDataDetail.another_file_4_url && (
              <div className="my-3 col-4">
                <div className="h6">Another File 4</div>
                {mainDataDetail.another_file_4_url[0] === 'I' && (
                  <img
                    src={`${ASSET_URL}/${mainDataDetail.another_file_4_url}`}
                    className="col-10"
                    onClick={() => {
                      setAssetName(mainDataDetail.another_file_4_url);
                    }}
                  />
                )}
                {mainDataDetail.another_file_4_url[0] === 'V' && (
                  <video
                    src={`${ASSET_URL}/${mainDataDetail.another_file_4_url}`}
                    className="col-10"
                    controls
                  />
                )}
              </div>
            )}
            {mainDataDetail.another_file_5_url && (
              <div className="my-3 col-4">
                <div className="h6">Another File 5</div>
                {mainDataDetail.another_file_5_url[0] === 'I' && (
                  <img
                    src={`${ASSET_URL}/${mainDataDetail.another_file_5_url}`}
                    className="col-10"
                    onClick={() => {
                      setAssetName(mainDataDetail.another_file_5_url);
                    }}
                  />
                )}
                {mainDataDetail.another_file_5_url[0] === 'V' && (
                  <video
                    src={`${ASSET_URL}/${mainDataDetail.another_file_5_url}`}
                    className="col-10"
                    controls
                  />
                )}
              </div>
            )}
          </div>
          <hr />
          <div className="d-flex">
            <div className="my-3 col-4">
              <div className="h6">Downline</div>
              <div>{mainDataDetail?.downline_id?.name}</div>
            </div>
            <div className="my-3 col-4">
              <div className="h6">Downline Payment Status</div>
              <div>{mainDataDetail?.is_downline_paid ? 'Sudah' : 'Belum'}</div>
            </div>
            <div className="my-3 col-4">
              <div className="h6">Downline Paid Date</div>
              <div>
                {mainDataDetail?.downline_paid_date
                  ? dateConvertToDMY(mainDataDetail?.downline_paid_date)
                  : '-'}
              </div>
            </div>
          </div>
          <hr />
          <div className="my-3 col-4">
            <div className="h6">Client</div>
            <div>
              {mainDataDetail?.client_id
                ? mainDataDetail?.client_id?.name
                : '-'}
            </div>
          </div>
        </CModalBody>
        {mainDataDetail.status === 'waiting' && (
          <CModalFooter>
            <CButton
              color="danger text-white"
              onClick={() => {
                changeStatusHandle('reject');
              }}
            >
              Reject
            </CButton>
            <CButton
              color="success text-white"
              onClick={() => {
                changeStatusHandle('approve');
              }}
            >
              Approve
            </CButton>
          </CModalFooter>
        )}
      </CModal>
      <CModal
        backdrop="static"
        visible={showConfirmModal}
        size={'lg'}
        onClose={() => {
          setRemark('');
          setShowConfirmModal(false);
        }}
      >
        <CModalHeader>
          <CModalTitle>
            {actionStatus === 'export_data' ? 'Export Data' : 'Warning'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {((actionStatus !== 'downline_paid' &&
            actionStatus !== 'export_data') ||
            actionStatus == 'delete') && (
            <h4 className="mb-3">Are you sure?</h4>
          )}
          {actionStatus == 'downline_paid' && (
            <p className="mb-3">
              Apakah anda ingin membayar {mainDataDetail?.downline_id?.name}?
            </p>
          )}
          {actionStatus == 'reject' && (
            <div>
              <CFormLabel>Remark</CFormLabel>
              <CFormTextarea
                placeholder="Remark"
                onChange={(e) => {
                  setRemark(e.target.value);
                }}
              />
            </div>
          )}
          {actionStatus === 'export_data' && (
            <>
              <CRow className="mb-3">
                <CCol>
                  <CRow>
                    <CFormLabel className="col-sm-3 col-form-label">
                      Klien
                    </CFormLabel>
                    <CCol>
                      <CFormSelect
                        className="mb-3"
                        value={exportDataClientId}
                        onChange={(e) => {
                          if (e.target.value == '0') {
                            setExportDataClientId('');
                          } else {
                            setExportDataClientId(e.target.value);
                          }
                        }}
                      >
                        <option value="0">--- Pilih Klien ---</option>
                        {clientList.map((el, i) => {
                          return (
                            <option key={i} value={el.id}>
                              {el?.name}
                            </option>
                          );
                        })}
                      </CFormSelect>
                    </CCol>
                  </CRow>
                </CCol>
                <CCol>
                  <CRow>
                    <CFormLabel className="col-sm-3 col-form-label">
                      Status
                    </CFormLabel>
                    <CCol>
                      <CFormSelect
                        className="mb-3"
                        value={exportDataStatus}
                        onChange={(e) => {
                          if (e.target.value == '0') {
                            setExportDataStatus('');
                          } else {
                            setExportDataStatus(e.target.value);
                          }
                        }}
                      >
                        <option value="0">--- Pilih Status ---</option>
                        <option value="waiting">Waiting</option>
                        <option value="approve">Approve</option>
                        <option value="reject">Reject</option>
                        <option value="settlement">Settlement</option>
                      </CFormSelect>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <CRow>
                    <CFormLabel className="col-sm-3 col-form-label">
                      Downline
                    </CFormLabel>
                    <CCol>
                      <CFormSelect
                        className="mb-3"
                        value={exportDataDownlineId}
                        onChange={(e) => {
                          if (e.target.value == '0') {
                            setExportDataDownlineId('');
                          } else {
                            setExportDataDownlineId(e.target.value);
                          }
                        }}
                      >
                        <option value="0">--- Pilih Downline ---</option>
                        {downlineList.map((el, i) => {
                          return (
                            <option key={i} value={el.id}>
                              {el?.name}
                            </option>
                          );
                        })}
                      </CFormSelect>
                    </CCol>
                  </CRow>
                </CCol>
                <CCol>
                  <CRow>
                    <CFormLabel className="col-sm-3 col-form-label">
                      Download
                    </CFormLabel>
                    <CCol>
                      <CFormSelect
                        className="mb-3"
                        value={exportDataDownload}
                        onChange={(e) => {
                          if (e.target.value == '0') {
                            setExportDataDownload('');
                          } else {
                            setExportDataDownload(e.target.value);
                          }
                        }}
                      >
                        <option value="0">--- Pilih Download ---</option>
                        <option value="all">All</option>
                        <option value="ewallet">E - Wallet</option>
                        <option value="rekening">Rekening</option>
                      </CFormSelect>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          {actionStatus === 'export_data' && (
            <CButton
              color="success"
              onClick={() => {
                window.open(`https://upload.aliweb.top/export.php`, '_blank');
              }}
            >
              Export Semua Data
            </CButton>
          )}
          <CButton
            color="secondary text-white"
            onClick={() => {
              setShowConfirmModal(false);
              setRemark('');
              if (actionStatus === 'approve' || actionStatus === 'reject') {
                setShowModalDetail(true);
              }
            }}
          >
            Cancel
          </CButton>
          <CButton
            color="info"
            onClick={() => {
              if (actionStatus == 'approve') {
                editMainDataStatus({
                  status: 'approve'
                });
              } else if (actionStatus == 'reject') {
                const body = {
                  status: 'reject'
                };

                if (remark) {
                  body.remark = remark;
                }
                editMainDataStatus(body);
              } else if (actionStatus === 'downline_paid') {
                editMainDataStatus({
                  is_downline_paid: true
                });
              } else if (actionStatus === 'cancel') {
                rejectMainData(mainDataDetail.id);
              } else if (actionStatus === 'delete') {
                removeMainData(mainDataDetail.id);
              } else if (actionStatus === 'export_data') {
                if (
                  !exportDataClientId &&
                  (exportDataDownlineId ||
                    exportDataStatus ||
                    exportDataDownload)
                ) {
                  toast.error('Please choose your client');
                } else {
                  window.open(
                    `https://upload.aliweb.top/export.php?client=${exportDataClientId}&downline=${exportDataDownlineId}&status=${exportDataStatus}&download=${exportDataDownload}`,
                    '_blank'
                  );
                }
              }
            }}
          >
            {actionStatus === 'export_data' ? 'Export' : 'Yes'}
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal
        backdrop="static"
        size="lg"
        visible={showModalClientList}
        onClose={() => {
          setShowModalClientList(false);
          setMainDataDetail({});
        }}
      >
        <CModalHeader>
          <CModalTitle>Client List</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CTable responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">No.</CTableHeaderCell>
                <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Phone Number</CTableHeaderCell>
                <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                <CTableHeaderCell scope="col">Choose</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {clientList.map((el, i) => (
                <CTableRow key={i}>
                  <CTableHeaderCell scope="row">{i + 1}</CTableHeaderCell>
                  <CTableDataCell>{el.name}</CTableDataCell>
                  <CTableDataCell>{el.phone}</CTableDataCell>
                  <CTableDataCell>{el.email}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      size="sm"
                      color="secondary text-white"
                      onClick={() => {
                        updateClient(el.id);
                      }}
                    >
                      Choose
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CModalBody>
      </CModal>
      {assetName && (
        <div className="backdrop-container">
          {assetName[0] === 'I' && (
            <img src={`${ASSET_URL}/${assetName}`} style={{ height: '80%' }} />
          )}
          <div
            className="backdrop-bg"
            onClick={() => {
              setAssetName('');
            }}
          ></div>
        </div>
      )}
    </>
  );
}
