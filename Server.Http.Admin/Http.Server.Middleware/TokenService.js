/*
  Módulo solamente utilizado para la generación de tokens
  (utilizar sólo si es necesario que ftont-end genere tokens)
*/

const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('./config');
const fs = require("fs");

const key = fs.readFileSync(__dirname + '/SSL/LoginCobranzas-WebApp-2TecAdmin.key').toString('ascii');
const cert = fs.readFileSync(__dirname + '/SSL/LoginCobranzas-WebApp-2TecAdmin.crt').toString('ascii');
const algoritmo = 'RS256';

exports.createTokenWithSSLCert = function(EmailUsuario) {
  let payload = {
    sub: EmailUsuario,
    iat: moment().unix(),
    exp: moment().add(config.TOKEN_WEB_EXPIRATION_TIME, config.TOKEN_WEB_INTERVAL).unix(),
  };
  //GENERAR TOKEN LVL1
  let token_lvl1 = jwt.encode(payload, config.TOKEN_SECRET_PWD_WEB);
  //GENERAR TOKEN LVL2 SSL
  let token_lvl2_ssl = jwt.encode(token_lvl1, key, algoritmo, config.TOKEN_SECRET_PWD_WEB);

  return token_lvl2_ssl;
};

exports.createTokenWebPay = function(IdUsuario) {
  let payload = {
    sub: IdUsuario,
    iat: moment().unix(),
    exp: moment().add(config.TOKEN_WEB_EXPIRATION_TIME, config.TOKEN_WEB_INTERVAL).unix(),
  };
  return jwt.encode(payload, config.TOKEN_SECRET_PWD_WEB);
};

/*
https://momentjs.com/docs/

Key				Shorthand
years			y
quarters		Q
months			M
weeks			w
days			d
hours			h
minutes			m
seconds			s
milliseconds	ms
*/
