import axiosSetup from './axiosSetup';

export async function checkDownlineCode(code) {
  try {
    return await axiosSetup({
      method: 'GET',
      url: `/downline/${code}`,
    });
  } catch (error) {
    throw error;
  }
}

export async function getDownlineList(query) {
  try {
    let url = '/downline';
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

export async function createDownline(body) {
  try {
    return await axiosSetup({
      method: 'POST',
      url: '/downline',
      data: body,
    });
  } catch (error) {
    throw error;
  }
}

export async function updateDownline(id, body) {
  try {
    return await axiosSetup({
      method: 'PUT',
      url: `/downline/${id}`,
      data: body,
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteDownline(id) {
  try {
    return await axiosSetup({
      method: 'DELETE',
      url: `/downline/${id}`,
    });
  } catch (error) {
    throw error;
  }
}
