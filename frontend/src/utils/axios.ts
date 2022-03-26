import axiosBase from 'axios';

const apiURL = process.env.REACT_APP_API_URL;

const axios = axiosBase.create({
  baseURL: apiURL,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  responseType: 'json'
});

export default axios;
