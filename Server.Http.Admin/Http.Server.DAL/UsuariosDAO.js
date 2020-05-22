const fetch = require("node-fetch");

const requestDTO = require("../Http.Server.DTO/Request/requestDTO");
const publicRoutes = require("../Http.Server.DTO/Operations/publicOperationsDTO");
const privateRoutes = require("../Http.Server.DTO/Operations/privateOperationsDTO");

exports.ingresarUsuario = ingresarUsuario;
exports.PKG_GESTION_USUARIOS_LOGIN_USUARIO = PKG_GESTION_USUARIOS_LOGIN_USUARIO;
exports.PKG_GESTION_USUARIOS_ACTUALIZAR_USUARIO = PKG_GESTION_USUARIOS_ACTUALIZAR_USUARIO;
exports.PKG_GESTION_USUARIOS_ACTUALIZAR_DATOS_USUARIO = PKG_GESTION_USUARIOS_ACTUALIZAR_DATOS_USUARIO;
exports.PKG_GESTION_USUARIOS_ACTUALIZAR_PASSWORD = PKG_GESTION_USUARIOS_ACTUALIZAR_PASSWORD;
exports.PKG_GESTION_USUARIOS_ACTUALIZAR_PERFIL_CUENTA = PKG_GESTION_USUARIOS_ACTUALIZAR_PERFIL_CUENTA;
exports.PKG_GESTION_USUARIOS_ACTUALIZAR_ESTADO_CUENTA = PKG_GESTION_USUARIOS_ACTUALIZAR_ESTADO_CUENTA;
exports.PKG_GESTION_USUARIOS_ACTUALIZAR_TIPO_CUENTA = PKG_GESTION_USUARIOS_ACTUALIZAR_TIPO_CUENTA;
exports.PKG_GESTION_USUARIOS_BLOQUEAR_USUARIO = PKG_GESTION_USUARIOS_BLOQUEAR_USUARIO;
exports.PKG_GESTION_USUARIOS_ELIMINAR_USUARIO = PKG_GESTION_USUARIOS_ELIMINAR_USUARIO;
exports.PKG_GESTION_USUARIOS_INACTIVAR_USUARIO = PKG_GESTION_USUARIOS_INACTIVAR_USUARIO;

function ingresarUsuario(Server_Config, callback,
		pEmail, pIdPerfilCuenta, pIdTipoCuenta, pEmailSecundario, pUsuarioSesion, pPassword, pNombrePersona,
		pRutPersona, pRutComercial, pDireccionParticular, pDireccionComercial, pTelefonoPrimario, pTelefonoSecundario,
		pCelularPrimario, pCelularSecundario){

      var request = requestDTO;
      request.Header.Operacion = publicRoutes.Operaciones.ServicioGestionUsuarios.IngresarUsuario;
      request.Body = {
          Email: pEmail,
      		IdPerfilCuenta: 1000, //pIdPerfilCuenta
      		IdTipoCuenta: 1000, //pIdTipoCuenta
      		EmailSecundario: pEmailSecundario,
      		UsuarioSesion: pUsuarioSesion,
      		Password: pPassword,
      		NombrePersona: pNombrePersona,
      		RutPersona: pRutPersona,
      		RutComercial: pRutComercial,
      		DireccionParticular: pDireccionParticular,
      		DireccionComercial: pDireccionComercial,
      		TelefonoPrimario: pTelefonoPrimario,
      		TelefonoSecundario: pTelefonoSecundario,
      		CelularPrimario: pCelularPrimario,
      		CelularSecundario: pCelularSecundario
      };

      fetch(Server_Config.APIs.Backend + request.Header.Operacion,
      {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: "POST",
          body: JSON.stringify(request)
      })
      .then(function(res){
        return res.json();
      })
      .then(function(data){
        if(data.Response.Resultado.CodigoHTTP == 200){
          console.log(data);
          callback(null, data);
        } else {
          console.log(data);
          callback(data, null);
        }
      });
};

function PKG_GESTION_USUARIOS_LOGIN_USUARIO(poolConnections, callback, App_Config, Service_Params, Util_Messages, request_method, Operacion,
												user_vEmail, user_vPassword){
	console.log("[D.A.L.][UsuariosDAO.js][OPERATION]: " + Operacion);
	let JSONResponse;
	let Resultado;
	let data = {};

	let strResultado;

	if (Operacion) {

		/*
		oracledb.getConnection({
			 user: App_Config.OracleDbServer.User,
			 password: App_Config.OracleDbServer.Password,
			 connectString: App_Config.OracleDbServer.ConnectString
		},
    */
    poolConnections.getConnection(function(err, connection) {
			if (err) {
				console.error(err.message);
				//RESPONSE: ERROR
				let j = preRespDTO;
				j.CodigoHTTP = 400;
				j.MensajeInterno = App_Config.ValidationProperties.ERROR;
				j.MensajeServicio = Util_Messages.Strings.ErrorConexionBBDDOracle + " (ERROR: " + err.message + ")";

				JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

				let log_DESCRIPCION = j.MensajeInterno;
				let log_DETALLE = j.MensajeServicio;

				let LogServiceReference = new logServiceReference();
				LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
													  App_Config.LogProperties.AMBIENTE,
													  Service_Params.name,
													  Operacion,
													  log_DESCRIPCION,
													  log_DETALLE);

				callback(JSONResponse, null);
				return;
			}

			let plsql = "BEGIN PKG_GESTION_USUARIOS.VALIDAR_USUARIO(:PK_EMAIL, :VPASSWORD, :IDUSUARIO, :VAUTORIZACION, :VESTADOCUENTA, :VMENSAJE, :ERRCODE, :ERRMESSAGE); END;";
			let bindvars = {
				PK_EMAIL: user_vEmail,
				VPASSWORD: user_vPassword,
				IDUSUARIO: { type: oracledb.STRING, maxSize: 2000, dir: oracledb.BIND_OUT },
				VAUTORIZACION: { type: oracledb.STRING, maxSize: 2000, dir: oracledb.BIND_OUT },
				VESTADOCUENTA: { type: oracledb.STRING, maxSize: 2000, dir: oracledb.BIND_OUT },
				VMENSAJE: { type: oracledb.STRING, maxSize: 2000, dir: oracledb.BIND_OUT },
				ERRCODE: { type: oracledb.STRING, maxSize: 10, dir : oracledb.BIND_OUT },
				ERRMESSAGE: { type: oracledb.STRING, maxSize: 2000, dir: oracledb.BIND_OUT }
			};

			connection.execute(plsql,
			bindvars,
			function(err, result) {
				if (err) {
					strResultado = "ORACLE ERROR: " + err.message;

					console.error("[D.A.L.][UsuariosDAO.js]: " + strResultado);
					doRelease(connection);

					//RESPONSE: ERROR
					let j = preRespDTO;
					j.CodigoHTTP = 500;
					j.MensajeInterno = App_Config.ValidationProperties.ERROR;
					j.MensajeServicio = Util_Messages.Strings.ErrorEjecucionOperacion + " (ERROR: " + err + ")";

					JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

					let log_DESCRIPCION = j.MensajeInterno;
					let log_DETALLE = j.MensajeServicio;

					let LogServiceReference = new logServiceReference();
					LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
														  App_Config.LogProperties.AMBIENTE,
														  Service_Params.name,
														  Operacion,
														  log_DESCRIPCION,
														  log_DETALLE);

					callback(JSONResponse, null);
					return;
				}
				strResultado = "ORACLE: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE;
				//console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);

				if (result.outBinds.ERRMESSAGE != App_Config.ValidationProperties.EXITO) {
					strResultado = "ORACLE ERROR: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE;
					//doClose(connection, result); // always close the result set
					doRelease(connection);

					//RESPONSE: ERROR
					let j = preRespDTO;
					j.CodigoHTTP = 400;
					j.MensajeInterno = App_Config.ValidationProperties.ERROR;
					j.MensajeServicio = Util_Messages.Strings.ErrorInesperado + " (ERROR: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE + ")";

					JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

					let log_DESCRIPCION = j.MensajeInterno;
					let log_DETALLE = j.MensajeServicio;

					let LogServiceReference = new logServiceReference();
					LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
														  App_Config.LogProperties.AMBIENTE,
														  Service_Params.name,
														  Operacion,
														  log_DESCRIPCION,
														  log_DETALLE);

					callback(JSONResponse, null);

				} else if (result.outBinds.ERRMESSAGE == App_Config.ValidationProperties.EXITO) {

					data = {IdUsuario: result.outBinds.IDUSUARIO,
									Usuario: user_vEmail,
									Autorizacion: result.outBinds.VAUTORIZACION,
									EstadoCuenta: result.outBinds.VESTADOCUENTA,
									Mensaje: result.outBinds.VMENSAJE};

					doRelease(connection);
					callback(null, data);
				}
			});
		});

		strResultado = App_Config.ValidationProperties.EXITO;
		console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);
	} else {
		strResultado = App_Config.ValidationProperties.ERROR;
		console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);
	}

	return strResultado;
};

