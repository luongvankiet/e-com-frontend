import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_HOST_API,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
});

axiosInstance.interceptors.response.use(
  (res) => res.data,
  (error) => {
    // window.location.href = '/500';
    console.log(error);
    return Promise.reject(error?.response?.data?.message || 'Something went wrong');
  }
);

export default axiosInstance;

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res;
};
