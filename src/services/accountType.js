import axiosSetup from './axiosSetup';

export async function getAccountTypeList(params) {
  try {
    return await axiosSetup({
      method: 'GET',
      url: '/account-type',
      params,
    });
  } catch (error) {
    throw error;
  }
}

export async function createAccountType(body) {
  try {
    return await axiosSetup({
      method: 'POST',
      url: '/account-type',
      data: body,
    });
  } catch (error) {
    throw error;
  }
}

export async function updateAccountType(id, body) {
  try {
    return await axiosSetup({
      method: 'PUT',
      url: `/account-type/${id}`,
      data: body,
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteAccountType(id) {
  try {
    return await axiosSetup({
      method: 'DELETE',
      url: `/account-type/${id}`,
    });
  } catch (error) {
    throw error;
  }
}
