const async = require("async");
//DEPENDENCIA: DAL
const usuariosDAO = require("../Http.Server.DAL/UsuariosDAO");
//DEPENDENCIA: DTO
const responseDTO = require("../Http.Server.DTO/Response/responseDTO");
const preRespDTO = require("../Http.Server.DTO/Response/preResponseDTO");

var GestionUsuariosController = function(){
	//this.Server_Config = Server_Config;
	this.param = null;
};

GestionUsuariosController.prototype.ingresarUsuario = function(Server_Config, response, payload){
	console.log("[GestionUsuarios.Controller.js][DATA]: " + payload);
	let strResultado;

	if (payload) {

		let vEmail = payload.Email;
		let vIdPerfilCuenta = payload.IdPerfilCuenta;
		let vIdTipoCuenta = payload.IdTipoCuenta;
		let vEmailSecundario = payload.EmailSecundario;
		let vUsuarioSesion = payload.UsuarioSesion;
		let vPassword = payload.Password;
		let vNombrePersona = payload.NombrePersona;
		let vRutPersona = payload.RutPersona;
		let vRutComercial = payload.RutComercial;
		let vDireccionParticular = payload.DireccionParticular;
		let vDireccionComercial = payload.DireccionComercial;
		let vTelefonoPrimario = payload.TelefonoPrimario;
		let vTelefonoSecundario = payload.TelefonoSecundario;
		let vCelularPrimario = payload.CelularPrimario;
		let vCelularSecundario = payload.CelularSecundario;

						async.waterfall([
							function(callback) {
								console.log("ASYNC [SERIES] 1: Ejecutando Package: PKG_GESTION_USUARIOS_INGRESAR_USUARIO");

								strResultado = usuariosDAO.ingresarUsuario(poolConnections, callback,
												App_Config, Service_Params, Util_Messages, request_method, DataHeader.Operacion,
												vEmail, vIdPerfilCuenta, vIdTipoCuenta, vEmailSecundario, vUsuarioSesion,
												vPassword, vNombrePersona, vRutPersona, vRutComercial, vDireccionParticular,
												vDireccionComercial, vTelefonoPrimario, vTelefonoSecundario,
												vCelularPrimario, vCelularSecundario);

							}
						],
						function(err, data) {
							if(err){
								let errorJSON = JSON.parse(err);
								console.log("Async ERROR: " + errorJSON.Response.Resultado.MensajeServicio);

								response.writeHead(errorJSON.Response.Resultado.CodigoHTTP, {'Content-Type': 'application/json; charset=utf-8'});
								response.write(err);
								response.end();
							} else {

								response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
								response.write(data);
								response.end();
							}
						});

		if (strResultado != App_Config.ValidationProperties.ERROR) {
			console.log("[GestionUsuarios.Controller.js]: " + strResultado);
		} else {
			strResultado = App_Config.ValidationProperties.ERROR;
			console.log("[GestionUsuarios.Controller.js]: " + strResultado);
		}
	} else {
		strResultado = App_Config.ValidationProperties.ERROR;
		console.log("[GestionUsuarios.Controller.js]: " + strResultado);
	}
	return strResultado;
};

GestionUsuariosController.prototype.loginUsuario = function(response, payload){
	console.log("[GestionUsuarios.Controller.js][DATA]: " + DataHeader.Operacion);
	let strResultado;
	let JSONResponse;

	if (DataHeader.Operacion) {

		let data = {};
		let user_vEmail = DataBody.Usuario;
		let user_vPassword = DataBody.Password;

		let vHttpCode = 401;

		async.waterfall([
			function(callback) {
				// do some more stuff ...
				console.log("ASYNC [WATERFALL] 1: Ejecutando Package: PKG_GESTION_USUARIOS_VALIDAR_USUARIO");

				strResultado = usuariosDAO.PKG_GESTION_USUARIOS_LOGIN_USUARIO(poolConnections, callback,
						App_Config, Service_Params, Util_Messages, request_method, DataHeader.Operacion,
						user_vEmail, user_vPassword);

			},
			function(dataResult, callback) {
				// do some more stuff ...
				console.log("ASYNC [WATERFALL] 2: Iniciando validación del inicio de sesión de la cuenta de usuario...");

				if(dataResult.Autorizacion == App_Config.ValidationProperties.EXITO){

					let token;

					switch(dataResult.EstadoCuenta){
						case "PENDIENTE":
							vHttpCode = 401; //Unauthorized
							token = "";
						break;
						case "ACTIVA":
							vHttpCode = 200; //OK
							token = tokenService.createTokenPrivateOperations(DataBody.Usuario);
						break;
						case "INACTIVA":
							vHttpCode = 401; //Unauthorized
							token = "";
						break;
						case "BLOQUEADA":
							vHttpCode = 401; //Unauthorized
							token = "";
						break;
						case "ELIMINADA":
							vHttpCode = 401; //Unauthorized
							token = "";
						break;
						default:
							vHttpCode = 401; //Unauthorized
							token = "";

					}

					data = {IdUsuario: dataResult.IdUsuario,
									Usuario: dataResult.Usuario,
									Autorizacion: dataResult.Autorizacion,
									EstadoCuenta: dataResult.EstadoCuenta,
								  Mensaje: dataResult.Mensaje};

					JSONResponse = GENERA_RESPONSE_AUTH_OK(request_method, DataHeader.Operacion, data, App_Config.ValidationProperties.EXITO, token);

					console.log("[INICIO DE SESIÓN][OK] - Usuario: [ " + data.Usuario + " ] Ha Iniciado Sesión...");

					callback(null, JSONResponse);

				} else {

					data = {Usuario: dataResult.Usuario,
							Autorizacion: dataResult.Autorizacion,
							EstadoCuenta: dataResult.EstadoCuenta,
						  Mensaje: dataResult.Mensaje};

					JSONResponse = GENERA_RESPONSE_AUTH_ERROR(vHttpCode, request_method, DataHeader.Operacion, data, App_Config.ValidationProperties.EXITO);

					callback(JSONResponse, null);
				}
			}
		],
		function(err, results) {
			if(err){
				let errorJSON = JSON.parse(err);
				console.log("Async ERROR: " + errorJSON.Response.Resultado.MensajeServicio);

				response.writeHead(errorJSON.Response.Resultado.CodigoHTTP, {'Content-Type': 'application/json; charset=utf-8'});
				response.write(err);
				response.end();
			} else {

				response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
				response.write(results);
				response.end();
			}
		});

		if (strResultado != App_Config.ValidationProperties.ERROR) {
			console.log("[GestionUsuarios.Controller.js]: " + strResultado);
		} else {
			strResultado = App_Config.ValidationProperties.ERROR;
			console.log("[GestionUsuarios.Controller.js]: " + strResultado);
		}
	} else {
		strResultado = App_Config.ValidationProperties.ERROR;
		console.log("[GestionUsuarios.Controller.js]: " + strResultado);
	}
	return strResultado;
};

