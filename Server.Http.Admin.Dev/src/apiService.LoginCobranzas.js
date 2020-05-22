/* eslint-disable */
import axios from 'axios'

export const serviceLoginCobranzas = axios.create({
  //httpsAgent: new https.Agent({ keepAlive: true }),
  //baseURL: 'https://198.37.116.225:30',
  baseURL: 'http://198.37.116.225',
  timeout: 30000
});

export const serviceAuthLoginEntitie = axios.create({
  //baseURL: 'https://198.37.116.225:30/entitie/auth/login',
  baseURL: 'http://198.37.116.225',
  timeout: 30000
});

export const serviceAuthLoginClient = axios.create({
  //baseURL: 'https://198.37.116.225:30/client/auth/login',
  baseURL: 'http://198.37.116.225',
  timeout: 30000
});

export const serviceAuthLoginUser = axios.create({
  //baseURL: 'https://198.37.116.225:30/user/auth/login',
  baseURL: 'http://198.37.116.225',
  timeout: 30000
});
