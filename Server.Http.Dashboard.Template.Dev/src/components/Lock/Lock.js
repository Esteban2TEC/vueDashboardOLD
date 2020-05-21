/* eslint-disable */

//import {clientLoginCobranzas} from '../../axios_ClientLoginCobranzas'
import axios from 'axios'
import {mapFields} from 'vee-validate'
import swal from 'sweetalert2'

export default {
  props: ['mailUsuario'],
  data: function () {
    return {
      logoPrincipal: 'http://www.2tec.cl/images/2tec-logo---oem1.jpg',
      strings: {
        tituloLockCard: "Sesión Bloqueada",
        txNamePassword: 'Contraseña:',
        txPhPassword: 'Ingresa tu Contraseña',
        btnLoginText: 'Iniciar Sesión',
        btnLogOutText: 'Cerrar Sesión'
      },
      modelValidations: {
        password: {
          required: true,
          min: 4
        }
      },
      model: {
        login: {
          operacion: '/user/auth/login',
          usuario: '',
          pwd: ''
        }
      }
    }
  },
  beforeCreate: function () {
    if (!this.$session.exists()) {
      this.$router.push('/login')
    }
  },
  created: function () {
    if (!this.$session.exists()) {
      this.$router.push('/login')
    } else {
      let loginData = this.$session.get('loginData')
      if('usuario' in loginData) {
        this.model.login.usuario = loginData.usuario
        this.$session.destroy()
      } else {
        this.$router.push('/login')
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
    notificacion: function (typeIcon, message, typeMessage, verticalAlign, horizontalAlign) {
      this.$notify(
        {
          component: {
            template: '<span><center>' + message + '</center></span>'
          },
          icon: typeIcon, // 'ti-check',
          horizontalAlign: horizontalAlign,
          verticalAlign: verticalAlign,
          type: typeMessage
        })
    },
    getError: getError,
    validar: validar,
    cerrarSesion: cerrarSesion
  },
  computed: {
    ...mapFields(['password'])
  },
  beforeDestroy () {
    this.closeMenu()
  }
}

function getError (nombreCampo) {
  return this.errors.first(nombreCampo)
};

function validar () {
  const vm = this

  this.$validator.validateAll().then(isValid => {
    // this.$emit('on-submit', this.registerForm, isValid)
    if (isValid) {

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
		
          //clientLoginCobranzas.post(vm.model.login.operacion, dataBody)
        vm.$root.$options.components.serviceAuthLoginUser.post('', dataBody)
          .then(function (response) {
            console.log(response);
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
            //console.log(error);
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

function cerrarSesion () {
  const vm = this;

  swal({
    title: 'Cerrar Sesión',
    text: '¿Está seguro que desea cerrar la sesión?',
    type: 'question',
    allowOutsideClick: false,
    showCancelButton: true,
    confirmButtonClass: 'btn btn-success btn-fill',
    cancelButtonClass: 'btn btn-danger btn-fill',
    confirmButtonText: 'Cerrar Sesión',
    cancelButtonText: 'No',
    buttonsStyling: false
  }).then(function () {
    vm.$session.destroy()
    vm.$router.push({path: '/login'});
    vm.notificacion('', 'Sesión cerrada correctamente', 'success', 'top', 'center');

  }, function (dismiss) {
    // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
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