GestionUsuariosController.prototype.actualizarUsuario = function(response, payload){
	console.log("[GestionUsuarios.Controller.js][DATA]: " + DataHeader.Operacion);
	let strResultado;

	if (DataHeader.Operacion) {

		let data = {};

		let user_vIdUsuario = DataBody.IdUsuario;
		let user_vEmail = DataBody.Email;
		let user_IdPerfilCuenta = DataBody.IdPerfilCuenta;
		let user_IdEstadoCuenta = DataBody.IdEstadoCuenta;
		let user_IdTipoCuenta = DataBody.IdTipoCuenta;
		let user_vEmailSecundario = DataBody.EmailSecundario;
		let user_vUsuarioSesion = DataBody.UsuarioSesion;
		let user_vNombrePersona = DataBody.NombrePersona;
		let user_vRutPersona = DataBody.RutPersona;
		let user_vRutComercial = DataBody.RutComercial;
		let user_vDireccionParticular = DataBody.DireccionParticular;
		let user_vDireccionComercial = DataBody.DireccionComercial;
		let user_vTelefonoPrimario = DataBody.TelefonoPrimario;
		let user_vTelefonoSecundario = DataBody.TelefonoSecundario;
		let user_vCelularPrimario = DataBody.CelularPrimario;
		let user_vCelularSecundario = DataBody.CelularSecundario;

						async.series([
							function(callback) {
								// do some more stuff ...
								console.log("ASYNC [SERIE] 1: Ejecutando Package: PKG_GESTION_USUARIOS_ACTUALIZAR_USUARIO");

								strResultado = usuariosDAO.PKG_GESTION_USUARIOS_ACTUALIZAR_USUARIO(poolConnections, callback,
												App_Config, Service_Params, Util_Messages, request_method, DataHeader.Operacion, user_vIdUsuario,
												user_vEmail, user_IdPerfilCuenta, user_IdEstadoCuenta, user_IdTipoCuenta, user_vEmailSecundario, user_vUsuarioSesion,
												user_vNombrePersona, user_vRutPersona, user_vRutComercial, user_vDireccionParticular,
												user_vDireccionComercial, user_vTelefonoPrimario, user_vTelefonoSecundario,
												user_vCelularPrimario, user_vCelularSecundario);

							},
							function(callback) {
								// do some more stuff ...
								//console.log("ASYNC [SERIE] 2: Generar y Enviar Correo Electrónico de Modificación de la Cuenta de Usuario");

								let datos = {"Enviado": 'OK'};

								callback(null, datos);
							}
						],
						function(err, results) {
							if(err){
								let errorJSON = JSON.parse(err);
								console.log("Async ERROR: " + errorJSON.Response.Resultado.MensajeServicio);

								response.writeHead(errorJSON.Response.Resultado.CodigoHTTP, {'Content-Type': 'application/json; charset=utf-8'});
								response.write(err);
								response.end();
							} else {

								//let IdUsuario = results[0].IdUsuario;
								//let tokenActivacion = tokenService.createTokenActivateAccount(IdUsuario);

								//let vURLActivacionCuenta = "http://198.37.116.225:9999/activateAccount/?Query=" + tokenActivacion;
								/*
								mailData = {
									TipoCorreo: "ACTIVACION CUENTA USUARIO",
									MailOptions: {
										isHtml: true,
										To: user_vEmail,
										Subject: "Activación de Cuenta de Usuario: [" + user_vEmail + "]",
										Body: "<div style='display:none; color:white; font-size:1px;' id='HtmlAreaEditor'>[zipedit]</div>" +
										"<table id='BodyBackground' class='template0' align='center' bgcolor='#ffc107' border='0' cellpadding='0' cellspacing='20' width='100%'>" +
										"<tbody><tr><td>" +
										"<table id='PageContent' align='center' bgcolor='#3f51b5' border='0' cellpadding='30' cellspacing='5' width='100%'>" +
										"<tbody><tr><td id='par0' bgcolor='#ffffff' valign='top'>" +
										"<h2 align='center'><font color='black' face='arial,helvetica,sans-serif'>" +
										"Activación de Cuenta de Usuario " +
										"</font></h2>" +
										"<h4><font color='black' face='arial,helvetica,sans-serif'>" +
										"Cuenta: " + user_vEmail + "</font></h4>" +
										"<p><font color='black' face='arial,helvetica,sans-serif' size='3'> " +
										"<h5><b>Estimado/a " + user_vNombrePersona + ":</b></h5> " +
										"Has registrado tu cuenta de correos como usuario de nuestros sistemas. </br></br>" +
										"Para activar tu cuenta de usuario, haz click en el enlace que hay a continuación: </br></br>" +
										"<b>Link de Activación: </b> <a href=" + vURLActivacionCuenta + ">[ACTIVAR CUENTA] </a></br></br></br>" +
										"Si no te aparece el botón de activación, o no puedes hacer click en el botón de activación de cuenta de usuario, " +
										"deberás copiar la siguiente URL, y pegarla en tu navegador de internet favorito, " +
										"éste proceso de igual manera activará tu cuenta de usuario.</br></br></br>" +
										"<ul>" +
										"<li>URL de Activación de Cuenta de Usuario:</li> " +
										"		<ul>" +
										"				<li>" + vURLActivacionCuenta + "</li> " +
										"		</ul> " +
										"</ul> " +
										"</br></br></br>" +
										"<b>IMPORTANTE:</b> El link de activación tiene una duración de 30 minutos, a partir de la generación de éste mensaje." +
										"</font></p><font color='black' face='arial,helvetica,sans-serif' size='3'>" +
										"</font></font></td>" +
										"</tr></tbody></table>" +
										"</td></tr></tbody></table>"
									}
								};
								*/
								//CorreoServiceReference.enviarCorreoDirect(request_method, mailData);

								JSONResponse = GENERA_RESPONSE_OK(request_method, DataHeader.Operacion, data, App_Config.ValidationProperties.EXITO);

								response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
								response.write(JSONResponse);
								response.end();
							}
						});

		if (strResultado != App_Config.ValidationProperties.ERROR) {
			console.log("[GestionUsuarios.Controller.js]: " + strResultado);
		} else {
			strResultado = App_Config.ValidationProperties.ERROR;
			console.log("[GestionUsuarios.Controller.js]: " + strResultado);
		}
	} else {
		strResultado = App_Config.ValidationProperties.ERROR;
		console.log("[GestionUsuarios.Controller.js]: " + strResultado);
	}
	return strResultado;
};

