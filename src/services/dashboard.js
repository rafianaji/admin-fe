import axiosSetup from './axiosSetup';

export async function getTotalDownline() {
  try {
    return await axiosSetup({
      method: 'GET',
      url: '/dashboard/total-downline'
    });
  } catch (error) {
    throw error;
  }
}

export async function getTotalForm() {
  try {
    return await axiosSetup({
      method: 'GET',
      url: '/dashboard/total-form'
    });
  } catch (error) {
    throw error;
  }
}

export async function getTotalFormPending() {
  try {
    return await axiosSetup({
      method: 'GET',
      url: '/dashboard/total-form-pending'
    });
  } catch (error) {
    throw error;
  }
}

export async function getTotalFormSettlement() {
  try {
    return await axiosSetup({
      method: 'GET',
      url: '/dashboard/total-form-settlement'
    });
  } catch (error) {
    throw error;
  }
}

export async function getTotalClient() {
  try {
    return await axiosSetup({
      method: 'GET',
      url: '/dashboard/total-client'
    });
  } catch (error) {
    throw error;
  }
}

// export default async function getTotalForm() {
//   try {
//     return await axiosSetup({
//       method: 'GET',
//       url: '/dashboard/total-form'
//     });
//   } catch (error) {
//     throw error;
//   }
// }
