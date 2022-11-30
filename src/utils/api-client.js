import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import AppConstant from '../../app.json';
import {ObjectFactory} from './objectFactory';
import {CommonConstants} from '../constants/commonConstants';

const client = axios.create({
  baseURL: AppConstant.serverUrl,
  headers: {
    Accept: 'application/json',
    // Authorization: 'Bearer',
  },
  timeout: 100000,
});
/**
 * Request Wrapper with default success/error actions
 */
client.interceptors.request.use(
  async (config) => {
    const deviceId = await ObjectFactory.getCacheService().getValue(
      CommonConstants.DEVICE_ID_FIELD_NAME,
    );
    config.headers.origin = deviceId;
    if (!config.headers.Authorization) {
      const idToken = await ObjectFactory.getCacheService().getValue(
        CommonConstants.TOKEN_FIELD_NAME,
      );
      if (idToken) {
        config.headers.authorization = `Bearer ${idToken}`;
      }
    }
    return config;
  },
  (error) => console.log(error),
);

export const apiCall = function (method, route, body = null, token = null) {
  const onSuccess = function (response) {
    console.log('Request Successful!', response);
    return response.data;
  };

  const onError = function (error) {
    console.log('Request Failed:', error.config);

    if (error.response) {
      // Request was made but server responded with something
      // other than 2xx
      console.log('Data:', error.response.data);
    } else {
      // Something else happened while setting up the request
      // triggered the error
      console.log('Error Message:', error.message);
    }

    return Promise.reject(error.response);
  };

  return client({
    method,
    url: route,
    data: body,
  })
    .then(onSuccess)
    .catch(onError);
};
