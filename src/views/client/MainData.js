import {
  CButton,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CModal,
  CModalBody,
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
import React, { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { getMainDataList } from 'src/services/mainDataApi';
import { dateConvertToDMY } from 'src/shared/helpers/dateHelper';
import { useLocation, useSearchParams } from 'react-router-dom';
import queryString from 'query-string';
import { getAccountTypeList } from 'src/services/accountType';
import { API_BASE_URL } from 'src/shared/config/config';

export default function MainData() {
  const [mainDataList, setMainDataList] = useState([]);
  const [clientId, setClientId] = useState(0);
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [mainDataDetail, setMainDataDetail] = useState({});
  const { search } = useLocation();
  const [, setQuery] = useSearchParams('');
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(20);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [ktpNumber, setKtpNumber] = useState('');
  const [downlineId, setDownlineId] = useState(0);
  const [accountTypeId, setAccountTypeId] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [accountTypeList, setAccountTypeList] = useState([]);
  const [assetName, setAssetName] = useState('');

  useEffect(() => {
    const parseQuery = queryString.parse(search);
    if (parseQuery.account_type_id) {
      setAccountTypeId(parseQuery.account_type_id);
    }
    if (parseQuery.client_id) {
      setClientId(parseQuery.client_id);
    }
    if (parseQuery.skip || parseQuery.take) {
      setQuery(queryString.stringify(parseQuery));
    }
  }, [search]);

  const mainDataDetailHandle = (data) => {
    setMainDataDetail(data);
    setShowModalDetail(true);
  };

  const fetchMainDataList = () => {
    getMainDataList(`?client_id=${clientId}&${search.slice(1, search.length)}`).then((res) => {
      setMainDataList(res.data.result);
    });
  };

  const fetchAccountTypeList = () => {
    getAccountTypeList().then((res) => {
      setAccountTypeList(res.data);
    });
  };

  const checkToken = async () => {
    const clientToken = await localStorage.getItem('client_token');
    if (!clientToken) {
      window.location.href = '/client/login';
    } else {
      const decodeToken = jwtDecode(clientToken);
      setClientId(decodeToken.id);
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchMainDataList();
    }
  }, [clientId, search]);

  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    fetchAccountTypeList();
  }, []);

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
                <CFormLabel className="col-sm-3 col-form-label">Sumber Akun</CFormLabel>
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
                <CFormLabel className="col-sm-3 col-form-label">No. Handphone</CFormLabel>
                <CCol>
                  <CFormInput
                    type="number"
                    placeholder="856999888"
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
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
            <CCol>
              <CButton className="col-sm-12" color="info" onClick={filterHandle}>
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
            <CTableHeaderCell scope="col">Sumber Akun</CTableHeaderCell>
            <CTableHeaderCell scope="col">Phone</CTableHeaderCell>
            <CTableHeaderCell scope="col">KTP</CTableHeaderCell>
            <CTableHeaderCell scope="col">Aksi</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {mainDataList.map((el, i) => (
            <CTableRow key={i}>
              <CTableDataCell scope="row">{i + 1}</CTableDataCell>
              <CTableDataCell align="middle">{el.account_type_id.name}</CTableDataCell>
              <CTableDataCell align="middle">{el.phone_number}</CTableDataCell>
              <CTableDataCell align="middle">{el.ktp_number}</CTableDataCell>
              <CTableDataCell align="middle">
                <CButton
                  color="info"
                  size="sm"
                  onClick={() => {
                    mainDataDetailHandle(el);
                  }}
                >
                  Cek Detail
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
      <CModal size="lg" backdrop="static" visible={showModalDetail} onClose={() => setShowModalDetail(false)}>
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
              <div>{mainDataDetail.active_period ? dateConvertToDMY(mainDataDetail.active_period) : '-'}</div>
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
              <video src={`${API_BASE_URL}/main-data/asset/${mainDataDetail.video_verification_url}`} className="col-10" controls />
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
                  <video src={`${API_BASE_URL}/main-data/asset/${mainDataDetail.another_file_1_url}`} className="col-10" controls />
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
                  <video src={`${API_BASE_URL}/main-data/asset/${mainDataDetail.another_file_2_url}`} className="col-10" controls />
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
                  <video src={`${API_BASE_URL}/main-data/asset/${mainDataDetail.another_file_3_url}`} className="col-10" controls />
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
                  <video src={`${API_BASE_URL}/main-data/asset/${mainDataDetail.another_file_4_url}`} className="col-10" controls />
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
                  <video src={`${API_BASE_URL}/main-data/asset/${mainDataDetail.another_file_5_url}`} className="col-10" controls />
                )}
              </div>
            )}
          </div>
        </CModalBody>
      </CModal>
      {assetName && (
        <div className="backdrop-asset-container">
          {assetName[0] === 'I' && <img src={`${API_BASE_URL}/main-data/asset/${assetName}`} style={{ height: '80%' }} />}
          <div
            className="backdrop-asset-bg"
            onClick={() => {
              setAssetName('');
            }}
          ></div>
        </div>
      )}
    </>
  );
}
