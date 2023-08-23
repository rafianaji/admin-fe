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
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CPagination,
  CPaginationItem,
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
import { useLocation, useSearchParams } from 'react-router-dom';
import { getAccountTypeList } from 'src/services/accountType';
import { getClientList } from 'src/services/client';
import { getDownlineList } from 'src/services/downline';
import { getMainDataList, updateMainData } from 'src/services/mainDataApi';
import Pagination from 'src/shared/components/Pagination';
import { API_BASE_URL } from 'src/shared/config/config';
import { dateConvertToDMY } from 'src/shared/helpers/dateHelper';

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

  const fetchMainData = () => {
    getMainDataList(search)
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
                    <CInputGroupText className="secondary">62</CInputGroupText>
                    <CFormInput
                      type="number"
                      placeholder="856999888"
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
                          {el.name}
                        </option>
                      );
                    })}
                  </CFormSelect>
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
      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">No.</CTableHeaderCell>
            <CTableHeaderCell scope="col">Downline</CTableHeaderCell>
            <CTableHeaderCell scope="col">Sumber Akun</CTableHeaderCell>
            <CTableHeaderCell scope="col">Phone</CTableHeaderCell>
            <CTableHeaderCell scope="col">KTP</CTableHeaderCell>
            <CTableHeaderCell scope="col">Request Date</CTableHeaderCell>
            <CTableHeaderCell scope="col">Klien</CTableHeaderCell>
            <CTableHeaderCell scope="col">Bayar Downline</CTableHeaderCell>
            <CTableHeaderCell scope="col">Status</CTableHeaderCell>
            <CTableHeaderCell scope="col">Aksi</CTableHeaderCell>
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
                <CTableDataCell style={styleTableDataCell} scope="row">
                  {i + 1}
                </CTableDataCell>
                <CTableDataCell style={styleTableDataCell} align="middle">
                  {el.downline_id.name}
                </CTableDataCell>
                <CTableDataCell style={styleTableDataCell} align="middle">
                  {el.account_type_id.name}
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
                  {el.client_id ? el.client_id.name : '-'}
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
                  {el.status.toLowerCase() === 'waiting' && (
                    <CButton
                      color="warning"
                      size="sm"
                      onClick={() => {
                        mainDataDetailHandle(el);
                      }}
                    >
                      Verifikasi
                    </CButton>
                  )}
                  {el.status === 'approve' && !el.client_id && (
                    <CButton
                      size="sm"
                      color="secondary text-white"
                      onClick={() => {
                        chooseClientHandle();
                        setMainDataDetail(el);
                      }}
                    >
                      Choose Client
                    </CButton>
                  )}
                  {el.status === 'approve' && el.client_id && (
                    <CButton
                      size="sm"
                      color="success"
                      onClick={() => {
                        setMainDataDetail(el);
                        setShowConfirmModal(true);
                        setActionStatus('downline_paid');
                      }}
                    >
                      Bayar Downline
                    </CButton>
                  )}
                  {(el.status.toLowerCase() === 'settlement' ||
                    el.status.toLowerCase() === 'reject') && (
                    <CButton
                      color="info"
                      size="sm"
                      onClick={() => {
                        mainDataDetailHandle(el);
                      }}
                    >
                      Detail
                    </CButton>
                  )}
                </CTableDataCell>
              </CTableRow>
            );
          })}
        </CTableBody>
      </CTable>
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
          <div className="d-flex justify-content-between flex-wrap">
            <div className="my-3 col-4">
              <div className="h6">Name</div>
              <div>{mainDataDetail.name}</div>
            </div>
            <div className="my-3 col-4">
              <div className="h6">Phone Number</div>
              <div>{mainDataDetail.phone_number}</div>
            </div>
            <div className="my-3 col-4">
              <div className="h6">KTP Number</div>
              <div>{mainDataDetail.ktp_number}</div>
            </div>
            <div className="my-3 col-4">
              <div className="h6">KK Number</div>
              <div>{mainDataDetail.kk_number}</div>
            </div>
            <div className="my-3 col-4">
              <div className="h6">Mother Name</div>
              <div>{mainDataDetail.kk_number}</div>
            </div>
            <div className="my-3 col-4">
              <div className="h6">Full KTP Address</div>
              <div>{mainDataDetail.full_ktp_address}</div>
            </div>
            <div className="my-3 col-4">
              <div className="h6">Email</div>
              <div>{mainDataDetail.email}</div>
            </div>
            <div className="my-3 col-4">
              <div className="h6">Email Password</div>
              <div>{mainDataDetail.email_password}</div>
            </div>

            <div className="my-3 col-4">
              <div className="h6">Pin</div>
              <div>{mainDataDetail.pin}</div>
            </div>
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
                  <div className="h6">Bank Branch</div>
                  <div>{mainDataDetail.bank_branch}</div>
                </div>
                <div className="my-3 col-4">
                  <div className="h6">Card Number</div>
                  <div>{mainDataDetail.card_number}</div>
                </div>
                <div className="my-3 col-4">
                  <div className="h6">Exp Date</div>
                  <div>{mainDataDetail.exp_date}</div>
                </div>
                <div className="my-3 col-4">
                  <div className="h6">Access Code</div>
                  <div>{mainDataDetail.access_code}</div>
                </div>
                <div className="my-3 col-4">
                  <div className="h6">Mbanking Password</div>
                  <div>{mainDataDetail.mbanking_password}</div>
                </div>
                <div className="my-3 col-4">
                  <div className="h6">Username Acct</div>
                  <div>{mainDataDetail.username_acct}</div>
                </div>
                <div className="my-3 col-4">
                  <div className="h6">Password Acct</div>
                  <div>{mainDataDetail.password_acct}</div>
                </div>
                <div className="my-3 col-4">
                  <div className="h6">Transaction Password Acct</div>
                  <div>{mainDataDetail.transaction_password_acct}</div>
                </div>
                <div className="my-3 col-4">
                  <div className="h6">Username Ibanking</div>
                  <div>{mainDataDetail.username_ibanking}</div>
                </div>
                <div className="my-3 col-4">
                  <div className="h6">Password Ibanking</div>
                  <div>{mainDataDetail.password_ibanking}</div>
                </div>
                <div className="my-3 col-4">
                  <div className="h6">Pin Token Ibanking</div>
                  <div>{mainDataDetail.pin_token_ibanking}</div>
                </div>
              </>
            )}
            <div className="my-3 col-4">
              <div className="h6">Remark</div>
              <div>{mainDataDetail.remark ? mainDataDetail.remark : '-'}</div>
            </div>
          </div>
          <div className="d-flex justify-content-between flex-wrap">
            <div className="my-3 col-4">
              <div className="h6">Photo KTP</div>
              <img
                src={`${API_BASE_URL}/main-data/asset/${mainDataDetail.ktp_photo_url}`}
                className="col-10"
                onClick={() => {
                  setAssetName(mainDataDetail.ktp_photo_url);
                }}
              />
            </div>
            <div className="my-3 col-4">
              <div className="h6">Photo Selfie</div>
              <img
                src={`${API_BASE_URL}/main-data/asset/${mainDataDetail.selfie_photo_url}`}
                className="col-10"
                onClick={() => {
                  setAssetName(mainDataDetail.ktp_photo_url);
                }}
              />
            </div>
            <div className="my-3 col-4">
              <div className="h6">Video Verification</div>
              <video
                src={`${API_BASE_URL}/main-data/asset/${mainDataDetail.video_verification_url}`}
                className="col-10"
                controls
              />
            </div>
          </div>
          <div className="d-flex justify-content-between flex-wrap">
            {mainDataDetail.another_file_1_url && (
              <div className="my-3 col-4">
                <div className="h6">Another File 1</div>
                {mainDataDetail.another_file_1_url[0] === 'I' && (
                  <img
                    src={`${API_BASE_URL}/main-data/asset/${mainDataDetail.another_file_1_url}`}
                    className="col-10"
                    onClick={() => {
                      setAssetName(mainDataDetail.another_file_1_url);
                    }}
                  />
                )}
                {mainDataDetail.another_file_1_url[0] === 'V' && (
                  <video
                    src={`${API_BASE_URL}/main-data/asset/${mainDataDetail.another_file_1_url}`}
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
                    src={`${API_BASE_URL}/main-data/asset/${mainDataDetail.another_file_2_url}`}
                    className="col-10"
                    onClick={() => {
                      setAssetName(mainDataDetail.ktp_photo_url);
                    }}
                  />
                )}
                {mainDataDetail.another_file_2_url[0] === 'V' && (
                  <video
                    src={`${API_BASE_URL}/main-data/asset/${mainDataDetail.another_file_2_url}`}
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
                    src={`${API_BASE_URL}/main-data/asset/${mainDataDetail.another_file_3_url}`}
                    className="col-10"
                    onClick={() => {
                      setAssetName(mainDataDetail.another_file_3_url);
                    }}
                  />
                )}
                {mainDataDetail.another_file_3_url[0] === 'V' && (
                  <video
                    src={`${API_BASE_URL}/main-data/asset/${mainDataDetail.another_file_3_url}`}
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
                    src={`${API_BASE_URL}/main-data/asset/${mainDataDetail.another_file_4_url}`}
                    className="col-10"
                    onClick={() => {
                      setAssetName(mainDataDetail.another_file_4_url);
                    }}
                  />
                )}
                {mainDataDetail.another_file_4_url[0] === 'V' && (
                  <video
                    src={`${API_BASE_URL}/main-data/asset/${mainDataDetail.another_file_4_url}`}
                    className="col-10"
                    controls
                  />
                )}
              </div>
            )}
            {mainDataDetail.another_file_5_url && (
              <div className="my-3 col-4">
                <div className="h6">Another File 5</div>
                {mainDataDetail.another_file_4_url[0] === 'I' && (
                  <img
                    src={`${API_BASE_URL}/main-data/asset/${mainDataDetail.another_file_5_url}`}
                    className="col-10"
                    onClick={() => {
                      setAssetName(mainDataDetail.another_file_5_url);
                    }}
                  />
                )}
                {mainDataDetail.another_file_5_url[0] === 'V' && (
                  <video
                    src={`${API_BASE_URL}/main-data/asset/${mainDataDetail.another_file_5_url}`}
                    className="col-10"
                    controls
                  />
                )}
              </div>
            )}
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
        onClose={() => {
          setRemark('');
          //   setShowModalDetail(true);
          setShowConfirmModal(false);
        }}
      >
        <CModalHeader>
          <CModalTitle>Warning</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {actionStatus !== 'downline_paid' && (
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
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary text-white"
            onClick={() => {
              setShowConfirmModal(false);
              setRemark('');
              if (actionStatus !== 'downline_paid') {
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
              }
            }}
          >
            Yes
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
          <CTable>
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
            <img
              src={`${API_BASE_URL}/main-data/asset/${assetName}`}
              style={{ height: '80%' }}
            />
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
