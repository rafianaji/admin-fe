import axiosSetup from './axiosSetup'

export async function getClientList() {
  try {
    return await axiosSetup({
      url: '/client',
    })
  } catch (error) {
    throw error
  }
}