function PKG_GESTION_USUARIOS_ACTUALIZAR_USUARIO(poolConnections, callback, App_Config, Service_Params, Util_Messages, request_method, Operacion,
	user_IdUsuario, user_vEmail, user_IdPerfilCuenta, user_IdEstadoCuenta, user_IdTipoCuenta, user_vEmailSecundario, user_vUsuarioSesion, user_vNombrePersona,
	user_vRutPersona, user_vRutComercial, user_vDireccionParticular, user_vDireccionComercial, user_vTelefonoPrimario, user_vTelefonoSecundario,
	user_vCelularPrimario, user_vCelularSecundario){
	console.log("[D.A.L.][UsuariosDAO.js][OPERATION]: " + Operacion);
	let JSONResponse;
	let Resultado;
	let data;

	let strResultado;

	if (Operacion) {

		/*
		oracledb.getConnection({
			 user: App_Config.OracleDbServer.User,
			 password: App_Config.OracleDbServer.Password,
			 connectString: App_Config.OracleDbServer.ConnectString
		},
    */
    poolConnections.getConnection(function(err, connection) {
			if (err) {
				console.error(err.message);
				//RESPONSE: ERROR
				let j = preRespDTO;
				j.CodigoHTTP = 400;
				j.MensajeInterno = App_Config.ValidationProperties.ERROR;
				j.MensajeServicio = Util_Messages.Strings.ErrorConexionBBDDOracle + " (ERROR: " + err.message + ")";

				JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

				let log_DESCRIPCION = j.MensajeInterno;
				let log_DETALLE = j.MensajeServicio;

				let LogServiceReference = new logServiceReference();
				LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
													  App_Config.LogProperties.AMBIENTE,
													  Service_Params.name,
													  Operacion,
													  log_DESCRIPCION,
													  log_DETALLE);

				callback(JSONResponse, null);
				return;
			}

			let plsql = "BEGIN PKG_GESTION_USUARIOS.ACTUALIZAR_USUARIO(:PK_IDUSUARIO, :PK_EMAIL, :FK_IDPERFILCUENTA, :FK_IDESTADOCUENTA, :FK_IDTIPOCUENTA, :VEMAILSECUNDARIO, :VUSUARIOSESION, :VNOMBREPERSONA, :VRUTPERSONA, :VRUTCOMERCIAL, :VDIRECCIONPARTICULAR, :VDIRECCIONCOMERCIAL, :VTELEFONOPRIMARIO, :VTELEFONOSECUNDARIO, :VCELULARPRIMARIO, :VCELULARSECUNDARIO, :ERRCODE, :ERRMESSAGE); END;";
			let bindvars = {
				PK_IDUSUARIO: user_IdUsuario,
				PK_EMAIL: user_vEmail,
				FK_IDPERFILCUENTA: user_IdPerfilCuenta,
				FK_IDESTADOCUENTA: user_IdEstadoCuenta,
				FK_IDTIPOCUENTA: user_IdTipoCuenta,
				VEMAILSECUNDARIO: user_vEmailSecundario,
				VUSUARIOSESION: user_vUsuarioSesion,
				VNOMBREPERSONA: user_vNombrePersona,
				VRUTPERSONA: user_vRutPersona,
				VRUTCOMERCIAL: user_vRutComercial,
				VDIRECCIONPARTICULAR: user_vDireccionParticular,
				VDIRECCIONCOMERCIAL: user_vDireccionComercial,
				VTELEFONOPRIMARIO: user_vTelefonoPrimario,
				VTELEFONOSECUNDARIO: user_vTelefonoSecundario,
				VCELULARPRIMARIO: user_vCelularPrimario,
				VCELULARSECUNDARIO: user_vCelularSecundario,
				ERRCODE: { type: oracledb.STRING, maxSize: 10, dir : oracledb.BIND_OUT },
				ERRMESSAGE: { type: oracledb.STRING, maxSize: 2000, dir: oracledb.BIND_OUT }
			};

			connection.execute(plsql,
			bindvars,
			function(err, result) {
				if (err) {
					strResultado = "ORACLE ERROR: " + err.message;

					console.error("[D.A.L.][UsuariosDAO.js]: " + strResultado);
					doRelease(connection);

					//RESPONSE: ERROR
					let j = preRespDTO;
					j.CodigoHTTP = 500;
					j.MensajeInterno = App_Config.ValidationProperties.ERROR;
					j.MensajeServicio = Util_Messages.Strings.ErrorEjecucionOperacion + " (ERROR: " + err + ")";

					JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

					let log_DESCRIPCION = j.MensajeInterno;
					let log_DETALLE = j.MensajeServicio;

					let LogServiceReference = new logServiceReference();
					LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
														  App_Config.LogProperties.AMBIENTE,
														  Service_Params.name,
														  Operacion,
														  log_DESCRIPCION,
														  log_DETALLE);

					callback(JSONResponse, null);
					return;
				}
				strResultado = "ORACLE: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE;
				//console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);

				if (result.outBinds.ERRMESSAGE != App_Config.ValidationProperties.EXITO) {
					strResultado = "ORACLE ERROR: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE;
					//doClose(connection, result); // always close the result set
					doRelease(connection);

					//RESPONSE: ERROR
					let j = preRespDTO;
					j.CodigoHTTP = 400;
					j.MensajeInterno = App_Config.ValidationProperties.ERROR;
					j.MensajeServicio = Util_Messages.Strings.ErrorModificarDatos + " (ERROR: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE + ")";

					JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

					let log_DESCRIPCION = j.MensajeInterno;
					let log_DETALLE = j.MensajeServicio;

					let LogServiceReference = new logServiceReference();
					LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
														  App_Config.LogProperties.AMBIENTE,
														  Service_Params.name,
														  Operacion,
														  log_DESCRIPCION,
														  log_DETALLE);

					callback(JSONResponse, null);

				} else if (result.outBinds.ERRMESSAGE == App_Config.ValidationProperties.EXITO) {
					doRelease(connection);
					data = {};
					callback(null, data);
				}
			});
		});

		strResultado = App_Config.ValidationProperties.EXITO;
		console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);
	} else {
		strResultado = App_Config.ValidationProperties.ERROR;
		console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);
	}

	return strResultado;
};