GestionUsuariosController.prototype.actualizarDatosUsuario = function(response, payload){
	console.log("[GestionUsuarios.Controller.js][DATA]: " + DataHeader.Operacion);
	let strResultado;

	if (DataHeader.Operacion) {

		let data = {};

		let user_vIdUsuario = DataBody.IdUsuario;
		let user_vEmail = DataBody.Email;
		let user_vEmailSecundario = DataBody.EmailSecundario;
		let user_vUsuarioSesion = DataBody.UsuarioSesion;
		let user_vNombrePersona = DataBody.NombrePersona;
		let user_vRutPersona = DataBody.RutPersona;
		let user_vRutComercial = DataBody.RutComercial;
		let user_vDireccionParticular = DataBody.DireccionParticular;
		let user_vDireccionComercial = DataBody.DireccionComercial;
		let user_vTelefonoPrimario = DataBody.TelefonoPrimario;
		let user_vTelefonoSecundario = DataBody.TelefonoSecundario;
		let user_vCelularPrimario = DataBody.CelularPrimario;
		let user_vCelularSecundario = DataBody.CelularSecundario;

						async.series([
							function(callback) {
								// do some more stuff ...
								console.log("ASYNC [SERIE] 1: Ejecutando Package: PKG_GESTION_USUARIOS_ACTUALIZAR_DATOS_USUARIO");

								strResultado = usuariosDAO.PKG_GESTION_USUARIOS_ACTUALIZAR_DATOS_USUARIO(poolConnections, callback,
												App_Config, Service_Params, Util_Messages, request_method, DataHeader.Operacion, user_vIdUsuario,
												user_vEmail, user_vEmailSecundario, user_vUsuarioSesion,
												user_vNombrePersona, user_vRutPersona, user_vRutComercial, user_vDireccionParticular,
												user_vDireccionComercial, user_vTelefonoPrimario, user_vTelefonoSecundario,
												user_vCelularPrimario, user_vCelularSecundario);

							},
							function(callback) {
								// do some more stuff ...
								console.log("ASYNC [SERIE] 2: Generar y Enviar Correo Electrónico de Activación de Cuenta de Usuario");

								let datos = {"Enviado": 'OK'};

								callback(null, datos);
							}
						],
						function(err, results) {
							if(err){
								let errorJSON = JSON.parse(err);
								console.log("Async ERROR: " + errorJSON.Response.Resultado.MensajeServicio);

								response.writeHead(errorJSON.Response.Resultado.CodigoHTTP, {'Content-Type': 'application/json; charset=utf-8'});
								response.write(err);
								response.end();
							} else {
								/*
								let IdUsuario = results[0].IdUsuario;
								let tokenActivacion = tokenService.createTokenActivateAccount(IdUsuario);

								let vURLActivacionCuenta = "http://198.37.116.225:9999/activateAccount/?Query=" + tokenActivacion;

								mailData = {
									TipoCorreo: "ACTIVACION CUENTA USUARIO",
									MailOptions: {
										isHtml: true,
										To: user_vEmail,
										Subject: "Activación de Cuenta de Usuario: [" + user_vEmail + "]",
										Body: "<div style='display:none; color:white; font-size:1px;' id='HtmlAreaEditor'>[zipedit]</div>" +
										"<table id='BodyBackground' class='template0' align='center' bgcolor='#ffc107' border='0' cellpadding='0' cellspacing='20' width='100%'>" +
										"<tbody><tr><td>" +
										"<table id='PageContent' align='center' bgcolor='#3f51b5' border='0' cellpadding='30' cellspacing='5' width='100%'>" +
										"<tbody><tr><td id='par0' bgcolor='#ffffff' valign='top'>" +
										"<h2 align='center'><font color='black' face='arial,helvetica,sans-serif'>" +
										"Activación de Cuenta de Usuario " +
										"</font></h2>" +
										"<h4><font color='black' face='arial,helvetica,sans-serif'>" +
										"Cuenta: " + user_vEmail + "</font></h4>" +
										"<p><font color='black' face='arial,helvetica,sans-serif' size='3'> " +
										"<h5><b>Estimado/a " + user_vNombrePersona + ":</b></h5> " +
										"Has registrado tu cuenta de correos como usuario de nuestros sistemas. </br></br>" +
										"Para activar tu cuenta de usuario, haz click en el enlace que hay a continuación: </br></br>" +
										"<b>Link de Activación: </b> <a href=" + vURLActivacionCuenta + ">[ACTIVAR CUENTA] </a></br></br></br>" +
										"Si no te aparece el botón de activación, o no puedes hacer click en el botón de activación de cuenta de usuario, " +
										"deberás copiar la siguiente URL, y pegarla en tu navegador de internet favorito, " +
										"éste proceso de igual manera activará tu cuenta de usuario.</br></br></br>" +
										"<ul>" +
										"<li>URL de Activación de Cuenta de Usuario:</li> " +
										"		<ul>" +
										"				<li>" + vURLActivacionCuenta + "</li> " +
										"		</ul> " +
										"</ul> " +
										"</br></br></br>" +
										"<b>IMPORTANTE:</b> El link de activación tiene una duración de 30 minutos, a partir de la generación de éste mensaje." +
										"</font></p><font color='black' face='arial,helvetica,sans-serif' size='3'>" +
										"</font></font></td>" +
										"</tr></tbody></table>" +
										"</td></tr></tbody></table>"
									}
								};

								CorreoServiceReference.enviarCorreoDirect(request_method, mailData);
								*/
								JSONResponse = GENERA_RESPONSE_OK(request_method, DataHeader.Operacion, data, App_Config.ValidationProperties.EXITO);

								response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
								response.write(JSONResponse);
								response.end();
							}
						});

		if (strResultado != App_Config.ValidationProperties.ERROR) {
			console.log("[GestionUsuarios.Controller.js]: " + strResultado);
		} else {
			strResultado = App_Config.ValidationProperties.ERROR;
			console.log("[GestionUsuarios.Controller.js]: " + strResultado);
		}
	} else {
		strResultado = App_Config.ValidationProperties.ERROR;
		console.log("[GestionUsuarios.Controller.js]: " + strResultado);
	}
	return strResultado;
};

