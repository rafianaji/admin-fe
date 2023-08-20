import axios from 'axios';
import { toast } from 'react-hot-toast';

const axiosSetup = axios.create({
  baseURL: 'http://localhost:4500',
});

axiosSetup.interceptors.request.use((req) => {
  document.getElementById('loader-spinner').style.display = 'none';
  return req;
});

axiosSetup.interceptors.response.use(
  (res) => {
    const method = res.config.method.toLowerCase();

    if (method === 'post') {
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
  },
);

export default axiosSetup;
