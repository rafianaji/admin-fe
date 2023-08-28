import jwtDecode from 'jwt-decode';
import axiosSetup from './axiosSetup';

export async function getMainDataList(token, query) {
  try {
    return await axiosSetup({
      method: 'GET',
      url: `/main-data${query}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    throw error;
  }
}

export async function createMainData(code, body) {
  try {
    const adminToken = await localStorage.getItem('admin_token');
    const formData = new FormData();
    for (const key in body) {
      formData.append(key, body[key]);
    }
    return await axiosSetup({
      method: 'POST',
      url: `/main-data/${code}`,
      data: formData,
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    });
  } catch (error) {
    throw error;
  }
}

export async function getMainDataDetail(id) {
  try {
    return await axiosSetup({
      method: 'GET',
      url: `/main-data/${id}`
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteMainData(id) {
  try {
    return await axiosSetup({
      method: 'DELETE',
      url: `/main-data/${id}`
    });
  } catch (error) {
    throw error;
  }
}

export async function updateMainData(id, body) {
  try {
    const adminToken = await localStorage.getItem('admin_token');
    const decodeToken = jwtDecode(adminToken);
    if (decodeToken.id) {
      body.admin_id = decodeToken.id;
    }
    const formData = new FormData();
    for (const key in body) {
      formData.append(key, body[key]);
    }
    return await axiosSetup({
      method: 'PUT',
      url: `/main-data/${id}`,
      data: formData
    });
  } catch (error) {
    throw error;
  }
}

export async function cancelMainData(id, body) {
  try {
    const adminToken = await localStorage.getItem('admin_token');
    const decodeToken = jwtDecode(adminToken);
    if (decodeToken.id) {
      body.admin_id = decodeToken.id;
    }
    return await axiosSetup({
      method: 'PUT',
      url: `/main-data/cancel/${id}`,
      data: body
    });
  } catch (error) {
    throw error;
  }
}
