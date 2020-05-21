/* eslint-disable */
import axios from 'axios'

export const serviceLoginCobranzas = axios.create({
  //httpsAgent: new https.Agent({ keepAlive: true }),
  baseURL: 'https://198.37.116.225:30',
  timeout: 30000
});

export const serviceAuthLoginEntitie = axios.create({
  //httpsAgent: new https.Agent({ keepAlive: true }),
  baseURL: 'https://198.37.116.225:30/entitie/auth/login',
  timeout: 30000
});

export const serviceAuthLoginClient = axios.create({
  //httpsAgent: new https.Agent({ keepAlive: true }),
  baseURL: 'https://198.37.116.225:30/client/auth/login',
  timeout: 30000
});

export const serviceAuthLoginUser = axios.create({
  //httpsAgent: new https.Agent({ keepAlive: true }),
  baseURL: 'https://198.37.116.225:30/user/auth/login',
  timeout: 30000
});
