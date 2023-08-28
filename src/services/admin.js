import axiosSetup from './axiosSetup';

export async function adminLogin(body) {
  try {
    return await axiosSetup({
      method: 'POST',
      url: '/admin/login',
      data: body
    });
  } catch (error) {
    throw error;
  }
}

export async function createAdmin(body) {
  try {
    return await axiosSetup({
      method: 'POST',
      url: '/admin',
      data: body
    });
  } catch (error) {
    throw error;
  }
}

export async function changePassword(body) {
  try {
    return await axiosSetup({
      method: 'PUT',
      url: '/admin/change-password',
      data: body
    });
  } catch (error) {
    throw error;
  }
}
