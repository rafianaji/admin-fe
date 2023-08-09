import axiosSetup from './axiosSetup'

export async function getAccountTypeList(params) {
  try {
    return await axiosSetup({
      method: 'GET',
      url: '/account-type',
      params,
    })
  } catch (error) {
    throw error
  }
}
