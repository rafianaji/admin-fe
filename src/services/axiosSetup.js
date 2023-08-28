import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from 'src/shared/config/config';

const axiosSetup = axios.create({
  baseURL: API_BASE_URL
});

axiosSetup.interceptors.request.use(async (req) => {
  const adminToken = await localStorage.getItem('admin_token');
  if (adminToken && !req.headers.Authorization) {
    req.headers.Authorization = `Bearer ${adminToken}`;
  }
  document.getElementById('loader-spinner').style.display = 'flex';
  return req;
});

axiosSetup.interceptors.response.use(
  (res) => {
    document.getElementById('loader-spinner').style.display = 'none';
    const method = res.config.method.toLowerCase();
    const url = res.config.url;

    if (method === 'post' && !url.includes('login')) {
      toast.success('Successfully Created Data');
    }
    if (method === 'put') {
      toast.success('Successfully Updated Data');
    }
    if (method === 'delete') {
      toast.success('Successfully Deleted Data');
    }
    return res;
  },
  (err) => {
    document.getElementById('loader-spinner').style.display = 'none';
    const errResponse = err?.response?.data;
    if (errResponse) {
      toast.error(errResponse.message);
    } else {
      toast.error(err.message);
    }
    throw err;
  }
);

export default axiosSetup;