GestionUsuariosController.prototype.actualizarPassword = function(response, payload){
	console.log("[GestionUsuarios.Controller.js][DATA]: " + DataHeader.Operacion);
	let strResultado;

	if (DataHeader.Operacion) {

		let data = {};

		let user_vIdUsuario = DataBody.IdUsuario;
		let user_vEmail = DataBody.Email;
		let user_vPasswordActual = DataBody.PasswordActual;
		let user_vNuevaPassword = DataBody.NuevaPassword;
		let user_vNuevaPasswordRepeat = DataBody.NuevaPasswordRepeat;

						async.waterfall([
							function(callback) {
								console.log("ASYNC [WATERFALL] 1: Ejecutando validaciones para la actualización de contraseña");
								if(user_vNuevaPassword != user_vNuevaPasswordRepeat){

									//RESPONSE: ERROR
									let j = preRespDTO;
									j.CodigoHTTP = 400;
									j.MensajeInterno = App_Config.ValidationProperties.ERROR;
									j.MensajeServicio = Util_Messages.Strings.ErrorContraseñasIngresadas;

									JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, DataHeader.Operacion, j.MensajeInterno, j.MensajeServicio);

									callback(JSONResponse, null);

								} else {
									console.log("ASYNC [WATERFALL] 1: Ejecutando Package: PKG_GESTION_USUARIOS_ACTUALIZAR_PASSWORD");

									strResultado = usuariosDAO.PKG_GESTION_USUARIOS_ACTUALIZAR_PASSWORD(poolConnections, callback,
													App_Config, Service_Params, Util_Messages, request_method, DataHeader.Operacion,
													user_vIdUsuario, user_vEmail, user_vPasswordActual, user_vNuevaPassword);
								}
							},
							function(dataResult, callback) {
								// do some more stuff ...
								console.log("ASYNC [WATERFALL] 2: Generando y Enviando Correo Electrónico de Actualización de Contraseña");

								let IdUsuario = dataResult.IdUsuario;

								mailData = {
									TipoCorreo: "CAMBIO DE CONTRASEÑA",
									MailOptions: {
										isHtml: true,
										To: dataResult.Email,
										Subject: "Actualización de Contraseña: [OK] [" + dataResult.Email + "]",
										Body: templatesHTML.getTemplateActualizacionPassword(dataResult.Email, dataResult.NombreUsuario)
									}
								};

								CorreoServiceReference.enviarCorreoDirect(request_method, mailData);

								JSONResponse = GENERA_RESPONSE_OK(request_method, DataHeader.Operacion, data, App_Config.ValidationProperties.EXITO);

								callback(null, JSONResponse);
							}
						],
						function(err, results) {
							if(err){
								let errorJSON = JSON.parse(err);
								console.log("Async ERROR: " + errorJSON.Response.Resultado.MensajeServicio);

								response.writeHead(errorJSON.Response.Resultado.CodigoHTTP, {'Content-Type': 'application/json; charset=utf-8'});
								response.write(err);
								response.end();
							} else {

								response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
								response.write(results);
								response.end();
							}
						});

		if (strResultado != App_Config.ValidationProperties.ERROR) {
			console.log("[GestionUsuarios.Controller.js]: " + strResultado);
		} else {
			strResultado = App_Config.ValidationProperties.ERROR;
			console.log("[GestionUsuarios.Controller.js]: " + strResultado);
		}
	} else {
		strResultado = App_Config.ValidationProperties.ERROR;
		console.log("[GestionUsuarios.Controller.js]: " + strResultado);
	}
	return strResultado;
};

