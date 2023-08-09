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
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { getAccountTypeList } from 'src/services/accountType'
import { ccNumber } from 'src/shared/helpers/ccFormat'

export default function Form() {
  const [walletType, setWalletType] = useState('rekening')
  const [accountTypeList, setAccountTypeList] = useState([])
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [ktpNumber, setKtpNumber] = useState('')
  const [kkNumber, setKkNumber] = useState('')
  const [motheName, setMotherName] = useState('')
  const [fullKtpAddress, setFullKtpAddress] = useState('')
  const [bankBranch, setBankBranch] = useState('')
  const [email, setEmail] = useState('')
  const [emailPassword, setEmailPassword] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expDate, setExpDate] = useState('')
  const [accessCode, setAccessCode] = useState('')
  const [mbankingPassword, setMbankingPassword] = useState('')
  const [pin, setPin] = useState('')
  const [usernameAcct, setUsernameAcct] = useState('')
  const [passwordAcct, setPasswordAcct] = useState('')
  const [transactionPasswordAcct, setTransactionPasswordAcct] = useState('')
  const [usernameIbanking, setUsernameIbanking] = useState('')
  const [passwordIbanking, setPasswordIbanking] = useState('')
  const [pinTokenIbanking, setPinTokenIbanking] = useState('')
  const [photoKtpFile, setPhotoKtpFile] = useState({})
  const [photoSelfieFile, setPhotoSelfieFile] = useState({})
  const [videoVerificationFile, setVideoVerificationFile] = useState({})
  const [anotherFile1, setAnotherFile1] = useState({})
  const [anotherFile2, setAnotherFile2] = useState({})
  const [anotherFile3, setAnotherFile3] = useState({})
  const [anotherFile4, setAnotherFile4] = useState({})
  const [anotherFile5, setAnotherFile5] = useState({})

  // Modal
  const [uploadModalTitle, setUploadModalTitle] = useState('')
  const [uploadModalType, setUploadModalType] = useState('')
  const [uploadModalVisible, setUploadModalVisible] = useState(false)
  const [imageUploadPreview, setImageUploadPreview] = useState()

  const walletTypeHandle = (type) => {
    setWalletType(type)
  }

  const fetchAccountType = () => {
    getAccountTypeList({ type: walletType }).then((res) => {
      setAccountTypeList(res.data)
    })
  }

  useEffect(() => {
    fetchAccountType()
  }, [])

  const submitMainData = () => {
    const body = {
      name,
      phone_number: phoneNumber,
      ktp_number: ktpNumber,
      kk_number: kkNumber,
      mother_name: motheName,
      full_ktp_address: fullKtpAddress,
      bank_branch: bankBranch,
      email,
      email_password: emailPassword,
      exp_date: expDate,
      access_code: accessCode,
      mbanking_password: mbankingPassword,
      pin,
      username_acct: usernameAcct,
      password_acct: passwordAcct,
      transaction_password_acct: transactionPasswordAcct,
      username_ibanking: usernameIbanking,
      password_ibanking: passwordIbanking,
      pin_token_mbanking: pinTokenIbanking,
      // photo_ktp_file: photoKtpFile,
    }

    console.log(body, '<<< body')
  }

  return (
    <>
      <CContainer style={{ width: '480px', backgroundColor: 'rgb(242,242,242)' }}>
        <div className="row justify-content-center">
          <CCol>
            <h4 className="text-center mt-3">DNA Form</h4>
            <CRow className="mt-3">
              <CCol
                className={`text-center p-3 border border-dark ${
                  walletType === 'rekening' ? 'primary-font-color primary-bg-color border-0' : ''
                }`}
                onClick={() => {
                  walletTypeHandle('rekening')
                }}
              >
                Rekening
              </CCol>
              <CCol
                className={`text-center p-3 border border-dark border-start-0 ${
                  walletType === 'e-wallet' ? 'primary-bg-color primary-bg-color border-0' : ''
                }`}
                onClick={() => {
                  walletTypeHandle('e-wallet')
                }}
              >
                E-Wallet
              </CCol>
            </CRow>
            <CRow className="p-4">
              <CForm>
                <div className="mb-3">
                  <CFormLabel>Account Type</CFormLabel>
                  <CFormSelect>
                    {accountTypeList.map((el) => {
                      return (
                        <option key={el.id} value={el.id}>
                          {el.name}
                        </option>
                      )
                    })}
                  </CFormSelect>
                </div>
                <div className="mb-3">
                  <CFormLabel>Name</CFormLabel>
                  <CFormInput
                    placeholder="Name"
                    required
                    onChange={(e) => {
                      setName(e.target.value)
                    }}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel>Phone Number</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText className="primary-bg-color primary-font-color">
                      62
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Phone Number"
                      type="number"
                      required
                      onChange={(e) => {
                        setPhoneNumber(e.target.value)
                      }}
                    />
                  </CInputGroup>
                </div>
                <div className="mb-3">
                  <CFormLabel>KTP Number</CFormLabel>
                  <CFormInput
                    placeholder="KTP Number"
                    type="number"
                    required
                    onChange={(e) => {
                      setKtpNumber(e.target.value)
                    }}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel>KK Number</CFormLabel>
                  <CFormInput
                    placeholder="KK Number"
                    type="number"
                    required
                    onChange={(e) => {
                      setKkNumber(e.target.value)
                    }}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel>Mother Name</CFormLabel>
                  <CFormInput
                    placeholder="Mother Name"
                    type="text"
                    required
                    onChange={(e) => {
                      setMotherName(e.target.value)
                    }}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel>Full KTP Address</CFormLabel>
                  <CFormTextarea
                    placeholder="Full KTP Address"
                    type="text"
                    required
                    onChange={(e) => {
                      setFullKtpAddress(e.target.value)
                    }}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel>Bank Branch</CFormLabel>
                  <CFormInput
                    placeholder="Bank Branch"
                    type="text"
                    required
                    onChange={(e) => {
                      setBankBranch(e.target.value)
                    }}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel>Email</CFormLabel>
                  <CFormInput
                    placeholder="Email"
                    type="email"
                    required
                    onChange={(e) => {
                      setEmail(e.target.value)
                    }}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel>Email Password</CFormLabel>
                  <CFormInput
                    placeholder="Email Password"
                    type="text"
                    required
                    onChange={(e) => {
                      setEmailPassword(e.target.value)
                    }}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel>Card Number</CFormLabel>
                  <CFormInput
                    value={ccNumber(cardNumber)}
                    placeholder="Card Number"
                    type="text"
                    onChange={(e) => {
                      setCardNumber(e.target.value)
                    }}
                    required
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel>Exp Date</CFormLabel>
                  <CFormInput
                    placeholder="MM / YY"
                    type="text"
                    required
                    onChange={(e) => {
                      setExpDate(e.target.value)
                    }}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel>Access Code</CFormLabel>
                  <CFormInput
                    placeholder="Access Code"
                    type="text"
                    required
                    onChange={(e) => {
                      setAccessCode(e.target.value)
                    }}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel>Mbanking Password</CFormLabel>
                  <CFormInput
                    placeholder="Mbanking Password"
                    type="text"
                    required
                    onChange={(e) => {
                      setMbankingPassword(e.target.value)
                    }}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel>Pin</CFormLabel>
                  <CFormInput
                    placeholder="Pin"
                    type="number"
                    required
                    onChange={(e) => {
                      setPin(e.target.value)
                    }}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel>Username Acct</CFormLabel>
                  <CFormInput
                    placeholder="Username acct"
                    type="text"
                    required
                    onChange={(e) => {
                      setUsernameAcct(e.target.value)
                    }}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel>Password Acct</CFormLabel>
                  <CFormInput
                    placeholder="Password acct"
                    type="text"
                    required
                    onChange={(e) => {
                      setPasswordAcct(e.target.value)
                    }}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel>Transaction Password Acct</CFormLabel>
                  <CFormInput
                    placeholder="Transaction Password acct"
                    type="text"
                    required
                    onChange={(e) => {
                      setTransactionPasswordAcct(e.target.value)
                    }}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel>Username Ibanking</CFormLabel>
                  <CFormInput
                    placeholder="Username acct"
                    type="text"
                    required
                    onChange={(e) => {
                      setUsernameIbanking(e.target.value)
                    }}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel>Password Ibanking</CFormLabel>
                  <CFormInput
                    placeholder="Password acct"
                    type="text"
                    required
                    onChange={(e) => {
                      setPasswordIbanking(e.target.value)
                    }}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel>Pin Token Ibanking</CFormLabel>
                  <CFormInput
                    placeholder="Pin Token Mbanking"
                    type="text"
                    required
                    onChange={(e) => {
                      setPinTokenIbanking(e.target.value)
                    }}
                  />
                </div>
                <div className="mb-3">
                  <CRow>
                    <CCol>
                      <CFormLabel>Photo KTP</CFormLabel>
                      <br />
                      <CButton
                        className="primary-bg-color primary-font-color full-width"
                        onClick={() => {
                          setUploadModalVisible(true)
                          setUploadModalType('ktp')
                          setUploadModalTitle('Photo KTP')
                        }}
                      >
                        Upload
                      </CButton>
                    </CCol>
                    <CCol>
                      <CFormLabel>Selfie Photo KTP</CFormLabel>
                      <CButton
                        className="primary-bg-color primary-font-color full-width"
                        onClick={() => {
                          setUploadModalVisible(true)
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
                    className="primary-bg-color primary-font-color full-width"
                    onClick={() => {
                      setUploadModalVisible(true)
                    }}
                  >
                    Upload
                  </CButton>
                </div>
                <div className="mb-3">
                  <CFormLabel>Another File URL 1</CFormLabel>
                  <br />
                  <input type="file" />
                </div>
                <div className="mb-3">
                  <CFormLabel>Another File URL 2</CFormLabel>
                  <br />
                  <input type="file" />
                </div>
                <div className="mb-3">
                  <CFormLabel>Another File URL 3</CFormLabel>
                  <br />
                  <input type="file" />
                </div>
                <div className="mb-3">
                  <CFormLabel>Another File URL 4</CFormLabel>
                  <br />
                  <input type="file" />
                </div>
                <div className="mb-3">
                  <CFormLabel>Another File URL 5</CFormLabel>
                  <br />
                  <input type="file" />
                </div>
                <div className="mt-5">
                  <CButton
                    className="primary-bg-color primary-font-color full-width"
                    onClick={() => {
                      submitMainData()
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
              {imageUploadPreview && (
                <img src={URL.createObjectURL(imageUploadPreview)} width={300} />
              )}
              <br />
              <input
                className="mt-3"
                type="file"
                onChange={(e) => {
                  if (uploadModalType === 'photo_ktp') {
                    setPhotoKtpFile(e.currentTarget.files[0])
                  }
                  setImageUploadPreview(e.currentTarget.files[0])
                }}
              />
            </CModalBody>
            <CModalFooter>
              <CButton
                color="primary"
                onClick={() => {
                  setUploadModalVisible(false)
                }}
              >
                Save changes
              </CButton>
            </CModalFooter>
          </CModal>
        </div>
      </CContainer>
    </>
  )
}
