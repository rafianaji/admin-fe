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
  CRow,
} from '@coreui/react';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAccountTypeList } from 'src/services/accountType';
import { checkDownlineCode } from 'src/services/downline';
import { createMainData } from 'src/services/mainDataApi';
import { ccNumber } from 'src/shared/helpers/ccFormat';
import * as yup from 'yup';
import NotFoundImage from 'src/assets/images/freepik-page-not-found.png';
import { toast } from 'react-hot-toast';

export default function Form() {
  const [walletType, setWalletType] = useState('rekening');
  const [accountTypeList, setAccountTypeList] = useState([]);
  const [downlineId, setDownlineId] = useState('');
  const [anotherFile1, setAnotherFile1] = useState();
  const [anotherFile2, setAnotherFile2] = useState();
  const [anotherFile3, setAnotherFile3] = useState();
  const [anotherFile4, setAnotherFile4] = useState();
  const [anotherFile5, setAnotherFile5] = useState();
  const [activePeriod, setActivePeriod] = useState('');
  const [remark, setRemark] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Modal
  const [uploadModalTitle, setUploadModalTitle] = useState('');
  const [uploadModalType, setUploadModalType] = useState('');
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploadPreview, setUploadPreview] = useState();

  const [errorForm, setErrorForm] = useState({});

  const [searchParams] = useSearchParams();
  const downline_code = searchParams.get('downline_code');

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
      ktp_number: yup.string().required('KTP is required').min(16, 'Min and Max is 16 digits').max(16, 'Min and Max is 16 digits'),
      kk_number: yup.string().required('KK is required').min(16, 'Min and Max is 16 digits').max(16, 'Min and Max is 16 digits'),
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
      transaction_password_acct: yup.string().required('Transaction Password is required'),
      username_ibanking: yup.string().required('Username Ibanking is required'),
      password_ibanking: yup.string().required('Password Ibanking is required'),
      pin_token_ibanking: yup.string().required('Pin Token Ibanking is required'),
    });
  } else {
    schema = yup.object().shape({
      is_rekening: yup.boolean(),
      wallet_type: yup.string(),
      name: yup.string().required('Name is required'),
      account_type_id: yup.string().required('Account Type is required'),
      phone_number: yup.string().required('Phone Number is required'),
      ktp_number: yup.string().required('KTP is required').min(16, 'Min and Max is 16 digits').max(16, 'Min and Max is 16 digits'),
      kk_number: yup.string().required('KK is required').min(16, 'Min and Max is 16 digits').max(16, 'Min and Max is 16 digits'),
      mother_name: yup.string().required('Mother Name is required'),
      full_ktp_address: yup.string().required('KTP Address is required'),
      email: yup.string().required('Email is required'),
      email_password: yup.string().required('Email Password is required'),
      pin: yup.string().required('PIN is required'),
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
      remark: '',
    },
    validationSchema: schema,
    onSubmit: () => {
      submitMainData();
    },
  });

  useEffect(() => {
    setErrorForm(formik.errors);
  }, [formik]);

  const walletTypeHandle = (type) => {
    setWalletType(type);
  };

  const fetchAccountType = () => {
    getAccountTypeList({ category: walletType }).then((res) => {
      setAccountTypeList(res.data);
    });
  };

  const fetchCheckDownline = () => {
    checkDownlineCode(downline_code)
      .then((res) => {
        setDownlineId(res?.data?.id);
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
      downline_id: downlineId,
      name: formik.values.name,
      // phone_number: formik.values.phone_number,
      ktp_number: formik.values.ktp_number,
      kk_number: formik.values.kk_number,
      mother_name: formik.values.mother_name,
      full_ktp_address: formik.values.full_ktp_address,
      bank_branch: formik.values.bank_branch,
      email: formik.values.email,
      email_password: formik.values.email_password,
      card_number: formik.values.card_number.replace(/\s/g, ''),
      exp_date: formik.values.exp_date,
      access_code: formik.values.access_code,
      mbanking_password: formik.values.mbanking_password,
      pin: formik.values.pin,
      username_acct: formik.values.username_acct,
      password_acct: formik.values.password_acct,
      transaction_password_acct: formik.values.transaction_password_acct,
      username_ibanking: formik.values.username_ibanking,
      password_ibanking: formik.values.password_ibanking,
      pin_token_ibanking: formik.values.pin_token_ibanking,
      ktp_photo_url: formik.values.ktp_photo_url,
      selfie_photo_url: formik.values.selfie_photo_url,
      video_verification_url: formik.values.video_verification_url,
      active_period: activePeriod,
      remark,
    };

    let isError = false;
    let phoneTemp = formik.values.phone_number;
    if (phoneTemp[0] == 0) {
      body.phone_number = '62' + phoneTemp.slice(1, phoneTemp.length);
    } else if (phoneTemp[0] == 8) {
      body.phone_number = '62' + phoneTemp;
    } else {
      isError = true;
      toast.error('Invalid phone number format');
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

    if (!isError) {
      createMainData(body).then(() => {});
    }
  };

  const clearErrorFormik = () => {
    formik.setErrors({});
    formik.setTouched({}, false);
  };

  return (
    <>
      {showForm ? (
        <div style={{ background: '#eef7ff' }} className="py-3">
          <CContainer style={{ width: '480px', background: 'white', borderRadius: '1em' }}>
            <div className="row justify-content-center">
              <CCol>
                <h4 className="text-center mt-4">DNA Form</h4>
                <CRow className="mt-4">
                  <CCol
                    style={{ borderRadius: 0 }}
                    className={`text-center p-3 border border-secondary border-start-0 ${walletType === 'rekening' ? 'btn btn-info border-0' : ''}`}
                    onClick={() => {
                      walletTypeHandle('rekening');
                      formik.setFieldValue('account_type_id', '');
                      clearErrorFormik();
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
                      walletTypeHandle('e-wallet');
                      formik.setFieldValue('account_type_id', '');
                      clearErrorFormik();
                    }}
                  >
                    E-Wallet
                  </CCol>
                </CRow>
                <CRow className="p-4">
                  <CForm>
                    <div className="mb-3">
                      <CFormLabel>Account Type</CFormLabel>
                      <CFormSelect
                        onChange={(e) => {
                          formik.setFieldValue('account_type_id', e.target.value);
                        }}
                      >
                        <option defaultChecked>Account Type</option>
                        {accountTypeList.map((el) => {
                          return (
                            <option key={el.id} value={el.id}>
                              {el.name}
                            </option>
                          );
                        })}
                      </CFormSelect>
                      <div className="text-danger text-sm">{errorForm.account_type_id}</div>
                    </div>
                    <div className="mb-3">
                      <CFormLabel>Name</CFormLabel>
                      <CFormInput
                        placeholder="Sumiyati"
                        required
                        onChange={(e) => {
                          formik.setFieldValue('name', e.target.value);
                        }}
                      />
                      <div className="text-danger text-sm">{errorForm.name}</div>
                    </div>
                    <div className="mb-3">
                      <CFormLabel>Phone Number</CFormLabel>
                      <CInputGroup>
                        <CInputGroupText className="bg-info">62</CInputGroupText>
                        <CFormInput
                          placeholder="856999888"
                          type="number"
                          required
                          onChange={(e) => {
                            formik.setFieldValue('phone_number', e.target.value);
                          }}
                        />
                      </CInputGroup>
                      <div className="text-danger text-sm">{errorForm.phone_number}</div>
                    </div>
                    <div className="d-flex">
                      <div className="mb-3 pe-2">
                        <CFormLabel>KTP Number</CFormLabel>
                        <CFormInput
                          placeholder="20101234567890123"
                          type="number"
                          required
                          onChange={(e) => {
                            formik.setFieldValue('ktp_number', e.target.value);
                          }}
                          max={16}
                        />
                        <div className="text-danger text-sm">{errorForm.ktp_number}</div>
                      </div>
                      <div className="mb-3 ps-2">
                        <CFormLabel>KK Number</CFormLabel>
                        <CFormInput
                          placeholder="20101234567890123"
                          type="number"
                          required
                          onChange={(e) => {
                            formik.setFieldValue('kk_number', e.target.value);
                          }}
                        />
                        <div className="text-danger text-sm">{errorForm.kk_number}</div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <CFormLabel>Mother Name</CFormLabel>
                      <CFormInput
                        placeholder="Madonna"
                        type="text"
                        required
                        onChange={(e) => {
                          formik.setFieldValue('mother_name', e.target.value);
                        }}
                      />
                      <div className="text-danger text-sm">{errorForm.mother_name}</div>
                    </div>
                    <div className="mb-3">
                      <CFormLabel>Full KTP Address</CFormLabel>
                      <CFormTextarea
                        placeholder="Jl. Pisang Raya No. 12 Jakarta Barat 002/003"
                        type="text"
                        required
                        onChange={(e) => {
                          formik.setFieldValue('full_ktp_address', e.target.value);
                        }}
                      />
                      <div className="text-danger text-sm">{errorForm.full_ktp_address}</div>
                    </div>
                    <div className="mb-3">
                      <CFormLabel>Bank Branch</CFormLabel>
                      <CFormInput
                        placeholder="Kab. Tangerang"
                        type="text"
                        required
                        onChange={(e) => {
                          formik.setFieldValue('bank_branch', e.target.value);
                        }}
                      />
                      <div className="text-danger text-sm">{errorForm.bank_branch}</div>
                    </div>
                    <div className="d-flex">
                      <div className="mb-3 pe-2">
                        <CFormLabel>Email</CFormLabel>
                        <CFormInput
                          placeholder="sumiyati@gmail.com"
                          type="email"
                          required
                          onChange={(e) => {
                            formik.setFieldValue('email', e.target.value);
                          }}
                        />
                        <div className="text-danger text-sm">{errorForm.email}</div>
                      </div>
                      <div className="mb-3 ps-2">
                        <CFormLabel>Email Password</CFormLabel>
                        <CFormInput
                          placeholder="Email Password"
                          type="text"
                          required
                          onChange={(e) => {
                            formik.setFieldValue('email_password', e.target.value);
                          }}
                        />
                        <div className="text-danger text-sm">{errorForm.email_password}</div>
                      </div>
                    </div>
                    {walletType == 'rekening' && (
                      <div className="d-flex">
                        <div className="mb-3 pe-2">
                          <CFormLabel>Card Number</CFormLabel>
                          <CFormInput
                            value={ccNumber(formik.values.card_number)}
                            placeholder="1234 1234 1234 1234"
                            type="text"
                            onChange={(e) => {
                              formik.setFieldValue('card_number', e.target.value);
                            }}
                            required
                          />
                          <div className="text-danger text-sm">{errorForm.card_number}</div>
                        </div>
                        <div className="mb-3 ps-2">
                          <CFormLabel>Exp Date</CFormLabel>
                          <CFormInput
                            placeholder="12/26"
                            type="text"
                            required
                            onChange={(e) => {
                              formik.setFieldValue('exp_date', e.target.value);
                            }}
                          />
                          <div className="text-danger text-sm">{errorForm.exp_date}</div>
                        </div>
                      </div>
                    )}
                    {walletType == 'rekening' && (
                      <div className="d-flex">
                        <div className="mb-3 pe-2">
                          <CFormLabel>Access Code</CFormLabel>
                          <CFormInput
                            placeholder="sumiyati99"
                            type="text"
                            required
                            onChange={(e) => {
                              formik.setFieldValue('access_code', e.target.value);
                            }}
                          />
                          <div className="text-danger text-sm">{errorForm.access_code}</div>
                        </div>
                        <div className="mb-3 ps-2">
                          <CFormLabel>Mbanking Password</CFormLabel>
                          <CFormInput
                            placeholder="sumiyaticantik123"
                            type="text"
                            required
                            onChange={(e) => {
                              formik.setFieldValue('mbanking_password', e.target.value);
                            }}
                          />
                          <div className="text-danger text-sm">{errorForm.mbanking_password}</div>
                        </div>
                      </div>
                    )}
                    <div className="mb-3">
                      <CFormLabel>Pin</CFormLabel>
                      <CFormInput
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
                            <CFormLabel>Username Acct</CFormLabel>
                            <CFormInput
                              placeholder="suminati2023"
                              type="text"
                              required
                              onChange={(e) => {
                                formik.setFieldValue('username_acct', e.target.value);
                              }}
                            />
                            <div className="text-danger text-sm">{errorForm.username_acct}</div>
                          </div>
                          <div className="mb-3 ps-2">
                            <CFormLabel>Password Acct</CFormLabel>
                            <CFormInput
                              placeholder="sumiyati0003"
                              type="text"
                              required
                              onChange={(e) => {
                                formik.setFieldValue('password_acct', e.target.value);
                              }}
                            />
                            <div className="text-danger text-sm">{errorForm.password_acct}</div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <CFormLabel>Transaction Password Acct</CFormLabel>
                          <CFormInput
                            placeholder="sumiatibca2023"
                            type="text"
                            required
                            onChange={(e) => {
                              formik.setFieldValue('transaction_password_acct', e.target.value);
                            }}
                          />
                          <div className="text-danger text-sm">{errorForm.transaction_password_acct}</div>
                        </div>
                        <div className="d-flex">
                          <div className="mb-3 pe-2">
                            <CFormLabel>Username Ibanking</CFormLabel>
                            <CFormInput
                              placeholder="sumsum1902"
                              type="text"
                              required
                              onChange={(e) => {
                                formik.setFieldValue('username_ibanking', e.target.value);
                              }}
                            />
                            <div className="text-danger text-sm">{errorForm.username_ibanking}</div>
                          </div>
                          <div className="mb-3 ps-2">
                            <CFormLabel>Password Ibanking</CFormLabel>
                            <CFormInput
                              placeholder="998899"
                              type="text"
                              required
                              onChange={(e) => {
                                formik.setFieldValue('password_ibanking', e.target.value);
                              }}
                            />
                            <div className="text-danger text-sm">{errorForm.password_ibanking}</div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <CFormLabel>Pin Token Ibanking</CFormLabel>
                          <CFormInput
                            placeholder="2309293"
                            type="text"
                            required
                            onChange={(e) => {
                              formik.setFieldValue('pin_token_ibanking', e.target.value);
                            }}
                          />
                          <div className="text-danger text-sm">{errorForm.pin_token_ibanking}</div>
                        </div>
                      </>
                    )}
                    <div className="mb-3">
                      <CFormLabel>Active Period</CFormLabel>
                      <CFormInput
                        placeholder="Active Period"
                        type="date"
                        required
                        onChange={(e) => {
                          setActivePeriod(e.target.value);
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <CFormLabel>Remark</CFormLabel>
                      <CFormTextarea
                        required
                        onChange={(e) => {
                          setRemark(e.target.value);
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <CRow>
                        <CCol>
                          <CFormLabel>Photo KTP</CFormLabel>
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
                          <div className="text-danger text-sm">{errorForm.ktp_photo_url}</div>
                        </CCol>
                        <CCol>
                          <CFormLabel>Selfie Photo KTP</CFormLabel>
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
                      <CFormLabel>Video Verification</CFormLabel>
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
                        onChange={(e) => {
                          setAnotherFile1(e.currentTarget.files[0]);
                        }}
                      />
                    </div>
                    {anotherFile1 && (
                      <div className="mb-3">
                        <CFormLabel>Another File URL 2</CFormLabel>
                        <br />
                        <input
                          type="file"
                          onChange={(e) => {
                            setAnotherFile2(e.currentTarget.files[0]);
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
                          onChange={(e) => {
                            setAnotherFile3(e.currentTarget.files[0]);
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
                          onChange={(e) => {
                            setAnotherFile4(e.currentTarget.files[0]);
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
                          onChange={(e) => {
                            setAnotherFile5(e.currentTarget.files[0]);
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
              <CModal backdrop="static" visible={uploadModalVisible} onClose={() => setUploadModalVisible(false)}>
                <CModalHeader>
                  <CModalTitle>{uploadModalTitle}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  {uploadPreview && <img src={URL.createObjectURL(uploadPreview)} width={300} />}
                  {uploadPreview && <br />}
                  <input
                    className="mt-3"
                    type="file"
                    accept={uploadModalType === 'photo_ktp' ? 'image/*' : uploadModalType === 'selfie_photo_ktp' ? 'image/*' : 'video/*'}
                    onChange={(e) => {
                      if (uploadModalType === 'photo_ktp') {
                        formik.setFieldValue('ktp_photo_url', e.currentTarget.files[0]);
                        setUploadPreview(e.currentTarget.files[0]);
                      } else if (uploadModalType === 'selfie_photo_ktp') {
                        formik.setFieldValue('selfie_photo_url', e.currentTarget.files[0]);
                        setUploadPreview(e.currentTarget.files[0]);
                      } else if (uploadModalType === 'video_verification') {
                        formik.setFieldValue('video_verification_url', e.currentTarget.files[0]);
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
        <div className="d-flex justify-content-center">
          <img src={NotFoundImage} style={{ width: 'auto', height: '100vh' }} alt="Designed by freepik" title="Designed by freepik" />
        </div>
      )}
    </>
  );
}
