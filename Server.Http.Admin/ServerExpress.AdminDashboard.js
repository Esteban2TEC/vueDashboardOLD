function serverStart(){

	const log4js = require('log4js');
	log4js.loadAppender('file');
	log4js.addAppender(log4js.appenders.file(__dirname + '/logs/Http.Server.AdminDashboard.log'), 'HttpServer.AdminDashboard');
	const logger = log4js.getLogger('HttpServer.AdminDashboard');

	/*
	logger.trace('Entering cheese testing');
	logger.debug('Got cheese.');
	logger.info('Cheese is Gouda.');
	logger.warn('Cheese is quite smelly.');
	logger.error('Cheese is too ripe!');
	logger.fatal('Cheese was breeding ground for listeria.');
	*/

	//DEPENDENCIA: Util
	const utilServerLog = require("./Http.Server.Util/Literals.Log/serverConsoleLog");

	logger.info("*****************************************************");
	logger.info(utilServerLog.ServerLog.Starting + "HTTP Server Engine: ...");

	logger.info(utilServerLog.ServerLog.Loading + "SERVER PARAMETERS: ...");
	const server_Package = require("./package.json");
	const Server_Config = require("./appconfig");
	var Server_Params;
	loadServerPackage();
	logger.info(utilServerLog.ServerLog.Loaded + "SERVER PARAMETERS: OK");

	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

	const md5 = require('md5');
	const datetime = require("date-and-time");
	const formatCurrency = require('format-currency');
	const optionsFormatter = { format: '%s%v', symbol: '$', locale: 'es-CL', minFraction: 0, maxFraction: 2 };

	// const axios = require("axios");
	const fetch = require("node-fetch");
	const express = require("express");
	const bodyParser = require('body-parser');
	const cors = require('cors');
	const helmet = require('helmet');
	const url = require("url");
	//const querystring = require("querystring");
	//const util = require("util");
	const http = require('http');
	const https = require('https');
	const fs = require("fs");

	const path = require('path');
	const hbs = require('express-handlebars');

	//ca: fs.readFileSync(__dirname + '/SSL/ca.crt'),
	const sslOptions = {
		ca: fs.readFileSync(__dirname + '/SSL/LoginCobranzas-WebApp-2TecAdmin.csr'),
	  key: fs.readFileSync(__dirname + '/SSL/LoginCobranzas-WebApp-2TecAdmin.key'),
	  cert: fs.readFileSync(__dirname + '/SSL/LoginCobranzas-WebApp-2TecAdmin.crt')
	};

	//DEPENDENCIA CONTROLADORES
	//const GestionUsuariosController = require("./Http.Server.Controller/GestionUsuarios.Controller");
	//const GestionTicketsController = require("./Http.Server.Controller/GestionTickets.Controller");
	//DEPENDENCIA MIDDLEWARE DE SEGURIDAD - PASARELA / VALIDACION DE TOKENS DE NAVEGACIÓN
	const middleware = require("./Http.Server.Middleware/Middleware");
	//DEPENDENCIA: DTO's
	const requestDTO = require("./Http.Server.DTO/Request/requestDTO");
	const responseDTO = require("./Http.Server.DTO/Response/responseDTO");
	const preRespDTO = require("./Http.Server.DTO/Response/preResponseDTO");
	const operacionesPrivadas = require("./Http.Server.DTO/Operations/operacionesPrivadasDTO");
	const operacionesPublicas = require("./Http.Server.DTO/Operations/operacionesPublicasDTO");

	logger.info(utilServerLog.ServerLog.Starting + "Servidor - Http: ...");

	const Server = express();
	//Server.use(bodyParser.urlencoded({extended: true}));
	Server.use(bodyParser.urlencoded({
		parameterLimit: Server_Config.Server.parameterLimit,
		limit: Server_Config.Server.BandwidthLimit,
		extended: true
	}));
	Server.use(bodyParser.json());

	//CONFIGURACION MOTOR DE PLANTILLAS Handlebars
	Server.engine('hbs', hbs({
		//defaultLayout: 'main',
		//layoutsDir: path.join(__dirname, 'views/layouts'),
		//partialsDir: path.join(__dirname, 'views/partials'),
		extname: 'hbs'
	}));
	Server.set('views', path.join(__dirname, 'views/webapp'));
	Server.set('view engine', 'hbs');

	var options = { dotfiles: 'ignore', etag: false,
		extensions: ['htm', 'html'],
		index: false
	};
	Server.use(express.static(Server.get('views'), options));

	Server.use(cors());
	Server.use(helmet());
	Server.set('IP', Server_Config.Server.IP);
	Server.set('PORT', Server_Config.Server.NonSecurePort); //Server_Config.Server.PortSSL

	const publicRoutes = express.Router();
	const BackEndRoutes = express.Router();

	//RUTAS PÚBLICAS
	publicRoutes.get(operacionesPublicas.Login, function(request, response){
		response.render('index');
	});

	BackEndRoutes.post(operacionesPublicas.ServicioGestionUsuarios.Login, function(request, response){
		console.log("Request BODY: ");
		console.log(request.body);
		console.log("------------------------------");
		/*
		axios.post(Server_Config.APIs.Backend + operacionesPrivadas.ServicioGestionUsuarios.Login, request.body)
		.then(function (respuesta) {
			console.log("Axios call: [OK]");
			console.log(respuesta.data);
			response.send(respuesta.data);
		})
		.catch(function (error) {
			console.log("Axios call: [ERROR]");
			console.log(error.response.data);
			response.send(error.response);
		});
		*/

		fetch(Server_Config.APIs.Backend + operacionesPublicas.ServicioGestionUsuarios.Login,
		{
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				method: "POST",
				body: JSON.stringify(request.body)
		})
		.then(function(res){
			return res.json();
		})
		.then(function(data){
			console.log("Fetch: OK");
			console.log(data);

			response.writeHead(data.Response.Resultado.CodigoHTTP, {'Content-Type': 'application/json; charset=utf-8'});
			response.write(JSON.stringify(data));
			response.end();
		})
		.catch(function(res){
			console.log("Fetch: ERROR");
			console.log(res);

			response.writeHead(500, {'Content-Type': 'application/json; charset=utf-8'});
			response.write(JSON.stringify(res));
			response.end();
		});

	});

	BackEndRoutes.post(operacionesPrivadas.ServicioGestionUsuarios.IngresarUsuario, function(request, response){
		console.log("Request BODY: ");
		console.log(request.body);
		console.log("------------------------------");
	
		fetch(Server_Config.APIs.Backend + operacionesPrivadas.ServicioGestionUsuarios.IngresarUsuario,
		{
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				method: "POST",
				body: JSON.stringify(request.body)
		})
		.then(function(res){
			return res.json();
		})
		.then(function(data){
			console.log("Fetch: OK");
			console.log(data);

			response.writeHead(data.Response.Resultado.CodigoHTTP, {'Content-Type': 'application/json; charset=utf-8'});
			response.write(JSON.stringify(data));
			response.end();
		})
		.catch(function(res){
			console.log("Fetch: ERROR");
			console.log(res);

			response.writeHead(500, {'Content-Type': 'application/json; charset=utf-8'});
			response.write(JSON.stringify(res));
			response.end();
		});

	});

	BackEndRoutes.post('/', function(request, response){
		console.log("Request BODY: ");
		console.log(request.body);
		console.log("------------------------------");

		fetch(Server_Config.APIs.Backend + operacionesPrivadas.ServicioGestionUsuarios.Root,
		{
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				method: "POST",
				body: JSON.stringify(request.body)
		})
		.then(function(res){
			return res.json();
		})
		.then(function(data){
			console.log("Fetch: OK");
			console.log(data);

			response.writeHead(data.Response.Resultado.CodigoHTTP, {'Content-Type': 'application/json; charset=utf-8'});
			response.write(JSON.stringify(data));
			response.end();
		})
		.catch(function(res){
			console.log("Fetch: ERROR");
			console.log(res);

			response.writeHead(500, {'Content-Type': 'application/json; charset=utf-8'});
			response.write(JSON.stringify(res));
			response.end();
		});

	});

	Server.use(publicRoutes);
	Server.use(BackEndRoutes);

	http.createServer(Server).listen(Server.get('PORT'), function() {
	  logger.info(utilServerLog.ServerLog.Info + "Servidor HTTP: NodeJS - Http [v" + Server_Params.version + "]: ...");
	  logger.info(utilServerLog.ServerLog.Started + "*** OK ***");
	  logger.info(utilServerLog.ServerLog.Info + "API HTTP is running and listening at http://%s:%s", Server.get('IP'), Server.get('PORT'));
	  logger.info("*****************************************************");
	});
	/*
	https.createServer(sslOptions, Server).listen(Server.get('PORT'), function(){
		logger.info(utilServerLog.ServerLog.Info + "Servidor HTTPS (SSL/TLS): NodeJS - Https [v" + Server_Params.version + "]: ...");
	  logger.info(utilServerLog.ServerLog.Started + "*** OK ***");
	  logger.info(utilServerLog.ServerLog.Info + "API HTTPS is running and listening at https://%s:%s", Server.get('IP'), Server.get('PORT'));
	  logger.info("*****************************************************");
	});
	*/
	function GENERA_RESPONSE_ERROR(response, CodigoHTTP, MensajeInterno, MensajeServicio){
		let r = responseDTO;
		logger.info(utilServerLog.ResponseLog.Error + "GENERANDO RESPONSE ...");
		let fechaHoy = new Date();
		let fechaHoy_formatted = datetime.format(fechaHoy, 'DD/MM/YYYY - HH:mm:ss');

		r.Response.Info.FechaHora = fechaHoy_formatted;

		r.Response.Resultado.Codigo = 1
		r.Response.Resultado.OrigenMensaje = "[SERVIDOR]"
		r.Response.Resultado.CodigoHTTP = CodigoHTTP;
		r.Response.Resultado.MensajeInterno = MensajeInterno;
		r.Response.Resultado.MensajeServicio = MensajeServicio;

		return JSON.stringify(r);
	};

	function loadServerPackage(){
		let str_JSON = JSON.stringify(server_Package);
		Server_Params = JSON.parse(str_JSON);
	};

}

exports.start = serverStart;