function PKG_GESTION_USUARIOS_ACTUALIZAR_DATOS_USUARIO(poolConnections, callback, App_Config, Service_Params, Util_Messages, request_method, Operacion,
	user_IdUsuario, user_vEmail, user_vEmailSecundario, user_vUsuarioSesion, user_vNombrePersona,
	user_vRutPersona, user_vRutComercial, user_vDireccionParticular, user_vDireccionComercial, user_vTelefonoPrimario, user_vTelefonoSecundario,
	user_vCelularPrimario, user_vCelularSecundario){
	console.log("[D.A.L.][UsuariosDAO.js][OPERATION]: " + Operacion);
	let JSONResponse;
	let Resultado;
	let data;

	let strResultado;

	if (Operacion) {

		/*
		oracledb.getConnection({
			 user: App_Config.OracleDbServer.User,
			 password: App_Config.OracleDbServer.Password,
			 connectString: App_Config.OracleDbServer.ConnectString
		},
    */
    poolConnections.getConnection(function(err, connection) {
			if (err) {
				console.error(err.message);
				//RESPONSE: ERROR
				let j = preRespDTO;
				j.CodigoHTTP = 400;
				j.MensajeInterno = App_Config.ValidationProperties.ERROR;
				j.MensajeServicio = Util_Messages.Strings.ErrorConexionBBDDOracle + " (ERROR: " + err.message + ")";

				JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

 				let log_DESCRIPCION = j.MensajeInterno;
 				let log_DETALLE = j.MensajeServicio;

				let LogServiceReference = new logServiceReference();
				LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
													  App_Config.LogProperties.AMBIENTE,
													  Service_Params.name,
													  Operacion,
													  log_DESCRIPCION,
													  log_DETALLE);

				callback(JSONResponse, null);
				return;
			}

			let plsql = "BEGIN PKG_GESTION_USUARIOS.ACTUALIZAR_DATOS_USUARIO(:PK_IDUSUARIO, :PK_EMAIL, :VEMAILSECUNDARIO, :VUSUARIOSESION, :VNOMBREPERSONA, :VRUTPERSONA, :VRUTCOMERCIAL, :VDIRECCIONPARTICULAR, :VDIRECCIONCOMERCIAL, :VTELEFONOPRIMARIO, :VTELEFONOSECUNDARIO, :VCELULARPRIMARIO, :VCELULARSECUNDARIO, :ERRCODE, :ERRMESSAGE); END;";
			let bindvars = {
				PK_IDUSUARIO: user_IdUsuario,
				PK_EMAIL: user_vEmail,
				VEMAILSECUNDARIO: user_vEmailSecundario,
				VUSUARIOSESION: user_vUsuarioSesion,
				VNOMBREPERSONA: user_vNombrePersona,
				VRUTPERSONA: user_vRutPersona,
				VRUTCOMERCIAL: user_vRutComercial,
				VDIRECCIONPARTICULAR: user_vDireccionParticular,
				VDIRECCIONCOMERCIAL: user_vDireccionComercial,
				VTELEFONOPRIMARIO: user_vTelefonoPrimario,
				VTELEFONOSECUNDARIO: user_vTelefonoSecundario,
				VCELULARPRIMARIO: user_vCelularPrimario,
				VCELULARSECUNDARIO: user_vCelularSecundario,
				ERRCODE: { type: oracledb.STRING, maxSize: 10, dir : oracledb.BIND_OUT },
				ERRMESSAGE: { type: oracledb.STRING, maxSize: 2000, dir: oracledb.BIND_OUT }
			};

			connection.execute(plsql,
			bindvars,
			function(err, result) {
				if (err) {
					strResultado = "ORACLE ERROR: " + err.message;

					console.error("[D.A.L.][UsuariosDAO.js]: " + strResultado);
					doRelease(connection);

					//RESPONSE: ERROR
					let j = preRespDTO;
					j.CodigoHTTP = 500;
					j.MensajeInterno = App_Config.ValidationProperties.ERROR;
					j.MensajeServicio = Util_Messages.Strings.ErrorEjecucionOperacion + " (ERROR: " + err + ")";

					JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

					let log_DESCRIPCION = j.MensajeInterno;
					let log_DETALLE = j.MensajeServicio;

					let LogServiceReference = new logServiceReference();
					LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
														  App_Config.LogProperties.AMBIENTE,
														  Service_Params.name,
														  Operacion,
														  log_DESCRIPCION,
														  log_DETALLE);

					callback(JSONResponse, null);
					return;
				}
				strResultado = "ORACLE: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE;
				//console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);

				if (result.outBinds.ERRMESSAGE != App_Config.ValidationProperties.EXITO) {
					strResultado = "ORACLE ERROR: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE;
					//doClose(connection, result); // always close the result set
					doRelease(connection);

					//RESPONSE: ERROR
					let j = preRespDTO;
					j.CodigoHTTP = 400;
					j.MensajeInterno = App_Config.ValidationProperties.ERROR;
					j.MensajeServicio = Util_Messages.Strings.ErrorModificarDatos + " (ERROR: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE + ")";

					JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

					let log_DESCRIPCION = j.MensajeInterno;
					let log_DETALLE = j.MensajeServicio;

					let LogServiceReference = new logServiceReference();
					LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
														  App_Config.LogProperties.AMBIENTE,
														  Service_Params.name,
														  Operacion,
														  log_DESCRIPCION,
														  log_DETALLE);

					callback(JSONResponse, null);

				} else if (result.outBinds.ERRMESSAGE == App_Config.ValidationProperties.EXITO) {
					doRelease(connection);
					data = {};
					callback(null, data);
				}
			});
		});

		strResultado = App_Config.ValidationProperties.EXITO;
		console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);
	} else {
		strResultado = App_Config.ValidationProperties.ERROR;
		console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);
	}

	return strResultado;
};

