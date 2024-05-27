import { useNavigate } from 'react-router-dom';
import axiosInstance from './axios';

const SetupInterceptors = () => {
  const navigate = useNavigate();
  axiosInstance.interceptors.response.use(
    (res) => res.data,
    (error) => {
      navigate('/500');
      Promise.reject(error.message || 'Something went wrong');
    }
  );
};

export default SetupInterceptors;