GestionUsuariosController.prototype.actualizarPerfilCuenta = function(response, payload){
	console.log("[GestionUsuarios.Controller.js][DATA]: " + DataHeader.Operacion);
	let strResultado;

	if (DataHeader.Operacion) {

		let data = {};

		let user_vIdUsuario = DataBody.IdUsuario;
		let user_IdPerfilCuenta = DataBody.IdPerfilCuenta;

						async.series([
							function(callback) {

									console.log("ASYNC [SERIE] 1: Ejecutando Package: PKG_GESTION_USUARIOS_ACTUALIZAR_PERFIL_CUENTA");

									strResultado = usuariosDAO.PKG_GESTION_USUARIOS_ACTUALIZAR_PERFIL_CUENTA(poolConnections, callback,
													App_Config, Service_Params, Util_Messages, request_method, DataHeader.Operacion,
													user_vIdUsuario, user_IdPerfilCuenta);

							},
							function(callback) {
								// do some more stuff ...
								//console.log("ASYNC [SERIE] 2: Enviando Correo Electrónico de ..."");

								let datos = {"Enviado": 'OK'};

								callback(null, datos);
							}
						],
						function(err, results) {
							if(err){
								let errorJSON = JSON.parse(err);
								console.log("Async ERROR: " + errorJSON.Response.Resultado.MensajeServicio);

								response.writeHead(errorJSON.Response.Resultado.CodigoHTTP, {'Content-Type': 'application/json; charset=utf-8'});
								response.write(err);
								response.end();
							} else {
								/*
								let IdUsuario = results[0].IdUsuario;

								mailData = {
									TipoCorreo: "CAMBIO DE CONTRASEÑA",
									MailOptions: {
										isHtml: true,
										To: results[0].Email,
										Subject: "Actualización de Contraseña: [OK][" + results[0].Email + "]",
										Body: "<div style='display:none; color:white; font-size:1px;' id='HtmlAreaEditor'>[zipedit]</div>" +
										"<table id='BodyBackground' class='template0' align='center' bgcolor='#ffc107' border='0' cellpadding='0' cellspacing='20' width='100%'>" +
										"<tbody><tr><td>" +
										"<table id='PageContent' align='center' bgcolor='#3f51b5' border='0' cellpadding='30' cellspacing='5' width='100%'>" +
										"<tbody><tr><td id='par0' bgcolor='#ffffff' valign='top'>" +
										"<h2 align='center'><font color='black' face='arial,helvetica,sans-serif'>" +
										"Actualización de Contraseña" +
										"</font></h2>" +
										"<h4><font color='black' face='arial,helvetica,sans-serif'>" +
										"Cuenta: " + results[0].Email + " [CONTRASEÑA ACTUALIZADA] </font></h4>" +
										"<p><font color='black' face='arial,helvetica,sans-serif' size='3'> " +
										"<h5><b>Estimado/a " + results[0].NombreUsuario + ":</b></h5> " +
										"<ul>" +
										"<li>Hemos detectado que haz modificado tu contraseña, la actualización de tu contraseña de acceso a tu cuenta de usuario registrada con el correo: [" + results[0].Email + "], ha sido realizada correctamente.</li> " +
										"</ul> " +
										"<b>Gracias por preferir Sistemas 2Tec - Ideas Tecnológicas</b>" +
										"</font></p><font color='black' face='arial,helvetica,sans-serif' size='3'>" +
										"</font></font></td>" +
										"</tr></tbody></table>" +
										"</td></tr></tbody></table>"
									}
								};

								CorreoServiceReference.enviarCorreoDirect(request_method, mailData);
								*/
								JSONResponse = GENERA_RESPONSE_OK(request_method, DataHeader.Operacion, data, App_Config.ValidationProperties.EXITO);

								response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
								response.write(JSONResponse);
								response.end();
							}
						});

		if (strResultado != App_Config.ValidationProperties.ERROR) {
			console.log("[GestionUsuarios.Controller.js]: " + strResultado);
		} else {
			strResultado = App_Config.ValidationProperties.ERROR;
			console.log("[GestionUsuarios.Controller.js]: " + strResultado);
		}
	} else {
		strResultado = App_Config.ValidationProperties.ERROR;
		console.log("[GestionUsuarios.Controller.js]: " + strResultado);
	}
	return strResultado;
};

