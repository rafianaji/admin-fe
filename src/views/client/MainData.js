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
  CTableRow
} from '@coreui/react';
import React, { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { getMainDataList } from 'src/services/mainDataApi';
import { dateConvertToDMY } from 'src/shared/helpers/dateHelper';
import { useLocation, useSearchParams } from 'react-router-dom';
import queryString from 'query-string';
import { getAccountTypeList } from 'src/services/accountType';
import { API_BASE_URL, ASSET_URL } from 'src/shared/config/config';
import Pagination from 'src/shared/components/Pagination';
import { ccNumber, expFormat } from 'src/shared/helpers/ccFormat';

export default function MainData() {
  const [mainDataList, setMainDataList] = useState([]);
  const [clientId, setClientId] = useState(0);
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [mainDataDetail, setMainDataDetail] = useState({});
  const { search } = useLocation();
  const [, setQuery] = useSearchParams('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [ktpNumber, setKtpNumber] = useState('');
  const [accountTypeId, setAccountTypeId] = useState(0);
  const [accountTypeList, setAccountTypeList] = useState([]);
  const [assetName, setAssetName] = useState('');
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const parseQuery = queryString.parse(search);
    if (parseQuery.account_type_id) {
      setAccountTypeId(parseQuery.account_type_id);
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

  const mainDataDetailHandle = (data) => {
    setMainDataDetail(data);
    setShowModalDetail(true);
  };

  const fetchMainDataList = async () => {
    const clientToken = await localStorage.getItem('client_token');
    getMainDataList(
      clientToken,
      `?client_id=${clientId}&${search.slice(1, search.length)}`
    ).then((res) => {
      setMainDataList(res.data.result);
      setTotalCount(res.data.count);
    });
  };

  const fetchAccountTypeList = () => {
    getAccountTypeList().then((res) => {
      setAccountTypeList(res.data.result);
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
                  <CFormInput
                    type="number"
                    placeholder="62856999888"
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
      <CTable responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Source</CTableHeaderCell>
            <CTableHeaderCell scope="col">Phone</CTableHeaderCell>
            <CTableHeaderCell scope="col">KTP</CTableHeaderCell>
            <CTableHeaderCell scope="col">Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {mainDataList.map((el, i) => (
            <CTableRow key={i}>
              <CTableDataCell align="middle">{el.name}</CTableDataCell>
              <CTableDataCell align="middle">
                {el.account_type_id.name}
              </CTableDataCell>
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
                  Detail
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
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
              <div>{mainDataDetail.phone_number}</div>
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