function PKG_GESTION_USUARIOS_ACTUALIZAR_PASSWORD(poolConnections, callback, App_Config, Service_Params, Util_Messages, request_method, Operacion,
												user_IdUsuario, user_Email, user_PasswordActual, user_NuevaPassword){
	console.log("[D.A.L.][UsuariosDAO.js][OPERATION]: " + Operacion);
	let JSONResponse;
	let Resultado;
	let data;

	let strResultado;

	if (Operacion) {

		/*
		oracledb.getConnection({
			 user: App_Config.OracleDbServer.User,
			 password: App_Config.OracleDbServer.Password,
			 connectString: App_Config.OracleDbServer.ConnectString
		},
    */
    poolConnections.getConnection(function(err, connection) {
			if (err) {
				console.error(err.message);
				//RESPONSE: ERROR
				let j = preRespDTO;
				j.CodigoHTTP = 400;
				j.MensajeInterno = App_Config.ValidationProperties.ERROR;
				j.MensajeServicio = Util_Messages.Strings.ErrorConexionBBDDOracle + " (ERROR: " + err.message + ")";

				JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

				let log_DESCRIPCION = j.MensajeInterno;
				let log_DETALLE = j.MensajeServicio;

				let LogServiceReference = new logServiceReference();
				LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
													  App_Config.LogProperties.AMBIENTE,
													  Service_Params.name,
													  Operacion,
													  log_DESCRIPCION,
													  log_DETALLE);

				callback(JSONResponse, null);
				return;
			}

			let plsql = "BEGIN PKG_GESTION_USUARIOS.ACTUALIZAR_PASSWORD(:PK_IDUSUARIO, :PK_EMAIL, :VPASSWORD_ACTUAL, :VNUEVA_PASSWORD, :NOMBRE_USUARIO, :EMAIL_USUARIO, :ERRCODE, :ERRMESSAGE); END;";
			let bindvars = {
				PK_IDUSUARIO: user_IdUsuario,
				PK_EMAIL: user_Email,
				VPASSWORD_ACTUAL: user_PasswordActual,
				VNUEVA_PASSWORD: user_NuevaPassword,
				NOMBRE_USUARIO: { type: oracledb.STRING, maxSize: 500, dir: oracledb.BIND_OUT },
				EMAIL_USUARIO: { type: oracledb.STRING, maxSize: 500, dir: oracledb.BIND_OUT },
				ERRCODE: { type: oracledb.STRING, maxSize: 10, dir : oracledb.BIND_OUT },
				ERRMESSAGE: { type: oracledb.STRING, maxSize: 2000, dir: oracledb.BIND_OUT }
			};

			connection.execute(plsql,
			bindvars,
			function(err, result) {
				var vCodigoHTTP = 0;
				if (err) {
					strResultado = "ORACLE ERROR: " + err.message;

					console.error("[D.A.L.][UsuariosDAO.js]: " + strResultado);
					doRelease(connection);

					//RESPONSE: ERROR
					let j = preRespDTO;
					j.CodigoHTTP = 500;
					j.MensajeInterno = App_Config.ValidationProperties.ERROR;
					j.MensajeServicio = Util_Messages.Strings.ErrorEjecucionOperacion + " (ERROR: " + err + ")";

					JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

					let log_DESCRIPCION = j.MensajeInterno;
					let log_DETALLE = j.MensajeServicio;

					let LogServiceReference = new logServiceReference();
					LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
														  App_Config.LogProperties.AMBIENTE,
														  Service_Params.name,
														  Operacion,
														  log_DESCRIPCION,
														  log_DETALLE);

					callback(JSONResponse, null);
					return;
				}
				strResultado = "ORACLE: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE;
				//console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);

				if (result.outBinds.ERRMESSAGE != App_Config.ValidationProperties.EXITO) {
					strResultado = "ORACLE ERROR: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE;
					//doClose(connection, result); // always close the result set
					doRelease(connection);

					//RESPONSE: ERROR
					let j = preRespDTO;
					j.CodigoHTTP = 400;
					j.MensajeInterno = App_Config.ValidationProperties.ERROR;
					j.MensajeServicio = Util_Messages.Strings.ErrorModificarDatos + " (ERROR: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE + ")";

					JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

					let log_DESCRIPCION = j.MensajeInterno;
					let log_DETALLE = j.MensajeServicio;

					let LogServiceReference = new logServiceReference();
					LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
														  App_Config.LogProperties.AMBIENTE,
														  Service_Params.name,
														  Operacion,
														  log_DESCRIPCION,
														  log_DETALLE);

					callback(JSONResponse, null);

				} else if (result.outBinds.ERRMESSAGE == App_Config.ValidationProperties.EXITO) {
					doRelease(connection);

					data = {IdUsuario: user_IdUsuario,
									NombreUsuario: result.outBinds.NOMBRE_USUARIO,
									Email: result.outBinds.EMAIL_USUARIO};

					callback(null, data);
				}
			});
		});

		strResultado = App_Config.ValidationProperties.EXITO;
		console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);
	} else {
		strResultado = App_Config.ValidationProperties.ERROR;
		console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);
	}

	return strResultado;
};

function PKG_GESTION_USUARIOS_ACTUALIZAR_PERFIL_CUENTA(poolConnections, callback, App_Config, Service_Params, Util_Messages, request_method, Operacion,
												user_IdUsuario,
												user_IdPerfilCuenta){
	console.log("[D.A.L.][UsuariosDAO.js][OPERATION]: " + Operacion);
	let JSONResponse;
	let Resultado;
	let data;

	let strResultado;

	if (Operacion) {

		/*
		oracledb.getConnection({
			 user: App_Config.OracleDbServer.User,
			 password: App_Config.OracleDbServer.Password,
			 connectString: App_Config.OracleDbServer.ConnectString
		},
    */
    poolConnections.getConnection(function(err, connection) {
			if (err) {
				console.error(err.message);
				//RESPONSE: ERROR
				let j = preRespDTO;
				j.CodigoHTTP = 400;
				j.MensajeInterno = App_Config.ValidationProperties.ERROR;
				j.MensajeServicio = Util_Messages.Strings.ErrorConexionBBDDOracle + " (ERROR: " + err.message + ")";

				JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

				let log_DESCRIPCION = j.MensajeInterno;
				let log_DETALLE = j.MensajeServicio;

				let LogServiceReference = new logServiceReference();
				LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
													  App_Config.LogProperties.AMBIENTE,
													  Service_Params.name,
													  Operacion,
													  log_DESCRIPCION,
													  log_DETALLE);

				callback(JSONResponse, null);
				return;
			}

			let plsql = "BEGIN PKG_GESTION_USUARIOS.ACTUALIZAR_PERFIL_CUENTA(:PK_IDUSUARIO, :FK_IDPERFILCUENTA, :ERRCODE, :ERRMESSAGE); END;";
			let bindvars = {
				PK_IDUSUARIO: user_IdUsuario,
				FK_IDPERFILCUENTA: user_IdPerfilCuenta,
				ERRCODE: { type: oracledb.STRING, maxSize: 10, dir : oracledb.BIND_OUT },
				ERRMESSAGE: { type: oracledb.STRING, maxSize: 2000, dir: oracledb.BIND_OUT }
			};

			connection.execute(plsql,
			bindvars,
			function(err, result) {
				if (err) {
					strResultado = "ORACLE ERROR: " + err.message;

					console.error("[D.A.L.][UsuariosDAO.js]: " + strResultado);
					doRelease(connection);

					//RESPONSE: ERROR
					let j = preRespDTO;
					j.CodigoHTTP = 500;
					j.MensajeInterno = App_Config.ValidationProperties.ERROR;
					j.MensajeServicio = Util_Messages.Strings.ErrorEjecucionOperacion + " (ERROR: " + err + ")";

					JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

					let log_DESCRIPCION = j.MensajeInterno;
					let log_DETALLE = j.MensajeServicio;

					let LogServiceReference = new logServiceReference();
					LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
														  App_Config.LogProperties.AMBIENTE,
														  Service_Params.name,
														  Operacion,
														  log_DESCRIPCION,
														  log_DETALLE);

					callback(JSONResponse, null);
					return;
				}
				strResultado = "ORACLE: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE;
				//console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);

				if (result.outBinds.ERRMESSAGE != App_Config.ValidationProperties.EXITO) {
					strResultado = "ORACLE ERROR: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE;
					//doClose(connection, result); // always close the result set
					doRelease(connection);

					//RESPONSE: ERROR
					let j = preRespDTO;
					j.CodigoHTTP = 400;
					j.MensajeInterno = App_Config.ValidationProperties.ERROR;
					j.MensajeServicio = Util_Messages.Strings.ErrorModificarDatos + " (ERROR: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE + ")";

					JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

					let log_DESCRIPCION = j.MensajeInterno;
					let log_DETALLE = j.MensajeServicio;

					let LogServiceReference = new logServiceReference();
					LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
														  App_Config.LogProperties.AMBIENTE,
														  Service_Params.name,
														  Operacion,
														  log_DESCRIPCION,
														  log_DETALLE);

					callback(JSONResponse, null);

				} else if (result.outBinds.ERRMESSAGE == App_Config.ValidationProperties.EXITO) {
					doRelease(connection);
					data = {};
					callback(null, data);
				}
			});
		});

		strResultado = App_Config.ValidationProperties.EXITO;
		console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);
	} else {
		strResultado = App_Config.ValidationProperties.ERROR;
		console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);
	}

	return strResultado;
};

