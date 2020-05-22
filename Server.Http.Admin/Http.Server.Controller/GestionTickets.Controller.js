const async = require("async");
//DEPENDENCIA: DAL
const ticketsDAO = require("../Http.Server.DAL/TicketsDAO");

var GestionTicketsController = function(){
	//this.Server_Config = Server_Config;
	this.param = null;
};

GestionTicketsController.prototype.actualizarEstadoTicket = function(Server_Config, payload) {

	try {

    async.series([
      function(callback) {
				console.log("ASYNC [SERIES] 1: Actualizando Estado de Ticket - Invocando Servicio...");
				//console.log(Server_Config);
				ticketsDAO.actualizarEstadoTrxTicket(Server_Config, callback, payload);

      }
		],
		function(err, results) {
			if(err){
				let errorJSON = err; //JSON.parse(err);
				console.log("Async ERROR: " + errorJSON.Response.Resultado.MensajeServicio);
			} else {
				let okJSON = results[0]; //JSON.parse(results[0]);
				console.log("Async OK: " + okJSON.Response.Resultado.MensajeServicio);
			}
		});

	} catch (ex) {
		console.log("[GestionTicket.Controller]: ERROR THROWED: " + ex.toString())
    /*
		LogServiceReference.ingresarLogDirect(this.App_Config.LogProperties.TIPOLOG_FATAL,
												this.App_Config.LogProperties.AMBIENTE,
												this.Service_Params.name,
												"ingresarUsuario",
												"Ingresar Usuario",
												this.Util_Messages.Strings.ErrorEjecucionOperacion + ex.message);
                        */
    throw new Error(ex.message);
	}
};

module.exports = GestionTicketsController;
