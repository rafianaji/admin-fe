import axiosSetup from './axiosSetup';

export async function adminLogin(body) {
  try {
    return await axiosSetup({
      method: 'POST',
      url: '/admin/login',
      data: body,
    });
  } catch (error) {
    throw error;
  }
}