function PKG_GESTION_USUARIOS_ACTUALIZAR_ESTADO_CUENTA(poolConnections, callback, App_Config, Service_Params, Util_Messages, request_method, Operacion,
												user_IdUsuario,
												user_IdEstadoCuenta){
	console.log("[D.A.L.][UsuariosDAO.js][OPERATION]: " + Operacion);
	let JSONResponse;
	let Resultado;
	let data;

	let strResultado;

	if (Operacion) {

		/*
		oracledb.getConnection({
			 user: App_Config.OracleDbServer.User,
			 password: App_Config.OracleDbServer.Password,
			 connectString: App_Config.OracleDbServer.ConnectString
		},
    */
    poolConnections.getConnection(function(err, connection) {
			if (err) {
				console.error(err.message);
				//RESPONSE: ERROR
				let j = preRespDTO;
				j.CodigoHTTP = 400;
				j.MensajeInterno = App_Config.ValidationProperties.ERROR;
				j.MensajeServicio = Util_Messages.Strings.ErrorConexionBBDDOracle + " (ERROR: " + err.message + ")";

				JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

				let log_DESCRIPCION = j.MensajeInterno;
				let log_DETALLE = j.MensajeServicio;

				let LogServiceReference = new logServiceReference();
				LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
													  App_Config.LogProperties.AMBIENTE,
													  Service_Params.name,
													  Operacion,
													  log_DESCRIPCION,
													  log_DETALLE);

				callback(JSONResponse, null);
				return;
			}

			let plsql = "BEGIN PKG_GESTION_USUARIOS.ACTUALIZAR_ESTADO_CUENTA(:PK_IDUSUARIO, :FK_IDESTADOCUENTA, :ERRCODE, :ERRMESSAGE); END;";
			let bindvars = {
				PK_IDUSUARIO: user_IdUsuario,
				FK_IDESTADOCUENTA: user_IdEstadoCuenta,
				ERRCODE: { type: oracledb.STRING, maxSize: 10, dir : oracledb.BIND_OUT },
				ERRMESSAGE: { type: oracledb.STRING, maxSize: 2000, dir: oracledb.BIND_OUT }
			};

			connection.execute(plsql,
			bindvars,
			function(err, result) {
				if (err) {
					strResultado = "ORACLE ERROR: " + err.message;

					console.error("[D.A.L.][UsuariosDAO.js]: " + strResultado);
					doRelease(connection);

					//RESPONSE: ERROR
					let j = preRespDTO;
					j.CodigoHTTP = 500;
					j.MensajeInterno = App_Config.ValidationProperties.ERROR;
					j.MensajeServicio = Util_Messages.Strings.ErrorEjecucionOperacion + " (ERROR: " + err + ")";

					JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

					let log_DESCRIPCION = j.MensajeInterno;
					let log_DETALLE = j.MensajeServicio;

					let LogServiceReference = new logServiceReference();
					LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
														  App_Config.LogProperties.AMBIENTE,
														  Service_Params.name,
														  Operacion,
														  log_DESCRIPCION,
														  log_DETALLE);

					callback(JSONResponse, null);
					return;
				}
				strResultado = "ORACLE: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE;
				//console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);

				if (result.outBinds.ERRMESSAGE != App_Config.ValidationProperties.EXITO) {
					strResultado = "ORACLE ERROR: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE;
					//doClose(connection, result); // always close the result set
					doRelease(connection);

					//RESPONSE: ERROR
					let j = preRespDTO;
					j.CodigoHTTP = 400;
					j.MensajeInterno = App_Config.ValidationProperties.ERROR;
					j.MensajeServicio = Util_Messages.Strings.ErrorModificarDatos + " (ERROR: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE + ")";

					JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

					let log_DESCRIPCION = j.MensajeInterno;
					let log_DETALLE = j.MensajeServicio;

					let LogServiceReference = new logServiceReference();
					LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
														  App_Config.LogProperties.AMBIENTE,
														  Service_Params.name,
														  Operacion,
														  log_DESCRIPCION,
														  log_DETALLE);

					callback(JSONResponse, null);

				} else if (result.outBinds.ERRMESSAGE == App_Config.ValidationProperties.EXITO) {
					doRelease(connection);
					data = {};
					callback(null, data);
				}
			});
		});

		strResultado = App_Config.ValidationProperties.EXITO;
		console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);
	} else {
		strResultado = App_Config.ValidationProperties.ERROR;
		console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);
	}

	return strResultado;
};

