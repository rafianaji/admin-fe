import axios from 'axios'

const axiosSetup = axios.create({
  baseURL: 'http://localhost:4500',
})

export default axiosSetup
