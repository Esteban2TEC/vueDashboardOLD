//import {clientLoginCobranzas} from '../../axios_ClientLoginCobranzas'
import axios from 'axios'
import {mapFields} from 'vee-validate'

export default {
  data: function(){
    return {
      vm:{
        Router: this.$router,
      },
      logoPrincipal: "http://www.2tec.cl/images/2tec-logo---oem1.jpg",
      strings: {
        tituloGeneral: "2Tec Chile",
        tituloSecundario: "Administración de Usuarios y Cobranzas",
        subTitulo: "Regístrese gratis y experimente el nuevo y espectacular tablero de administración de usuarios y cobranzas",
        menuLogin: "Iniciar Sesión",
        txPhNameNombre: "Ingresa tu Nombre",
        txPhNameApellido: "Ingresa tu Apellido",
        txPhNameEmpresa: "Nombre de Empresa",
        txPhNameCorreo: "Ingresa tu correo",
        txPhNamePassword: "Ingresa tu Contraseña",
        txPhNameRepeatPassword: "Repite tu Contraseña",
        btnCreateText: "Crear Cuenta Gratis"
      },
      modelValidations: {
        email: {
          required: true,
          email: true
        },
        password: {
          required: true,
          min: 4
        }
      },
      model: {
        login: {
          operacion: "/auth/login",
          usuario: "",
          pwd: ""
        }
      }
    }
  },
  methods: {
    toggleNavbar () {
      document.body.classList.toggle('nav-open')
    },
    closeMenu () {
      document.body.classList.remove('nav-open')
      document.body.classList.remove('off-canvas-sidebar')
    },
    getError: getError,
    validar: validar,
    registrarUsuario: registrarUsuario
  },
  computed: {
    ...mapFields(['email', 'password'])
  },
  beforeDestroy () {
    this.closeMenu()
  }
}

function getError(nombreCampo) {
  return this.errors.first(nombreCampo)
};

function validar() {
  const vmRouter = this.vm.Router;
  const loginObj = this.model.login;

  this.$validator.validateAll().then(isValid => {
    //this.$emit('on-submit', this.registerForm, isValid)
    if(isValid){
      iniciarSesion(loginObj, vmRouter);
    } else {
      alert("Los valores ingresados no son válidos");
    }
  })
};

function registrarUsuario(loginObj, router){
  console.log("Iniciando Sesión....");

  var dataBody = {
    Header: {
      Operacion: loginObj.operacion
    },
    Body:{
      Usuario: loginObj.usuario,
      Password: loginObj.pwd
    }
  };

  // https://198.37.116.225/auth/login

  //clientLoginCobranzas.post(loginInfo.Operacion, dataBody)
  //axios.post(loginInfo.Operacion, dataBody)
  vm.$root.$options.components.serviceLoginCobranzas.post(vm.model.login.operacion, dataBody)
  .then(function (response) {
    console.log(response);
    router.push('/admin/overview');
  })
  .catch(function (error) {
    console.log(error);

    if (error.response){
      let errorMessage = error.response.data.Response.Resultado.MensajeServicio;
      alert(errorMessage);
    } else {
      alert("Ha ocurrido un error inesperado al ejecutar la operación...");
    }
  });

  /*
  clientLoginCobranzas.post(this.loginInfo.Operacion, dataBody)
  .then(function (response) {
    console.log(response);
    vmRouter.push('/admin/overview');
  })
  .catch(function (error) {
    alert(error);
    console.log(error);
  });
  */

  /*
  clientLoginCobranzas.post(this.loginInfo.Operacion, dataBody)
  .then(function (response) {
    console.log(response);
    vmRouter.push('/admin/overview');
  })
  .catch(function (error) {
    alert(error);
    console.log(error);
  });
  */

  /*
  fetch(this.serverAddress + this.loginInfo.Operacion,
  {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      //headers: headers,
      method: "POST",
      body: JSON.stringify(dataBody)
  })
  .then(function(res){
    return res.json();
  })
  .then(function(data){
    console.log(data);

    if(data.Response.Resultado.CodigoHTTP == 200){

      console.log(data);
      sessionStorage.setItem('sessionToken', data.Response.Auth.Token);
      // console.log('sessionStorage Token: ' + sessionStorage.sessionToken);
      alert(data.Response.Data.BodyData.Autorizacion + " - " + data.Response.Data.BodyData.Usuario + ": " + data.Response.Data.BodyData.Mensaje);

      vm.$route.push('/admin/overview');
      //this.$route.push('/admin/overview');
      // window.location.replace("#/admin/overview");

    } else if(data.Response.Resultado.CodigoHTTP == 500){
      alert("Respuesta Servicio: " + data.Response.Resultado.MensajeServicio);
    } else {
      alert(data.Response.Data.BodyData.Autorizacion + " - " + data.Response.Data.BodyData.Usuario + ": " + data.Response.Data.BodyData.Mensaje);
    }

  })
  .catch(function(res){
    console.log(res)
  });
*/
};