function PKG_GESTION_USUARIOS_ACTUALIZAR_TIPO_CUENTA(poolConnections, callback, App_Config, Service_Params, Util_Messages, request_method, Operacion,
												user_IdUsuario,
												user_IdTipoCuenta){
	console.log("[D.A.L.][UsuariosDAO.js][OPERATION]: " + Operacion);
	let JSONResponse;
	let Resultado;
	let data;

	let strResultado;

	if (Operacion) {

		/*
		oracledb.getConnection({
			 user: App_Config.OracleDbServer.User,
			 password: App_Config.OracleDbServer.Password,
			 connectString: App_Config.OracleDbServer.ConnectString
		},
    */
    poolConnections.getConnection(function(err, connection) {
			if (err) {
				console.error(err.message);
				//RESPONSE: ERROR
				let j = preRespDTO;
				j.CodigoHTTP = 400;
				j.MensajeInterno = App_Config.ValidationProperties.ERROR;
				j.MensajeServicio = Util_Messages.Strings.ErrorConexionBBDDOracle + " (ERROR: " + err.message + ")";

				JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

				let log_DESCRIPCION = j.MensajeInterno;
				let log_DETALLE = j.MensajeServicio;

				let LogServiceReference = new logServiceReference();
				LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
													  App_Config.LogProperties.AMBIENTE,
													  Service_Params.name,
													  Operacion,
													  log_DESCRIPCION,
													  log_DETALLE);

				callback(JSONResponse, null);
				return;
			}

			let plsql = "BEGIN PKG_GESTION_USUARIOS.ACTUALIZAR_TIPO_CUENTA(:PK_IDUSUARIO, :FK_IDTIPOCUENTA, :ERRCODE, :ERRMESSAGE); END;";
			let bindvars = {
				PK_IDUSUARIO: user_IdUsuario,
				FK_IDTIPOCUENTA: user_IdTipoCuenta,
				ERRCODE: { type: oracledb.STRING, maxSize: 10, dir : oracledb.BIND_OUT },
				ERRMESSAGE: { type: oracledb.STRING, maxSize: 2000, dir: oracledb.BIND_OUT }
			};

			connection.execute(plsql,
			bindvars,
			function(err, result) {
				if (err) {
					strResultado = "ORACLE ERROR: " + err.message;

					console.error("[D.A.L.][UsuariosDAO.js]: " + strResultado);
					doRelease(connection);

					//RESPONSE: ERROR
					let j = preRespDTO;
					j.CodigoHTTP = 500;
					j.MensajeInterno = App_Config.ValidationProperties.ERROR;
					j.MensajeServicio = Util_Messages.Strings.ErrorEjecucionOperacion + " (ERROR: " + err + ")";

					JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

					let log_DESCRIPCION = j.MensajeInterno;
					let log_DETALLE = j.MensajeServicio;

					let LogServiceReference = new logServiceReference();
					LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
														  App_Config.LogProperties.AMBIENTE,
														  Service_Params.name,
														  Operacion,
														  log_DESCRIPCION,
														  log_DETALLE);

					callback(JSONResponse, null);
					return;
				}
				strResultado = "ORACLE: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE;
				//console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);

				if (result.outBinds.ERRMESSAGE != App_Config.ValidationProperties.EXITO) {
					strResultado = "ORACLE ERROR: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE;
					//doClose(connection, result); // always close the result set
					doRelease(connection);

					//RESPONSE: ERROR
					let j = preRespDTO;
					j.CodigoHTTP = 400;
					j.MensajeInterno = App_Config.ValidationProperties.ERROR;
					j.MensajeServicio = Util_Messages.Strings.ErrorModificarDatos + " (ERROR: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE + ")";

					JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

					let log_DESCRIPCION = j.MensajeInterno;
					let log_DETALLE = j.MensajeServicio;

					let LogServiceReference = new logServiceReference();
					LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
														  App_Config.LogProperties.AMBIENTE,
														  Service_Params.name,
														  Operacion,
														  log_DESCRIPCION,
														  log_DETALLE);

					callback(JSONResponse, null);

				} else if (result.outBinds.ERRMESSAGE == App_Config.ValidationProperties.EXITO) {
					doRelease(connection);
					data = {};
					callback(null, data);
				}
			});
		});

		strResultado = App_Config.ValidationProperties.EXITO;
		console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);
	} else {
		strResultado = App_Config.ValidationProperties.ERROR;
		console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);
	}

	return strResultado;
};

function PKG_GESTION_USUARIOS_BLOQUEAR_USUARIO(poolConnections, callback, App_Config, Service_Params, Util_Messages, request_method, Operacion,
												user_IdUsuario){
	console.log("[D.A.L.][UsuariosDAO.js][OPERATION]: " + Operacion);
	let JSONResponse;
	let Resultado;
	let data;

	let strResultado;

	if (Operacion) {

		/*
		oracledb.getConnection({
			 user: App_Config.OracleDbServer.User,
			 password: App_Config.OracleDbServer.Password,
			 connectString: App_Config.OracleDbServer.ConnectString
		},
    */
    poolConnections.getConnection(function(err, connection) {
			if (err) {
				console.error(err.message);
				//RESPONSE: ERROR
				let j = preRespDTO;
				j.CodigoHTTP = 400;
				j.MensajeInterno = App_Config.ValidationProperties.ERROR;
				j.MensajeServicio = Util_Messages.Strings.ErrorConexionBBDDOracle + " (ERROR: " + err.message + ")";

				JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

				let log_DESCRIPCION = j.MensajeInterno;
				let log_DETALLE = j.MensajeServicio;

				let LogServiceReference = new logServiceReference();
				LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
													  App_Config.LogProperties.AMBIENTE,
													  Service_Params.name,
													  Operacion,
													  log_DESCRIPCION,
													  log_DETALLE);

				callback(JSONResponse, null);
				return;
			}

			let plsql = "BEGIN PKG_GESTION_USUARIOS.BLOQUEAR_USUARIO(:PK_IDUSUARIO, :ERRCODE, :ERRMESSAGE); END;";
			let bindvars = {
				PK_IDUSUARIO: user_IdUsuario,
				ERRCODE: { type: oracledb.STRING, maxSize: 10, dir : oracledb.BIND_OUT },
				ERRMESSAGE: { type: oracledb.STRING, maxSize: 2000, dir: oracledb.BIND_OUT }
			};

			connection.execute(plsql,
			bindvars,
			function(err, result) {
				if (err) {
					strResultado = "ORACLE ERROR: " + err.message;

					console.error("[D.A.L.][UsuariosDAO.js]: " + strResultado);
					doRelease(connection);

					//RESPONSE: ERROR
					let j = preRespDTO;
					j.CodigoHTTP = 500;
					j.MensajeInterno = App_Config.ValidationProperties.ERROR;
					j.MensajeServicio = Util_Messages.Strings.ErrorEjecucionOperacion + " (ERROR: " + err + ")";

					JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

					let log_DESCRIPCION = j.MensajeInterno;
					let log_DETALLE = j.MensajeServicio;

					let LogServiceReference = new logServiceReference();
					LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
														  App_Config.LogProperties.AMBIENTE,
														  Service_Params.name,
														  Operacion,
														  log_DESCRIPCION,
														  log_DETALLE);

					callback(JSONResponse, null);
					return;
				}
				strResultado = "ORACLE: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE;
				//console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);

				if (result.outBinds.ERRMESSAGE != App_Config.ValidationProperties.EXITO) {
					strResultado = "ORACLE ERROR: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE;
					//doClose(connection, result); // always close the result set
					doRelease(connection);

					//RESPONSE: ERROR
					let j = preRespDTO;
					j.CodigoHTTP = 400;
					j.MensajeInterno = App_Config.ValidationProperties.ERROR;
					j.MensajeServicio = Util_Messages.Strings.ErrorInesperado + " (ERROR: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE + ")";

					JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

					let log_DESCRIPCION = j.MensajeInterno;
					let log_DETALLE = j.MensajeServicio;

					let LogServiceReference = new logServiceReference();
					LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
														  App_Config.LogProperties.AMBIENTE,
														  Service_Params.name,
														  Operacion,
														  log_DESCRIPCION,
														  log_DETALLE);

					callback(JSONResponse, null);

				} else if (result.outBinds.ERRMESSAGE == App_Config.ValidationProperties.EXITO) {
					doRelease(connection);
					data = {};
					callback(null, data);
				}
			});
		});

		strResultado = App_Config.ValidationProperties.EXITO;
		console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);
	} else {
		strResultado = App_Config.ValidationProperties.ERROR;
		console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);
	}

	return strResultado;
};

