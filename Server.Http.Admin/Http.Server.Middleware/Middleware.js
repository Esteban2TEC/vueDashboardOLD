const url = require("url");
const jwt = require('jwt-simple');
const moment = require('moment');
const datetime = require("date-and-time");
const config = require('./config');
const fs = require("fs");

const cert = fs.readFileSync(__dirname + '/SSL/LoginCobranzas-WebApp-2TecAdmin.crt').toString('ascii');

const responseDTO = require("../Http.Server.DTO/Response/responseDTO");
const paramDTO = require("../Http.Server.DTO/Response/preResponseDTO");
var JSONResponse;

exports.ensureAuthPrivatePOST = function(request, response, next) {
	//if(!request.headers.authorization) {
	console.log("[SECURE MIDDLEWARE VALIDATION]:[POST]");
	if(!request.body.Auth) {
		JSONResponse = GENERA_RESPONSE(401, '[ACCESO DENEGADO]', 'Cuerpo de autenticacion no válido...');

		response.writeHead(401, {'Content-Type': 'application/json; charset=utf-8'});
		response.write(JSONResponse);
		response.end();
		return;

	} else if(!request.body.Auth.Token) {
		JSONResponse = GENERA_RESPONSE(401, '[ACCESO DENEGADO]', 'Cuerpo de autenticacion no válido...');

		response.writeHead(401, {'Content-Type': 'application/json; charset=utf-8'});
		response.write(JSONResponse);
		response.end();
		return;

	} else {
		try {
			//OBTENER TOKEN LVL2 SSL
			let token_lvl2_ssl = request.body.Auth.Token; //.split(" ")[1];

			//DECODIFICAR TOKEN LVL2 SSL
			let token_lvl1 = jwt.decode(token_lvl2_ssl, cert);

			//DECODIFICAR TOKEN LVL1
			let tokenSimple = token_lvl1; //request.body.Auth.Token;
			let payload = jwt.decode(tokenSimple, config.TOKEN_SECRET_WEB_PAY);

			if(payload.exp <= moment().unix()) {
				JSONResponse = GENERA_RESPONSE(401, '[ACCESO DENEGADO]', 'Token expirado ...');
				response.writeHead(401, {'Content-Type': 'application/json; charset=utf-8'});
				response.write(JSONResponse);
				response.end();
				return;

			}
			//Agrega los datos del payload proveniente del token, al response, para poder controlar los inicios, o almacenar los datos en BBDD...
			//request.user = payload.sub;
			next();

		} catch (ex) {
			//GENERA LOS ERRORES CUANDO LA AUTENTICACIÓN DEL TOKEN FALLA.
			JSONResponse = GENERA_RESPONSE(401, '[ACCESO DENEGADO]', 'Petición Inválida; ' + ex.message);

			response.writeHead(401, {'Content-Type': 'application/json; charset=utf-8'});
			response.write(JSONResponse);
			response.end();
			return;

		}
	}
};