GestionUsuariosController.prototype.actualizarEstadoCuenta = function(response, payload){
	console.log("[GestionUsuarios.Controller.js][DATA]: " + DataHeader.Operacion);
	let strResultado;

	if (DataHeader.Operacion) {

		let data = {};

		let user_vIdUsuario = DataBody.IdUsuario;
		let user_IdEstadoCuenta = DataBody.IdEstadoCuenta;

						async.series([
							function(callback) {

									console.log("ASYNC [SERIE] 1: Ejecutando Package: PKG_GESTION_USUARIOS_ACTUALIZAR_ESTADO_CUENTA");

									strResultado = usuariosDAO.PKG_GESTION_USUARIOS_ACTUALIZAR_ESTADO_CUENTA(poolConnections, callback,
													App_Config, Service_Params, Util_Messages, request_method, DataHeader.Operacion,
													user_vIdUsuario, user_IdEstadoCuenta);

							},
							function(callback) {
								// do some more stuff ...
								//console.log("ASYNC [SERIE] 2: Enviando Correo Electrónico de ..."");

								let datos = {"Enviado": 'OK'};

								callback(null, datos);
							}
						],
						function(err, results) {
							if(err){
								let errorJSON = JSON.parse(err);
								console.log("Async ERROR: " + errorJSON.Response.Resultado.MensajeServicio);

								response.writeHead(errorJSON.Response.Resultado.CodigoHTTP, {'Content-Type': 'application/json; charset=utf-8'});
								response.write(err);
								response.end();
							} else {
								/*
								let IdUsuario = results[0].IdUsuario;

								mailData = {
									TipoCorreo: "CAMBIO DE CONTRASEÑA",
									MailOptions: {
										isHtml: true,
										To: results[0].Email,
										Subject: "Actualización de Contraseña: [OK][" + results[0].Email + "]",
										Body: "<div style='display:none; color:white; font-size:1px;' id='HtmlAreaEditor'>[zipedit]</div>" +
										"<table id='BodyBackground' class='template0' align='center' bgcolor='#ffc107' border='0' cellpadding='0' cellspacing='20' width='100%'>" +
										"<tbody><tr><td>" +
										"<table id='PageContent' align='center' bgcolor='#3f51b5' border='0' cellpadding='30' cellspacing='5' width='100%'>" +
										"<tbody><tr><td id='par0' bgcolor='#ffffff' valign='top'>" +
										"<h2 align='center'><font color='black' face='arial,helvetica,sans-serif'>" +
										"Actualización de Contraseña" +
										"</font></h2>" +
										"<h4><font color='black' face='arial,helvetica,sans-serif'>" +
										"Cuenta: " + results[0].Email + " [CONTRASEÑA ACTUALIZADA] </font></h4>" +
										"<p><font color='black' face='arial,helvetica,sans-serif' size='3'> " +
										"<h5><b>Estimado/a " + results[0].NombreUsuario + ":</b></h5> " +
										"<ul>" +
										"<li>Hemos detectado que haz modificado tu contraseña, la actualización de tu contraseña de acceso a tu cuenta de usuario registrada con el correo: [" + results[0].Email + "], ha sido realizada correctamente.</li> " +
										"</ul> " +
										"<b>Gracias por preferir Sistemas 2Tec - Ideas Tecnológicas</b>" +
										"</font></p><font color='black' face='arial,helvetica,sans-serif' size='3'>" +
										"</font></font></td>" +
										"</tr></tbody></table>" +
										"</td></tr></tbody></table>"
									}
								};

								CorreoServiceReference.enviarCorreoDirect(request_method, mailData);
								*/
								JSONResponse = GENERA_RESPONSE_OK(request_method, DataHeader.Operacion, data, App_Config.ValidationProperties.EXITO);

								response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
								response.write(JSONResponse);
								response.end();
							}
						});

		if (strResultado != App_Config.ValidationProperties.ERROR) {
			console.log("[GestionUsuarios.Controller.js]: " + strResultado);
		} else {
			strResultado = App_Config.ValidationProperties.ERROR;
			console.log("[GestionUsuarios.Controller.js]: " + strResultado);
		}
	} else {
		strResultado = App_Config.ValidationProperties.ERROR;
		console.log("[GestionUsuarios.Controller.js]: " + strResultado);
	}
	return strResultado;
};

