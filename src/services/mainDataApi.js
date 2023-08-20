import axiosSetup from './axiosSetup';

export async function getMainDataList(query) {
  try {
    const adminToken = await localStorage.getItem('admin_token');
    return await axiosSetup({
      method: 'GET',
      url: `/main-data${query}`,
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
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
        Authorization: `Bearer ${adminToken}`,
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function getDetailMainData(id) {
  try {
    return await axiosSetup({
      method: 'GET',
      url: `/main-data/${id}`,
    });
  } catch (error) {
    throw error;
  }
}

export async function updateMainData(id, body) {
  try {
    return await axiosSetup({
      method: 'PUT',
      url: `/main-data/${id}`,
      data: body,
    });
  } catch (error) {
    throw error;
  }
}
