//import {clientLoginCobranzas} from '../../axios_ClientLoginCobranzas'
import axios from 'axios'
import {mapFields} from 'vee-validate'
import swal from 'sweetalert2'

export default {
  data: function(){
    return {
      logoPrincipal: "http://www.2tec.cl/images/2tec-logo---oem1.jpg",
      strings: {
        titulo: "2Tec: Aplicación Template",
        menuRegistrarse: "Registrarse",
        tituloLoginCard: "Iniciar Sesión",
        txNameCorreo: "Email:",
        txPhCorreo: "Ingresa tu correo",
        txNamePassword: "Contraseña:",
        txPhPassword: "Ingresa tu Contraseña",
        btnLoginText: "Iniciar Sesión",
        txOlvidoPassword: "¿Olvidaste tu contraseña?"
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
          operacion: "/user/auth/login",
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
    validar: validar
  },
  computed: {
    ...mapFields(['email', 'password'])
  },
  beforeDestroy() {
    this.closeMenu()
  }
}

function getError(nombreCampo) {
  return this.errors.first(nombreCampo)
};

function validar() {
  const vm = this;

  vm.$validator.validateAll().then(isValid => {

    if(isValid){

      var dataBody = {
        Header: {
          Operacion: vm.model.login.operacion
        },
        Body:{
          usuarioSesion: vm.model.login.usuario,
          password: vm.model.login.pwd
        }
      };

      swal({
        title: 'Iniciando Sesión',
        text: 'Estamos validando la información ingresada ...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        //timer: 5000,
        onOpen: () => {
          swal.showLoading()
          //vm.$session.start();
          //vm.$router.push('/admin/panel');

          //CallService: Login Usuario
          
          //clientLoginCobranzas.post(vm.model.login.operacion, dataBody)
		    vm.$root.$options.components.serviceAuthLoginUser.post('', dataBody)
          .then(function (response) {
            //console.log(response);
            if(response.status === 200 && 'Token' in response.data.Response.Auth){
              vm.$session.start();
              vm.$session.set('token', response.data.Response.Auth.Token);
              vm.$session.set('loginData', {
                userData: response.data.Response.DataOut,
                usuario: vm.model.login.usuario
              });
              swal.closeModal();
              vm.$router.push('/admin/panel');
            }

          }).catch(function (error) {
            console.log(error);
            if (error.response){
              if (error.response.status){
                if (error.response.data){
                  let dataMensaje = {
                    titulo: 'Error: ' + error.response.status + ' - ' + error.response.statusText,
                    descripcion: error.response.data.Response.Resultado.MensajeServicio,
                    tipo: 'error' // success, error, warning, info, question
                  };
                  showPopUp(dataMensaje);
                } else {
                  let dataMensaje = {
                    titulo: 'Error: ' + error.response.status + ' - ' + error.response.statusText,
                    descripcion: error.message + ', ' + error.stack,
                    tipo: 'error' // success, error, warning, info, question
                  };
                  showPopUp(dataMensaje);
                }

              } else {
                let dataMensaje = {
                  titulo: 'Error',
                  descripcion: 'Ha ocurrido un error inesperado, favor de volver a intentarlo',
                  tipo: 'error' // success, error, warning, info, question
                };
                showPopUp(dataMensaje);
              }

              // let errorMessage = error.response.data.Response.Resultado.MensajeServicio;

            } else {

              let dataMensaje = {
                titulo: 'Error: ' + error.message,
                descripcion: 'Ha ocurrido un error inesperado al ejecutar la operación. ' + error.stack,
                tipo: 'error' // success, error, warning, info, question
              };
              showPopUp(dataMensaje);

            }
          });
          
        }
      }).then((result) => {
        // if (result.dismiss === 'timer') {
        // }
      })

    } else {

      let dataMensaje = {
        titulo: 'Atención',
        descripcion: 'Los valores ingresados no son válidos',
        tipo: 'warning' // success, error, warning, info, question
      };
      showPopUp(dataMensaje);

    }
  })
};

function showPopUp(data) {
  swal({
    title: data.titulo,
    text: data.descripcion,
    type: data.tipo,
    allowOutsideClick: false,
    allowEscapeKey: true
  }).then((result) => {
    // console.log(result);
  }).catch(function (error) {
    // console.log(error);
  });
};
