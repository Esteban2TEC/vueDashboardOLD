const fetch = require("node-fetch");

const publicRoutes = require("../Http.Server.DTO/Operations/publicOperationsDTO");
const privateRoutes = require("../Http.Server.DTO/Operations/privateOperationsDTO");

exports.actualizarEstadoTrxTicket = actualizarEstadoTrxTicket;

function actualizarEstadoTrxTicket(Server_Config, callback, payload) {

  var dataInput = {
    Header:{
      Operacion: publicRoutes.Operaciones.ServicioGestionTickets.ActualizarEstadoTrxTicket //"/ticketCobro/actualizarEstadoTrxTicket"
    },
    Body:{
      payloadPayU: payload
    }
  };

  fetch(Server_Config.APIs.Backend + dataInput.Header.Operacion,
  {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(dataInput)
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