GestionUsuariosController.prototype.actualizarTipoCuenta = function(response, payload){
	console.log("[GestionUsuarios.Controller.js][DATA]: " + DataHeader.Operacion);
	let strResultado;

	if (DataHeader.Operacion) {

		let data = {};

		let user_vIdUsuario = DataBody.IdUsuario;
		let user_IdTipoCuenta = DataBody.IdTipoCuenta;

						async.series([
							function(callback) {

									console.log("ASYNC [SERIE] 1: Ejecutando Package: PKG_GESTION_USUARIOS_ACTUALIZAR_TIPO_CUENTA");

									strResultado = usuariosDAO.PKG_GESTION_USUARIOS_ACTUALIZAR_TIPO_CUENTA(poolConnections, callback,
													App_Config, Service_Params, Util_Messages, request_method, DataHeader.Operacion,
													user_vIdUsuario, user_IdTipoCuenta);

							},
							function(callback) {

								let datos = {"Enviado": 'OK'};

								callback(null, datos);
							}
						],
						function(err, results) {
							if(err){
								let errorJSON = JSON.parse(err);
								console.log("Async ERROR: " + errorJSON.Response.Resultado.MensajeServicio);

								response.writeHead(errorJSON.Response.Resultado.CodigoHTTP, {'Content-Type': 'application/json; charset=utf-8'});
								response.write(err);
								response.end();
							} else {

								JSONResponse = GENERA_RESPONSE_OK(request_method, DataHeader.Operacion, data, App_Config.ValidationProperties.EXITO);

								response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
								response.write(JSONResponse);
								response.end();
							}
						});

		if (strResultado != App_Config.ValidationProperties.ERROR) {
			console.log("[GestionUsuarios.Controller.js]: " + strResultado);
		} else {
			strResultado = App_Config.ValidationProperties.ERROR;
			console.log("[GestionUsuarios.Controller.js]: " + strResultado);
		}
	} else {
		strResultado = App_Config.ValidationProperties.ERROR;
		console.log("[GestionUsuarios.Controller.js]: " + strResultado);
	}
	return strResultado;
};

GestionUsuariosController.prototype.bloquearUsuario = function(response, payload){
	console.log("[GestionUsuarios.Controller.js][DATA]: " + DataHeader.Operacion);
	let strResultado;

	if (DataHeader.Operacion) {

		let data = {};

		let user_vIdUsuario = DataBody.IdUsuario;

						async.series([
							function(callback) {

									console.log("ASYNC [SERIE] 1: Ejecutando Package: PKG_GESTION_USUARIOS_BLOQUEAR_USUARIO");

									strResultado = usuariosDAO.PKG_GESTION_USUARIOS_BLOQUEAR_USUARIO(poolConnections, callback,
													App_Config, Service_Params, Util_Messages, request_method, DataHeader.Operacion,
													user_vIdUsuario);

							},
							function(callback) {

								let datos = {"Enviado": 'OK'};

								callback(null, datos);
							}
						],
						function(err, results) {
							if(err){
								let errorJSON = JSON.parse(err);
								console.log("Async ERROR: " + errorJSON.Response.Resultado.MensajeServicio);

								response.writeHead(errorJSON.Response.Resultado.CodigoHTTP, {'Content-Type': 'application/json; charset=utf-8'});
								response.write(err);
								response.end();
							} else {

								JSONResponse = GENERA_RESPONSE_OK(request_method, DataHeader.Operacion, data, App_Config.ValidationProperties.EXITO);

								response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
								response.write(JSONResponse);
								response.end();
							}
						});

		if (strResultado != App_Config.ValidationProperties.ERROR) {
			console.log("[GestionUsuarios.Controller.js]: " + strResultado);
		} else {
			strResultado = App_Config.ValidationProperties.ERROR;
			console.log("[GestionUsuarios.Controller.js]: " + strResultado);
		}
	} else {
		strResultado = App_Config.ValidationProperties.ERROR;
		console.log("[GestionUsuarios.Controller.js]: " + strResultado);
	}
	return strResultado;
};