exports.ensureAuthPrivateGET = function(request, response, next) {
	//if(!request.headers.authorization) {
	console.log("[MIDDLEWARE VALIDATION]:[GET]");

	let parametros = url.parse(request.url, true).query;
	let queryJSON = JSON.parse(parametros.Query);

	if(!queryJSON.Auth) {
		JSONResponse = GENERA_RESPONSE(401, '[ACCESO DENEGADO]', 'Cuerpo de autenticacion no válido ...');
		response.writeHead(401, {'Content-Type': 'application/json; charset=utf-8'});
		response.write(JSONResponse);
		response.end();
		return;

	} else if(!queryJSON.Auth.Token) {
		JSONResponse = GENERA_RESPONSE(401, '[ACCESO DENEGADO]', 'Cuerpo de autenticacion no válido...');
		response.writeHead(401, {'Content-Type': 'application/json; charset=utf-8'});
		response.write(JSONResponse);
		response.end();
		return;

	} else {
		try {
			//OBTENER TOKEN LVL2 SSL
			let token_lvl2_ssl = queryJSON.Auth.Token; //.split(" ")[1];

			//DECODIFICAR TOKEN LVL2 SSL
			let token_lvl1 = jwt.decode(token_lvl2_ssl, cert);

			//DECODIFICAR TOKEN LVL1
			let tokenSimple = token_lvl1; //request.body.Auth.Token;
			let payload = jwt.decode(tokenSimple, config.TOKEN_SECRET_WEB_PAY);

			//console.log("Token: " + request.body.Auth.Token);
			//let token = queryJSON.Auth.Token; //.split(" ")[1];
			//let payload = jwt.decode(token, config.TOKEN_SECRET_PRIVATE_OPERATIONS);

			if(payload.exp <= moment().unix()) {
				JSONResponse = GENERA_RESPONSE(401, '[ACCESO DENEGADO]', 'Token expirado ...');
				response.writeHead(401, {'Content-Type': 'application/json; charset=utf-8'});
				response.write(JSONResponse);
				response.end();
				return;
			}
			//Agrega los datos del payload proveniente del token, al response, para poder controlar los inicios, o almacenar los datos en BBDD...
			//response.user = payload.sub;
			next();

		} catch (ex) {
			//GENERA LOS ERRORES CUANDO LA AUTENTICACIÓN DEL TOKEN FALLA.
			JSONResponse = GENERA_RESPONSE(401, '[ACCESO DENEGADO]', 'Petición Inválida; ' + ex.message);
			response.writeHead(401, {'Content-Type': 'application/json; charset=utf-8'});
			response.write(JSONResponse);
			response.end();
			return;

		}
	}
};

exports.ensureWebPay = function(request, response, next) {

	console.log("[SECURE MIDDLEWARE VALIDATION - WEB PAY]:[GET]");

	let p = url.parse(request.url, true).query;
	let token = p.authPay;

	if(!token) {
		JSONResponse = GENERA_RESPONSE(401, '[ACCESO DENEGADO]', 'Cuerpo de autenticación no válido ...');
		response.writeHead(401, {'Content-Type': 'application/json; charset=utf-8'});
		response.write(JSONResponse);
		response.end();
		return;

	} else {
		try {

			let payload = jwt.decode(token, config.TOKEN_SECRET_WEB_PAY);

			if(payload.exp <= moment().unix()) {
				JSONResponse = GENERA_RESPONSE(401, '[ACCESO DENEGADO]', 'Token expirado ...');
				response.writeHead(401, {'Content-Type': 'application/json; charset=utf-8'});
				response.write(JSONResponse);
				response.end();
				return;
			}

			//Añade variables al objeto Request o Response, según sea necesario
			response.dataPayUDec = payload;
			console.log("[SECURE MIDDLEWARE VALIDATION - WEB PAY]: Autorización OK");
			//console.log(payload);
			next();

		} catch (ex) {
			//GENERA LOS ERRORES CUANDO LA AUTENTICACIÓN DEL TOKEN FALLA.
			JSONResponse = GENERA_RESPONSE(401, '[ACCESO DENEGADO]', 'Petición Inválida; ' + ex.message);
			response.writeHead(401, {'Content-Type': 'application/json; charset=utf-8'});
			response.write(JSONResponse);
			response.end();
			return;
		}
	}
};

function GENERA_RESPONSE(CodigoHTTP, MensajeInterno, MensajeServicio) {
	let r = responseDTO;
	console.log("[SERVICE][ERROR]: [GENERANDO RESPONSE]");
	let fechaHoy = new Date();
	let fechaHoy_formatted = datetime.format(fechaHoy, 'DD/MM/YYYY - HH:mm:ss');

	r.Response.Info.FechaHora = fechaHoy_formatted;

	r.Response.Resultado.Codigo = 1
	r.Response.Resultado.OrigenMensaje = "[AUTH MIDDLEWARE]"
	r.Response.Resultado.CodigoHTTP = CodigoHTTP;
	r.Response.Resultado.MensajeInterno = MensajeInterno;
	r.Response.Resultado.MensajeServicio = MensajeServicio;

	return JSON.stringify(r);
};
