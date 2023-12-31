import axiosSetup from './axiosSetup';

export async function getClientList(query) {
  try {
    let url = '/client';
    if (query) {
      url = url + query;
    }
    return await axiosSetup({
      method: 'GET',
      url,
    });
  } catch (error) {
    throw error;
  }
}

export async function clientLogin(body) {
  try {
    return await axiosSetup({
      method: 'POST',
      url: '/client/login',
      data: body,
    });
  } catch (error) {
    throw error;
  }
}

export async function createClient(body) {
  try {
    return await axiosSetup({
      method: 'POST',
      url: '/client',
      data: body,
    });
  } catch (error) {
    throw error;
  }
}

export async function updateClient(id, body) {
  try {
    return await axiosSetup({
      method: 'PUT',
      url: `/client/${id}`,
      data: body,
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteClient(id) {
  try {
    return await axiosSetup({
      method: 'DELETE',
      url: `/client/${id}`,
    });
  } catch (error) {
    throw error;
  }
}
