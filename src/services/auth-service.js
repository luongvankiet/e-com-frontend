import { api } from 'src/paths';
import axios from 'src/utils/axios';

const login = (credentials) => axios.post(api.auth.login, credentials);

const register = (credentials) => axios.post(api.auth.register, credentials);

const getCurrentUser = () => axios.get(api.auth.me);

const forgotPassword = (body) => axios.post(api.auth.forgotPassword, body);

const verifyEmail = (userId, token) => {
  const url = api.auth.verifyEmail.replace(':userId', userId).replace(':token', token);

  return axios.get(url);
};

const AuthService = {
  login,
  register,
  getCurrentUser,
  forgotPassword,
  verifyEmail,
};

export default AuthService;
