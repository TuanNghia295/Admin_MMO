import axios from 'axios';
import { END_POINTS } from '../constant/endpoints';
import queryString from 'querystring';

const axiosClient = axios.create({
  baseURL: END_POINTS,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  function (response) {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  function (error) {
    if (error.response) {
      console.log('Something went wrong while sending request to server');
      console.error(error.response.data);
    }
    return Promise.reject(error.response || error.message);
  }
);

export default axiosClient;