function PKG_GESTION_USUARIOS_ELIMINAR_USUARIO(poolConnections, callback, App_Config, Service_Params, Util_Messages, request_method, Operacion,
												user_IdUsuario){
	console.log("[D.A.L.][UsuariosDAO.js][OPERATION]: " + Operacion);
	let JSONResponse;
	let Resultado;
	let data;

	let strResultado;

	if (Operacion) {

		/*
		oracledb.getConnection({
			 user: App_Config.OracleDbServer.User,
			 password: App_Config.OracleDbServer.Password,
			 connectString: App_Config.OracleDbServer.ConnectString
		},
    */
    poolConnections.getConnection(function(err, connection) {
			if (err) {
				console.error(err.message);
				//RESPONSE: ERROR
				let j = preRespDTO;
				j.CodigoHTTP = 400;
				j.MensajeInterno = App_Config.ValidationProperties.ERROR;
				j.MensajeServicio = Util_Messages.Strings.ErrorConexionBBDDOracle + " (ERROR: " + err.message + ")";

				JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

				let log_DESCRIPCION = j.MensajeInterno;
				let log_DETALLE = j.MensajeServicio;

				let LogServiceReference = new logServiceReference();
				LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
													  App_Config.LogProperties.AMBIENTE,
													  Service_Params.name,
													  Operacion,
													  log_DESCRIPCION,
													  log_DETALLE);

				callback(JSONResponse, null);
				return;
			}

			let plsql = "BEGIN PKG_GESTION_USUARIOS.ELIMINAR_USUARIO(:PK_IDUSUARIO, :ERRCODE, :ERRMESSAGE); END;";
			let bindvars = {
				PK_IDUSUARIO: user_IdUsuario,
				ERRCODE: { type: oracledb.STRING, maxSize: 10, dir : oracledb.BIND_OUT },
				ERRMESSAGE: { type: oracledb.STRING, maxSize: 2000, dir: oracledb.BIND_OUT }
			};

			connection.execute(plsql,
			bindvars,
			function(err, result) {
				if (err) {
					strResultado = "ORACLE ERROR: " + err.message;

					console.error("[D.A.L.][UsuariosDAO.js]: " + strResultado);
					doRelease(connection);

					//RESPONSE: ERROR
					let j = preRespDTO;
					j.CodigoHTTP = 500;
					j.MensajeInterno = App_Config.ValidationProperties.ERROR;
					j.MensajeServicio = Util_Messages.Strings.ErrorEjecucionOperacion + " (ERROR: " + err + ")";

					JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

					let log_DESCRIPCION = j.MensajeInterno;
					let log_DETALLE = j.MensajeServicio;

					let LogServiceReference = new logServiceReference();
					LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
														  App_Config.LogProperties.AMBIENTE,
														  Service_Params.name,
														  Operacion,
														  log_DESCRIPCION,
														  log_DETALLE);

					callback(JSONResponse, null);
					return;
				}
				strResultado = "ORACLE: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE;
				//console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);

				if (result.outBinds.ERRMESSAGE != App_Config.ValidationProperties.EXITO) {
					strResultado = "ORACLE ERROR: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE;
					//doClose(connection, result); // always close the result set
					doRelease(connection);

					//RESPONSE: ERROR
					let j = preRespDTO;
					j.CodigoHTTP = 400;
					j.MensajeInterno = App_Config.ValidationProperties.ERROR;
					j.MensajeServicio = Util_Messages.Strings.ErrorEliminarDatos + " (ERROR: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE + ")";

					JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

					let log_DESCRIPCION = j.MensajeInterno;
					let log_DETALLE = j.MensajeServicio;

					let LogServiceReference = new logServiceReference();
					LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
														  App_Config.LogProperties.AMBIENTE,
														  Service_Params.name,
														  Operacion,
														  log_DESCRIPCION,
														  log_DETALLE);

					callback(JSONResponse, null);

				} else if (result.outBinds.ERRMESSAGE == App_Config.ValidationProperties.EXITO) {
					doRelease(connection);
					data = {};
					callback(null, data);
				}
			});
		});

		strResultado = App_Config.ValidationProperties.EXITO;
		console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);
	} else {
		strResultado = App_Config.ValidationProperties.ERROR;
		console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);
	}

	return strResultado;
};

function PKG_GESTION_USUARIOS_ACTIVAR_USUARIO(poolConnections, callback, App_Config, Service_Params, Util_Messages, request_method, Operacion,
												user_IdUsuario){
	console.log("[D.A.L.][UsuariosDAO.js][OPERATION]: " + Operacion);
	let JSONResponse;
	let Resultado;
	let data;

	let strResultado;

	if (Operacion) {

		/*
		oracledb.getConnection({
			 user: App_Config.OracleDbServer.User,
			 password: App_Config.OracleDbServer.Password,
			 connectString: App_Config.OracleDbServer.ConnectString
		},
    */
    poolConnections.getConnection(function(err, connection) {
			if (err) {
				console.error(err.message);
				//RESPONSE: ERROR
				let j = preRespDTO;
				j.CodigoHTTP = 400;
				j.MensajeInterno = App_Config.ValidationProperties.ERROR;
				j.MensajeServicio = Util_Messages.Strings.ErrorConexionBBDDOracle + " (ERROR: " + err.message + ")";

				JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

				let log_DESCRIPCION = j.MensajeInterno;
				let log_DETALLE = j.MensajeServicio;

				let LogServiceReference = new logServiceReference();
				LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
													  App_Config.LogProperties.AMBIENTE,
													  Service_Params.name,
													  Operacion,
													  log_DESCRIPCION,
													  log_DETALLE);

				callback(JSONResponse, null);
				return;
			}

			let plsql = "BEGIN PKG_GESTION_USUARIOS.ACTIVAR_USUARIO(:PK_IDUSUARIO, :NOMBRE_USUARIO, :EMAIL_USUARIO, :ERRCODE, :ERRMESSAGE); END;";
			let bindvars = {
				PK_IDUSUARIO: user_IdUsuario,
				NOMBRE_USUARIO: { type: oracledb.STRING, maxSize: 500, dir: oracledb.BIND_OUT },
				EMAIL_USUARIO: { type: oracledb.STRING, maxSize: 500, dir: oracledb.BIND_OUT },
				ERRCODE: { type: oracledb.STRING, maxSize: 10, dir : oracledb.BIND_OUT },
				ERRMESSAGE: { type: oracledb.STRING, maxSize: 2000, dir: oracledb.BIND_OUT }
			};

			connection.execute(plsql,
			bindvars,
			function(err, result) {
				if (err) {
					strResultado = "ORACLE ERROR: " + err.message;

					console.error("[D.A.L.][UsuariosDAO.js]: " + strResultado);
					doRelease(connection);

					//RESPONSE: ERROR
					let j = preRespDTO;
					j.CodigoHTTP = 500;
					j.MensajeInterno = App_Config.ValidationProperties.ERROR;
					j.MensajeServicio = Util_Messages.Strings.ErrorEjecucionOperacion + " (ERROR: " + err + ")";

					JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

					let log_DESCRIPCION = j.MensajeInterno;
					let log_DETALLE = j.MensajeServicio;

					let LogServiceReference = new logServiceReference();
					LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
														  App_Config.LogProperties.AMBIENTE,
														  Service_Params.name,
														  Operacion,
														  log_DESCRIPCION,
														  log_DETALLE);

					callback(JSONResponse, null);
					return;
				}
				strResultado = "ORACLE: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE;
				//console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);

				if (result.outBinds.ERRMESSAGE != App_Config.ValidationProperties.EXITO) {
					strResultado = "ORACLE ERROR: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE;
					//doClose(connection, result); // always close the result set
					doRelease(connection);

					//RESPONSE: ERROR
					let j = preRespDTO;
					j.CodigoHTTP = 400;
					j.MensajeInterno = App_Config.ValidationProperties.ERROR;
					j.MensajeServicio = Util_Messages.Strings.ErrorInesperado + " (ERROR: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE + ")";

					JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

					let log_DESCRIPCION = j.MensajeInterno;
					let log_DETALLE = j.MensajeServicio;

					let LogServiceReference = new logServiceReference();
					LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
														  App_Config.LogProperties.AMBIENTE,
														  Service_Params.name,
														  Operacion,
														  log_DESCRIPCION,
														  log_DETALLE);

					callback(JSONResponse, null);

				} else if (result.outBinds.ERRMESSAGE == App_Config.ValidationProperties.EXITO) {
					doRelease(connection);

					data = {IdUsuario: user_IdUsuario,
									NombreUsuario: result.outBinds.NOMBRE_USUARIO,
									Email: result.outBinds.EMAIL_USUARIO};

					callback(null, data);
				}
			});
		});

		strResultado = App_Config.ValidationProperties.EXITO;
		console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);
	} else {
		strResultado = App_Config.ValidationProperties.ERROR;
		console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);
	}

	return strResultado;
};

