import { api } from 'src/paths';
import axios from 'src/utils/axios';

export const AuthService = {
  login: (credentials) => axios.post(api.auth.login, credentials),
  register: (credentials) => axios.post(api.auth.register, credentials),
  logout: () => axios.get(api.auth.logout),
  getCurrentUser: () => axios.get(api.auth.me),
  forgotPassword: (body) => axios.post(api.auth.forgotPassword, body),
  verifyEmail: (userId, token) => {
    const url = api.auth.verifyEmail.replace(':userId', userId).replace(':token', token);

    return axios.get(url);
  },
};