GestionUsuariosController.prototype.eliminarUsuario = function(response, payload){
	console.log("[GestionUsuarios.Controller.js][DATA]: " + DataHeader.Operacion);
	let strResultado;

	if (DataHeader.Operacion) {

		let data = {};

		let user_vIdUsuario = DataBody.IdUsuario;

						async.series([
							function(callback) {

									console.log("ASYNC [SERIE] 1: Ejecutando Package: PKG_GESTION_USUARIOS_ELIMINAR_USUARIO");

									strResultado = usuariosDAO.PKG_GESTION_USUARIOS_ELIMINAR_USUARIO(poolConnections, callback,
													App_Config, Service_Params, Util_Messages, request_method, DataHeader.Operacion,
													user_vIdUsuario);

							},
							function(callback) {

								let datos = {"Enviado": 'OK'};

								callback(null, datos);
							}
						],
						function(err, results) {
							if(err){
								let errorJSON = JSON.parse(err);
								console.log("Async ERROR: " + errorJSON.Response.Resultado.MensajeServicio);

								response.writeHead(errorJSON.Response.Resultado.CodigoHTTP, {'Content-Type': 'application/json; charset=utf-8'});
								response.write(err);
								response.end();
							} else {

								JSONResponse = GENERA_RESPONSE_OK(request_method, DataHeader.Operacion, data, App_Config.ValidationProperties.EXITO);

								response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
								response.write(JSONResponse);
								response.end();
							}
						});

		if (strResultado != App_Config.ValidationProperties.ERROR) {
			console.log("[GestionUsuarios.Controller.js]: " + strResultado);
		} else {
			strResultado = App_Config.ValidationProperties.ERROR;
			console.log("[GestionUsuarios.Controller.js]: " + strResultado);
		}
	} else {
		strResultado = App_Config.ValidationProperties.ERROR;
		console.log("[GestionUsuarios.Controller.js]: " + strResultado);
	}
	return strResultado;
};

GestionUsuariosController.prototype.inactivarUsuario = function(response, payload){
	console.log("[GestionUsuarios.Controller.js][DATA]: " + DataHeader.Operacion);
	let strResultado;

	if (DataHeader.Operacion) {

		let data = {};

		let user_vIdUsuario = DataBody.IdUsuario;

						async.series([
							function(callback) {

									console.log("ASYNC [SERIE] 1: Ejecutando Package: PKG_GESTION_USUARIOS_INACTIVAR_USUARIO");

									strResultado = usuariosDAO.PKG_GESTION_USUARIOS_INACTIVAR_USUARIO(poolConnections, callback,
													App_Config, Service_Params, Util_Messages, request_method, DataHeader.Operacion,
													user_vIdUsuario);

							},
							function(callback) {

								let datos = {"Enviado": 'OK'};

								callback(null, datos);
							}
						],
						function(err, results) {
							if(err){
								let errorJSON = JSON.parse(err);
								console.log("Async ERROR: " + errorJSON.Response.Resultado.MensajeServicio);

								response.writeHead(errorJSON.Response.Resultado.CodigoHTTP, {'Content-Type': 'application/json; charset=utf-8'});
								response.write(err);
								response.end();
							} else {

								JSONResponse = GENERA_RESPONSE_OK(request_method, DataHeader.Operacion, data, App_Config.ValidationProperties.EXITO);

								response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
								response.write(JSONResponse);
								response.end();
							}
						});

		if (strResultado != App_Config.ValidationProperties.ERROR) {
			console.log("[GestionUsuarios.Controller.js]: " + strResultado);
		} else {
			strResultado = App_Config.ValidationProperties.ERROR;
			console.log("[GestionUsuarios.Controller.js]: " + strResultado);
		}
	} else {
		strResultado = App_Config.ValidationProperties.ERROR;
		console.log("[GestionUsuarios.Controller.js]: " + strResultado);
	}
	return strResultado;
};

module.exports = GestionUsuariosController;

function GENERA_RESPONSE_OK(request_method, Operacion, data_JSON, mensajeServicio) {
	let r = responseDTO;
	console.log("[.DAL][OK]: [GENERANDO RESPONSE]");
	let vFecha = new Date().toJSON(); //.slice(0,10);

	r.Response.Header.NombreOperacion = Operacion;
	r.Response.Info.FechaHora = vFecha;
	r.Response.Info.RequestMethod = request_method;
	r.Response.Return.BodyData = data_JSON;

	r.Response.Resultado.Codigo = 0
	r.Response.Resultado.OrigenMensaje = "[SERVICIO]"
	r.Response.Resultado.CodigoHTTP = 200;
	r.Response.Resultado.MensajeInterno = mensajeServicio;
	r.Response.Resultado.MensajeServicio = "La operacion se ha ejecutado exitosamente.";

	return JSON.stringify(r);
};

function GENERA_RESPONSE_ERROR(CodigoHTTP, request_method, Operacion, MensajeInterno, MensajeServicio) {
	let r = responseDTO;
	console.log("[SERVICE][ERROR]: [GENERANDO RESPONSE]");
	var vFecha = new Date().toJSON(); //.slice(0,10);

	r.Response.Header.NombreOperacion = Operacion;
	r.Response.Info.FechaHora = vFecha;
	r.Response.Info.RequestMethod = request_method;
	r.Response.Return.BodyData = {};

	r.Response.Resultado.Codigo = 1
	r.Response.Resultado.OrigenMensaje = "[SERVICIO]"
	r.Response.Resultado.CodigoHTTP = CodigoHTTP;
	r.Response.Resultado.MensajeInterno = MensajeInterno;
	r.Response.Resultado.MensajeServicio = MensajeServicio;

	return JSON.stringify(r);
};