function PKG_GESTION_USUARIOS_INACTIVAR_USUARIO(poolConnections, callback, App_Config, Service_Params, Util_Messages, request_method, Operacion,
												user_IdUsuario){
	console.log("[D.A.L.][UsuariosDAO.js][OPERATION]: " + Operacion);
	let JSONResponse;
	let Resultado;
	let data;

	let strResultado;

	if (Operacion) {

		/*
		oracledb.getConnection({
			 user: App_Config.OracleDbServer.User,
			 password: App_Config.OracleDbServer.Password,
			 connectString: App_Config.OracleDbServer.ConnectString
		},
    */
    poolConnections.getConnection(function(err, connection) {
			if (err) {
				console.error(err.message);
				//RESPONSE: ERROR
				let j = preRespDTO;
				j.CodigoHTTP = 400;
				j.MensajeInterno = App_Config.ValidationProperties.ERROR;
				j.MensajeServicio = Util_Messages.Strings.ErrorConexionBBDDOracle + " (ERROR: " + err.message + ")";

				JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

				let log_DESCRIPCION = j.MensajeInterno;
				let log_DETALLE = j.MensajeServicio;

				let LogServiceReference = new logServiceReference();
				LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
													  App_Config.LogProperties.AMBIENTE,
													  Service_Params.name,
													  Operacion,
													  log_DESCRIPCION,
													  log_DETALLE);

				callback(JSONResponse, null);
				return;
			}

			let plsql = "BEGIN PKG_GESTION_USUARIOS.INACTIVAR_USUARIO(:PK_IDUSUARIO, :ERRCODE, :ERRMESSAGE); END;";
			let bindvars = {
				PK_IDUSUARIO: user_IdUsuario,
				ERRCODE: { type: oracledb.STRING, maxSize: 10, dir : oracledb.BIND_OUT },
				ERRMESSAGE: { type: oracledb.STRING, maxSize: 2000, dir: oracledb.BIND_OUT }
			};

			connection.execute(plsql,
			bindvars,
			function(err, result) {
				if (err) {
					strResultado = "ORACLE ERROR: " + err.message;

					console.error("[D.A.L.][UsuariosDAO.js]: " + strResultado);
					doRelease(connection);

					//RESPONSE: ERROR
					let j = preRespDTO;
					j.CodigoHTTP = 500;
					j.MensajeInterno = App_Config.ValidationProperties.ERROR;
					j.MensajeServicio = Util_Messages.Strings.ErrorEjecucionOperacion + " (ERROR: " + err + ")";

					JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

					let log_DESCRIPCION = j.MensajeInterno;
					let log_DETALLE = j.MensajeServicio;

					let LogServiceReference = new logServiceReference();
					LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
														  App_Config.LogProperties.AMBIENTE,
														  Service_Params.name,
														  Operacion,
														  log_DESCRIPCION,
														  log_DETALLE);

					callback(JSONResponse, null);
					return;
				}
				strResultado = "ORACLE: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE;
				//console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);

				if (result.outBinds.ERRMESSAGE != App_Config.ValidationProperties.EXITO) {
					strResultado = "ORACLE ERROR: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE;
					//doClose(connection, result); // always close the result set
					doRelease(connection);

					//RESPONSE: ERROR
					let j = preRespDTO;
					j.CodigoHTTP = 400;
					j.MensajeInterno = App_Config.ValidationProperties.ERROR;
					j.MensajeServicio = Util_Messages.Strings.ErrorInesperado + " (ERROR: " + result.outBinds.ERRCODE + "; " + result.outBinds.ERRMESSAGE + ")";

					JSONResponse = GENERA_RESPONSE_ERROR(j.CodigoHTTP, request_method, Operacion, j.MensajeInterno, j.MensajeServicio);

					let log_DESCRIPCION = j.MensajeInterno;
					let log_DETALLE = j.MensajeServicio;

					let LogServiceReference = new logServiceReference();
					LogServiceReference.ingresarLogDirect(App_Config.LogProperties.TIPOLOG_ERROR,
														  App_Config.LogProperties.AMBIENTE,
														  Service_Params.name,
														  Operacion,
														  log_DESCRIPCION,
														  log_DETALLE);

					callback(JSONResponse, null);

				} else if (result.outBinds.ERRMESSAGE == App_Config.ValidationProperties.EXITO) {
					doRelease(connection);

					data = {};
					callback(null, data);
				}
			});
		});

		strResultado = App_Config.ValidationProperties.EXITO;
		console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);
	} else {
		strResultado = App_Config.ValidationProperties.ERROR;
		console.log("[D.A.L.][UsuariosDAO.js]: " + strResultado);
	}

	return strResultado;
};

function GENERA_RESPONSE_ERROR(CodigoHTTP, request_method, Operacion, MensajeInterno, MensajeServicio) {
	let r = responseDTO;
	console.log("[SERVICE][ERROR]: [GENERANDO RESPONSE]");
	let fechaHoy = new Date();
	let fechaHoy_formatted = datetime.format(fechaHoy, 'DD/MM/YYYY - HH:mm:ss');

	r.Response.Header.NombreOperacion = Operacion;
	r.Response.Info.FechaHora = fechaHoy_formatted;
	r.Response.Info.RequestMethod = request_method;
	r.Response.Return.BodyData = {};

	r.Response.Resultado.Codigo = 1
	r.Response.Resultado.OrigenMensaje = "[SERVICIO]"
	r.Response.Resultado.CodigoHTTP = CodigoHTTP;
	r.Response.Resultado.MensajeInterno = MensajeInterno;
	r.Response.Resultado.MensajeServicio = MensajeServicio;

	return JSON.stringify(r);
};
