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
  CRow
} from '@coreui/react';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { getAccountTypeList } from 'src/services/accountType';
import { checkDownlineCode } from 'src/services/downline';
import {
  createMainData,
  getMainDataDetail,
  updateMainData
} from 'src/services/mainDataApi';
import { ccNumber, expFormat } from 'src/shared/helpers/ccFormat';
import * as yup from 'yup';
import NotFoundImage from 'src/assets/images/page-not-found.jpg';
import { dateConvertToYMD } from 'src/shared/helpers/dateHelper';

export default function Form() {
  const [walletType, setWalletType] = useState('rekening');
  const [accountTypeList, setAccountTypeList] = useState([]);
  const [anotherFile1, setAnotherFile1] = useState();
  const [anotherFile2, setAnotherFile2] = useState();
  const [anotherFile3, setAnotherFile3] = useState();
  const [anotherFile4, setAnotherFile4] = useState();
  const [anotherFile5, setAnotherFile5] = useState();
  const [activePeriod, setActivePeriod] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Modal
  const [uploadModalTitle, setUploadModalTitle] = useState('');
  const [uploadModalType, setUploadModalType] = useState('');
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploadPreview, setUploadPreview] = useState();

  const [errorForm, setErrorForm] = useState({});

  const [searchParams] = useSearchParams();
  const downline_code = searchParams.get('downline_code');
  const edit = searchParams.get('edit');
  const mainDataId = searchParams.get('main_data_id');
  const { state } = useLocation();
  const navigate = useNavigate();

  let schema = yup.object().shape({});

  if (walletType === 'rekening') {
    schema = yup.object().shape({
      is_rekening: yup.boolean(),
      wallet_type: yup.string(),
      name: yup.string().required('Name is required'),
      account_type_id: yup.string().required('Account Type is required'),
      phone_number: yup
        .string()
        .required('Phone Number is required')
        .min(8, 'Phone number must be valid and contain 8 - 13 digits')
        .max(13, 'Phone number must be valid and contain 8 - 13 digits'),
      ktp_number: yup.string().required('KTP is required'),
      kk_number: yup.string().required('KK is required'),
      mother_name: yup.string().required('Mother Name is required'),
      full_ktp_address: yup.string().required('KTP Address is required'),
      bank_branch: yup.string().required('Bank branch is required'),
      email: yup.string().required('Email is required'),
      email_password: yup.string().required('Email Password is required'),
      card_number: yup.string().required('Card Number is required'),
      exp_date: yup.string().required('Exp Date is required'),
      access_code: yup.string().required('Access Code is required'),
      mbanking_password: yup.string().required('Mbanking Password is required'),
      pin: yup.string().required('PIN is required'),
      username_acct: yup.string().required('Username Acct is required'),
      password_acct: yup.string().required('Password Acct is required'),
      transaction_password_acct: yup
        .string()
        .required('Transaction Password is required'),
      username_ibanking: yup.string().required('Username Ibanking is required'),
      password_ibanking: yup.string().required('Password Ibanking is required')
    });
  } else {
    schema = yup.object().shape({
      is_rekening: yup.boolean(),
      wallet_type: yup.string(),
      name: yup.string().required('Name is required'),
      account_type_id: yup.string().required('Account Type is required'),
      phone_number: yup.string().required('Phone Number is required'),
      ktp_number: yup.string().required('KTP is required'),
      kk_number: yup.string().required('KK is required'),
      mother_name: yup.string().required('Mother Name is required'),
      email: yup.string().required('Email is required'),
      email_password: yup.string().required('Email Password is required'),
      pin: yup.string().required('PIN is required')
    });
  }

  const formik = useFormik({
    initialValues: {
      account_type_id: '',
      name: '',
      phone_number: '',
      ktp_number: '',
      kk_number: '',
      mother_name: '',
      full_ktp_address: '',
      bank_branch: '',
      email: '',
      email_password: '',
      card_number: '',
      exp_date: '',
      access_code: '',
      mbanking_password: '',
      pin: '',
      username_acct: '',
      password_acct: '',
      transaction_password_acct: '',
      username_ibanking: '',
      password_ibanking: '',
      pin_token_ibanking: '',
      ktp_photo_url: {},
      selfie_photo_url: {},
      video_verification_url: {},
      active_period: '',
      remark: ''
    },
    validationSchema: schema,
    onSubmit: () => {
      submitMainData();
    }
  });

  useEffect(() => {
    if (Object.keys(formik.errors).length > 0 && formik.isSubmitting) {
      setErrorForm(formik.errors);
    }
  }, [formik]);

  const walletTypeHandle = (type) => {
    setWalletType(type);
  };

  const fetchAccountType = () => {
    getAccountTypeList({ category: walletType }).then((res) => {
      setAccountTypeList(res.data.result);
    });
  };

  const fetchCheckDownline = () => {
    checkDownlineCode(downline_code)
      .then((res) => {
        setShowForm(true);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchAccountType();
  }, [walletType]);

  useEffect(() => {
    if (downline_code) {
      fetchCheckDownline();
    }
  }, [downline_code]);

  const submitMainData = () => {
    const body = {
      account_type_id: formik.values.account_type_id,
      name: formik.values.name,
      phone_number: formik.values.phone_number,
      ktp_number: formik.values.ktp_number,
      kk_number: formik.values.kk_number,
      mother_name: formik.values.mother_name,
      full_ktp_address: formik.values.full_ktp_address,
      bank_branch: formik.values.bank_branch,
      email: formik.values.email,
      email_password: formik.values.email_password,
      card_number: formik.values.card_number.replace(/\s/g, ''),
      exp_date: formik.values.exp_date
        ? formik.values.exp_date.split('/').join('')
        : '',
      access_code: formik.values.access_code,
      mbanking_password: formik.values.mbanking_password,
      pin: formik.values.pin,
      username_acct: formik.values.username_acct,
      password_acct: formik.values.password_acct,
      transaction_password_acct: formik.values.transaction_password_acct,
      username_ibanking: formik.values.username_ibanking,
      password_ibanking: formik.values.password_ibanking,
      pin_token_ibanking: formik.values.pin_token_ibanking,
      active_period: activePeriod,
      remark: formik.values.remark
    };

    let isError = false;

    if (formik.values.ktp_photo_url) {
      body.ktp_photo_url = formik.values.ktp_photo_url;
    }
    if (formik.values.selfie_photo_url) {
      body.selfie_photo_url = formik.values.selfie_photo_url;
    }
    if (formik.values.video_verification_url) {
      body.video_verification_url = formik.values.video_verification_url;
    }
    if (anotherFile1) {
      body.another_file_1_url = anotherFile1;
    }
    if (anotherFile2) {
      body.another_file_2_url = anotherFile2;
    }
    if (anotherFile3) {
      body.another_file_3_url = anotherFile3;
    }
    if (anotherFile4) {
      body.another_file_4_url = anotherFile4;
    }
    if (anotherFile5) {
      body.another_file_5_url = anotherFile5;
    }

    if (!isError && !edit) {
      createMainData(downline_code, body).then(() => {});
    } else if (!isError && edit) {
      body.status = 'waiting';
      updateMainData(mainDataId ? mainDataId : state.id, body).then((res) => {
        navigate('/admin/main-data');
      });
    }
  };

  const clearErrorFormik = () => {
    formik.setErrors({});
    formik.setTouched({}, false);
  };

  const fetchDetailMainData = () => {
    getMainDataDetail(mainDataId)
      .then((res) => {
        const data = res.data;
        formik.setValues(data.result);
        setWalletType(data.result.account_type_id.category);
        formik.setFieldValue('account_type_id', data.result.account_type_id.id);
        formik.setFieldValue('ktp_photo_url', '');
        formik.setFieldValue('selfie_photo_url', '');
        formik.setFieldValue('video_verification_url', '');
        formik.setFieldValue('card_number', data.result.card_number);
        setActivePeriod(dateConvertToYMD(data.result.active_period));
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (mainDataId && edit) {
      fetchDetailMainData();
    }
  }, [edit, mainDataId]);

  return (
    <>
      {showForm ? (
        <div style={{ background: '#eef7ff' }} className="py-3">
          <CContainer
            style={{ width: '480px', background: 'white', borderRadius: '1em' }}
          >
            <div className="row justify-content-center">
              <CCol>
                <h4 className="text-center mt-4">DNA Form</h4>
                <CRow className="mt-4">
                  <CCol
                    style={{ borderRadius: 0 }}
                    className={`text-center p-3 border border-secondary border-start-0 ${
                      walletType === 'rekening' ? 'btn btn-info border-0' : ''
                    }`}
                    onClick={() => {
                      if (!edit && !mainDataId) {
                        walletTypeHandle('rekening');
                        formik.setFieldValue('account_type_id', '');
                        clearErrorFormik();
                      }
                    }}
                  >
                    Rekening
                  </CCol>
                  <CCol
                    style={{ borderRadius: 0 }}
                    className={`text-center p-3 border border-secondary border-end-0 border-start-0 ${
                      walletType === 'e-wallet' ? 'btn btn-info r border-0' : ''
                    }`}
                    onClick={() => {
                      if (!edit && !mainDataId) {
                        walletTypeHandle('e-wallet');
                        formik.setFieldValue('account_type_id', '');
                        clearErrorFormik();
                      }
                    }}
                  >
                    E-Wallet
                  </CCol>
                </CRow>
                <CRow className="p-4">
                  <CForm>
                    <div className="mb-3">
                      <CFormLabel>
                        Akun Tipe <span className="text-danger">*</span>
                      </CFormLabel>
                      <CFormSelect
                        value={formik.values.account_type_id}
                        onChange={(e) => {
                          formik.setFieldValue(
                            'account_type_id',
                            e.target.value
                          );
                        }}
                      >
                        <option defaultChecked>Akun Tipe</option>
                        {accountTypeList.map((el) => {
                          return (
                            <option key={el.id} value={el.id}>
                              {el.name}
                            </option>
                          );
                        })}
                      </CFormSelect>
                      <div className="text-danger text-sm">
                        {errorForm.account_type_id}
                      </div>
                    </div>
                    <div className="mb-3">
                      <CFormLabel>
                        Nama <span className="text-danger">*</span>
                      </CFormLabel>
                      <CFormInput
                        placeholder="Sumiyati"
                        value={formik.values.name}
                        required
                        onChange={(e) => {
                          formik.setFieldValue('name', e.target.value);
                        }}
                      />
                      <div className="text-danger text-sm">
                        {errorForm.name}
                      </div>
                    </div>
                    <div className="mb-3">
                      <CFormLabel>
                        Nomor Hp <span className="text-danger">*</span>
                      </CFormLabel>
                      <CInputGroup>
                        {/* <CInputGroupText className="bg-info">
                          62
                        </CInputGroupText> */}
                        <CFormInput
                          placeholder="0856999888"
                          type="text"
                          required
                          value={formik.values.phone_number}
                          onChange={(e) => {
                            formik.setFieldValue(
                              'phone_number',
                              e.target.value
                            );
                          }}
                        />
                      </CInputGroup>
                      <div className="text-danger text-sm">
                        {errorForm.phone_number}
                      </div>
                    </div>
                    <div className="d-flex">
                      <div className="mb-3 pe-2">
                        <CFormLabel>
                          Nomor KTP <span className="text-danger">*</span>
                        </CFormLabel>
                        <CFormInput
                          value={formik.values.ktp_number}
                          placeholder="20101234567890123"
                          type="number"
                          required
                          onChange={(e) => {
                            formik.setFieldValue('ktp_number', e.target.value);
                          }}
                          max={16}
                        />
                        <div className="text-danger text-sm">
                          {errorForm.ktp_number}
                        </div>
                      </div>
                      <div className="mb-3 ps-2">
                        <CFormLabel>
                          Nomor KK <span className="text-danger">*</span>
                        </CFormLabel>
                        <CFormInput
                          value={formik.values.kk_number}
                          placeholder="20101234567890123"
                          type="number"
                          required
                          onChange={(e) => {
                            formik.setFieldValue('kk_number', e.target.value);
                          }}
                        />
                        <div className="text-danger text-sm">
                          {errorForm.kk_number}
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <CFormLabel>
                        Nama Ibu <span className="text-danger">*</span>
                      </CFormLabel>
                      <CFormInput
                        value={formik.values.mother_name}
                        placeholder="Madonna"
                        type="text"
                        required
                        onChange={(e) => {
                          formik.setFieldValue('mother_name', e.target.value);
                        }}
                      />
                      <div className="text-danger text-sm">
                        {errorForm.mother_name}
                      </div>
                    </div>
                    {walletType == 'rekening' && (
                      <div className="mb-3">
                        <CFormLabel>
                          Alamat KTP <span className="text-danger">*</span>
                        </CFormLabel>
                        <CFormTextarea
                          value={formik.values.full_ktp_address}
                          placeholder="Jl. Pisang Raya No. 12 Jakarta Barat 002/003"
                          type="text"
                          required
                          onChange={(e) => {
                            formik.setFieldValue(
                              'full_ktp_address',
                              e.target.value
                            );
                          }}
                        />
                        <div className="text-danger text-sm">
                          {errorForm.full_ktp_address}
                        </div>
                      </div>
                    )}
                    {walletType == 'rekening' && (
                      <div className="mb-3">
                        <CFormLabel>
                          Bank Cabang <span className="text-danger">*</span>
                        </CFormLabel>
                        <CFormInput
                          value={formik.values.bank_branch}
                          placeholder="Kab. Tangerang"
                          type="text"
                          required
                          onChange={(e) => {
                            formik.setFieldValue('bank_branch', e.target.value);
                          }}
                        />
                        <div className="text-danger text-sm">
                          {errorForm.bank_branch}
                        </div>
                      </div>
                    )}
                    <div className="d-flex">
                      <div className="mb-3 pe-2">
                        <CFormLabel>
                          Email <span className="text-danger">*</span>
                        </CFormLabel>
                        <CFormInput
                          value={formik.values.email}
                          placeholder="sumiyati@gmail.com"
                          type="email"
                          required
                          onChange={(e) => {
                            formik.setFieldValue('email', e.target.value);
                          }}
                        />
                        <div className="text-danger text-sm">
                          {errorForm.email}
                        </div>
                      </div>
                      <div className="mb-3 ps-2">
                        <CFormLabel>
                          Kata Sandi Email{' '}
                          <span className="text-danger">*</span>
                        </CFormLabel>
                        <CFormInput
                          value={formik.values.email_password}
                          placeholder="Kata Sandi Email"
                          type="text"
                          required
                          onChange={(e) => {
                            formik.setFieldValue(
                              'email_password',
                              e.target.value
                            );
                          }}
                        />
                        <div className="text-danger text-sm">
                          {errorForm.email_password}
                        </div>
                      </div>
                    </div>
                    {walletType == 'rekening' && (
                      <div className="d-flex">
                        <div className="mb-3 pe-2">
                          <CFormLabel>
                            Nomor Kartu <span className="text-danger">*</span>
                          </CFormLabel>
                          <CFormInput
                            value={ccNumber(formik.values.card_number)}
                            placeholder="1234 1234 1234 1234"
                            type="text"
                            onChange={(e) => {
                              formik.setFieldValue(
                                'card_number',
                                e.target.value
                              );
                            }}
                            required
                          />
                          <div className="text-danger text-sm">
                            {errorForm.card_number}
                          </div>
                        </div>
                        <div className="mb-3 ps-2">
                          <CFormLabel>
                            Tanggal Kadaluarsa{' '}
                            <span className="text-danger">*</span>
                          </CFormLabel>
                          <CFormInput
                            value={expFormat(formik.values.exp_date)}
                            placeholder="12/26"
                            maxLength={5}
                            type="text"
                            required
                            onChange={(e) => {
                              formik.setFieldValue('exp_date', e.target.value);
                            }}
                          />
                          <div className="text-danger text-sm">
                            {errorForm.exp_date}
                          </div>
                        </div>
                      </div>
                    )}
                    {walletType == 'rekening' && (
                      <div className="d-flex">
                        <div className="mb-3 pe-2">
                          <CFormLabel>
                            Akses Kode <span className="text-danger">*</span>
                          </CFormLabel>
                          <CFormInput
                            value={formik.values.access_code}
                            placeholder="sumiyati99"
                            type="text"
                            required
                            onChange={(e) => {
                              formik.setFieldValue(
                                'access_code',
                                e.target.value
                              );
                            }}
                          />
                          <div className="text-danger text-sm">
                            {errorForm.access_code}
                          </div>
                        </div>
                        <div className="mb-3 ps-2">
                          <CFormLabel>
                            Kata Sandi MBanking{' '}
                            <span className="text-danger">*</span>
                          </CFormLabel>
                          <CFormInput
                            value={formik.values.mbanking_password}
                            placeholder="sumiyaticantik123"
                            type="text"
                            required
                            onChange={(e) => {
                              formik.setFieldValue(
                                'mbanking_password',
                                e.target.value
                              );
                            }}
                          />
                          <div className="text-danger text-sm">
                            {errorForm.mbanking_password}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="mb-3">
                      <CFormLabel>
                        PIN {walletType == 'rekening' && 'ATM'}{' '}
                        <span className="text-danger">*</span>
                      </CFormLabel>
                      <CFormInput
                        value={formik.values.pin}
                        placeholder="123456"
                        type="number"
                        required
                        onChange={(e) => {
                          formik.setFieldValue('pin', e.target.value);
                        }}
                      />
                      <div className="text-danger text-sm">{errorForm.pin}</div>
                    </div>
                    {walletType == 'rekening' && (
                      <>
                        <div className="d-flex">
                          <div className="mb-3 pe-2">
                            <CFormLabel>
                              Username <span className="text-danger">*</span>
                            </CFormLabel>
                            <CFormInput
                              value={formik.values.username_acct}
                              placeholder="suminati2023"
                              type="text"
                              required
                              onChange={(e) => {
                                formik.setFieldValue(
                                  'username_acct',
                                  e.target.value
                                );
                              }}
                            />
                            <div style={{ fontSize: '0.7em' }}>
                              MyBCA, Livin, Brimo, Dll
                            </div>
                            <div className="text-danger text-sm">
                              {errorForm.username_acct}
                            </div>
                          </div>
                          <div className="mb-3 ps-2">
                            <CFormLabel>
                              Password <span className="text-danger">*</span>
                            </CFormLabel>
                            <CFormInput
                              value={formik.values.password_acct}
                              placeholder="sumiyati0003"
                              type="text"
                              required
                              onChange={(e) => {
                                formik.setFieldValue(
                                  'password_acct',
                                  e.target.value
                                );
                              }}
                            />
                            <div className="text-danger text-sm">
                              {errorForm.password_acct}
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <CFormLabel>
                            PIN Transaksi <span className="text-danger">*</span>
                          </CFormLabel>
                          <CFormInput
                            value={formik.values.transaction_password_acct}
                            placeholder="sumiatibca2023"
                            type="text"
                            required
                            onChange={(e) => {
                              formik.setFieldValue(
                                'transaction_password_acct',
                                e.target.value
                              );
                            }}
                          />
                          <div className="text-danger text-sm">
                            {errorForm.transaction_password_acct}
                          </div>
                        </div>
                        <div className="d-flex">
                          <div className="mb-3 pe-2">
                            <CFormLabel>
                              Nama di iBanking{' '}
                              <span className="text-danger">*</span>
                            </CFormLabel>
                            <CFormInput
                              value={formik.values.username_ibanking}
                              placeholder="sumsum1902"
                              type="text"
                              required
                              onChange={(e) => {
                                formik.setFieldValue(
                                  'username_ibanking',
                                  e.target.value
                                );
                              }}
                            />
                            <div className="text-danger text-sm">
                              {errorForm.username_ibanking}
                            </div>
                          </div>
                          <div className="mb-3 ps-2">
                            <CFormLabel>
                              Kata Sandi iBanking{' '}
                              <span className="text-danger">*</span>
                            </CFormLabel>
                            <CFormInput
                              value={formik.values.password_ibanking}
                              placeholder="998899"
                              type="text"
                              onChange={(e) => {
                                formik.setFieldValue(
                                  'password_ibanking',
                                  e.target.value
                                );
                              }}
                            />
                            <div className="text-danger text-sm">
                              {errorForm.password_ibanking}
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <CFormLabel>PIN Token iBanking</CFormLabel>
                          <CFormInput
                            value={formik.values.pin_token_ibanking}
                            placeholder="2309293"
                            type="text"
                            required
                            onChange={(e) => {
                              formik.setFieldValue(
                                'pin_token_ibanking',
                                e.target.value
                              );
                            }}
                          />
                          <div className="text-danger text-sm">
                            {errorForm.pin_token_ibanking}
                          </div>
                        </div>
                      </>
                    )}
                    <div className="mb-3">
                      <CFormLabel>Masa Aktif</CFormLabel>
                      <CFormInput
                        value={dateConvertToYMD(activePeriod)}
                        placeholder="Masa Aktif"
                        type="date"
                        required
                        onChange={(e) => {
                          setActivePeriod(e.target.value);
                          // formik.setFieldValue(
                          //   'active_period',
                          //   formik.values.active_period
                          // );
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <CFormLabel>Tambahan</CFormLabel>
                      <CFormTextarea
                        value={formik.values.remark}
                        onChange={(e) => {
                          formik.setFieldValue('remark', e.target.value);
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <CRow>
                        <CCol>
                          <CFormLabel>
                            Photo KTP <span className="text-danger">*</span>
                          </CFormLabel>
                          <br />
                          <CButton
                            className="btn btn-info  full-width"
                            onClick={() => {
                              setUploadModalVisible(true);
                              setUploadModalType('photo_ktp');
                              setUploadPreview();
                              setUploadModalTitle('Photo KTP');
                            }}
                          >
                            Upload
                          </CButton>
                          <div className="text-danger text-sm">
                            {errorForm.ktp_photo_url}
                          </div>
                        </CCol>
                        <CCol>
                          <CFormLabel>
                            Selfie Photo KTP{' '}
                            <span className="text-danger">*</span>
                          </CFormLabel>
                          <CButton
                            className="btn btn-info full-width"
                            onClick={() => {
                              setUploadModalVisible(true);
                              setUploadModalType('selfie_photo_ktp');
                              setUploadPreview();
                              setUploadModalTitle('Selfie Photo KTP');
                            }}
                          >
                            Upload
                          </CButton>
                        </CCol>
                      </CRow>
                    </div>
                    <div className="mb-3">
                      <CFormLabel>
                        Video Verification{' '}
                        <span className="text-danger">*</span>
                      </CFormLabel>
                      <CButton
                        className="btn btn-info  full-width"
                        onClick={() => {
                          setUploadModalVisible(true);
                          setUploadModalType('video_verification');
                          setUploadPreview();
                          setUploadModalTitle('Video Verification');
                        }}
                      >
                        Upload
                      </CButton>
                    </div>
                    <div className="mb-3">
                      <CFormLabel>Another File URL 1</CFormLabel>
                      <br />
                      <input
                        type="file"
                        accept={'image/*,video/*'}
                        onChange={(e) => {
                          if (e.currentTarget.files[0]) {
                            setAnotherFile1(e.currentTarget.files[0]);
                          }
                        }}
                      />
                    </div>
                    {anotherFile1 && (
                      <div className="mb-3">
                        <CFormLabel>Another File URL 2</CFormLabel>
                        <br />
                        <input
                          type="file"
                          accept={'image/*,video/*'}
                          onChange={(e) => {
                            if (e.currentTarget.files[0]) {
                              setAnotherFile2(e.currentTarget.files[0]);
                            }
                          }}
                        />
                      </div>
                    )}
                    {anotherFile2 && (
                      <div className="mb-3">
                        <CFormLabel>Another File URL 3</CFormLabel>
                        <br />
                        <input
                          type="file"
                          accept={'image/*,video/*'}
                          onChange={(e) => {
                            if (e.currentTarget.files[0]) {
                              setAnotherFile3(e.currentTarget.files[0]);
                            }
                          }}
                        />
                      </div>
                    )}
                    {anotherFile3 && (
                      <div className="mb-3">
                        <CFormLabel>Another File URL 4</CFormLabel>
                        <br />
                        <input
                          type="file"
                          accept={'image/*,video/*'}
                          onChange={(e) => {
                            if (e.currentTarget.files[0]) {
                              setAnotherFile4(e.currentTarget.files[0]);
                            }
                          }}
                        />
                      </div>
                    )}
                    {anotherFile4 && (
                      <div className="mb-3">
                        <CFormLabel>Another File URL 5</CFormLabel>
                        <br />
                        <input
                          type="file"
                          accept={'image/*,video/*'}
                          onChange={(e) => {
                            if (e.currentTarget.files[0]) {
                              setAnotherFile5(e.currentTarget.files[0]);
                            }
                          }}
                        />
                      </div>
                    )}
                    <div className="mt-5">
                      <CButton
                        className="btn btn-info full-width"
                        onClick={() => {
                          formik.handleSubmit();
                        }}
                      >
                        Save
                      </CButton>
                    </div>
                  </CForm>
                </CRow>
              </CCol>
              <CModal
                backdrop="static"
                visible={uploadModalVisible}
                onClose={() => setUploadModalVisible(false)}
              >
                <CModalHeader>
                  <CModalTitle>{uploadModalTitle}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  {uploadPreview && (
                    <img src={URL.createObjectURL(uploadPreview)} width={300} />
                  )}
                  {uploadPreview && <br />}
                  <input
                    className="mt-3"
                    type="file"
                    accept={
                      uploadModalType === 'photo_ktp'
                        ? 'image/*'
                        : uploadModalType === 'selfie_photo_ktp'
                        ? 'image/*'
                        : 'video/*'
                    }
                    onChange={(e) => {
                      if (uploadModalType === 'photo_ktp') {
                        formik.setFieldValue(
                          'ktp_photo_url',
                          e.currentTarget.files[0]
                        );
                        setUploadPreview(e.currentTarget.files[0]);
                      } else if (uploadModalType === 'selfie_photo_ktp') {
                        formik.setFieldValue(
                          'selfie_photo_url',
                          e.currentTarget.files[0]
                        );
                        setUploadPreview(e.currentTarget.files[0]);
                      } else if (uploadModalType === 'video_verification') {
                        formik.setFieldValue(
                          'video_verification_url',
                          e.currentTarget.files[0]
                        );
                      }
                    }}
                  />
                </CModalBody>
                <CModalFooter>
                  <CButton
                    color="btn btn-primary"
                    onClick={() => {
                      setUploadModalVisible(false);
                    }}
                  >
                    Save changes
                  </CButton>
                </CModalFooter>
              </CModal>
            </div>
          </CContainer>
        </div>
      ) : (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: '100vh' }}
        >
          <img
            src={NotFoundImage}
            className="page-not-found-image"
            // style={{ width: 'auto', height: '100vh' }}
            // alt="Designed by freepik"
            // title="Designed by freepik"
          />
        </div>
      )}
    </>
  );
}
