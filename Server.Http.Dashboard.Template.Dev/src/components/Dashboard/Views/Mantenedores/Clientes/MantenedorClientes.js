import Vue from 'vue'
import {Table, TableColumn, Select, Option} from 'element-ui'
import PPagination from 'src/components/UIComponents/Pagination.vue'
import {mapFields} from 'vee-validate'
import swal from 'sweetalert2'

//import {clientLoginCobranzas} from '../../../../../axios_ClientLoginCobranzas'
import {async} from '../../../../../async'
import consultarUsuariosModel from './Model/consultarUsuariosModel'

Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Select)
Vue.use(Option)

export default{
  components: {
    PPagination
  },
  computed: {
    ...mapFields(['email', 'emailSecundario', 'usuarioSesion', 'password', 'passwordRepeat']),
    pagedData () {
      // return this.tableData.slice(this.from, this.to)
      return this.model.consultarUsuarios.listaUsuarios.slice(this.from, this.to)
    },
    /***
     * Searches through table data and returns a paginated array.
     * Note that this should not be used for table with a lot of data as it might be slow!
     * Do the search and the pagination on the server and display the data retrieved from server instead.
     * @returns {computed.pagedData}
     */
    queriedData () {
      if (!this.searchQuery) {
        this.pagination.total = this.model.consultarUsuarios.listaUsuarios.length
        return this.pagedData
      }
      let result = this.model.consultarUsuarios.listaUsuarios
        .filter((row) => {
          let isIncluded = false
          for (let key of this.propsToSearch) {
            let rowValue = row[key].toString()
            if (rowValue.includes && rowValue.includes(this.searchQuery)) {
              isIncluded = true
            }
          }
          return isIncluded
        })
      this.pagination.total = result.length
      return result.slice(this.from, this.to)
    },
    to () {
      let highBound = this.from + this.pagination.perPage
      if (this.total < highBound) {
        highBound = this.total
      }
      return highBound
    },
    from () {
      return this.pagination.perPage * (this.pagination.currentPage - 1)
    },
    total () {
      this.pagination.total = this.model.consultarUsuarios.listaUsuarios.length
      return this.model.consultarUsuarios.listaUsuarios.length
    }
  },
  beforeCreate: function () {
    if (!this.$session.exists()) {
      this.$router.push('/login')
    }
  },
  created: function () {
    this.toggleSidebar();
    this.consultarUsuarios(this);
  },
  data () {
    return {
      strings: {
        titulos: {
          infoCliente: 'Información del Cliente:',
          infoAdicional: 'Información Adicional:',
          infoInicioSesion: 'Inicio de Sesión:',
          listaClientes: 'Lista de Clientes'
        },
        campos: {
          lblNombrePersona: 'Nombre Cliente:',
          txPhNombrePersona: 'Nombre de Cliente',
          lblRutPersona: 'RUT:',
          txPhRutPersona: 'RUT Cliente',
          lblEmail: 'Email:',
          txPhEmail: 'Correo electrónico',
          lblPerfilCuenta: 'Perfil Cuenta:',
          txPhPerfilCuenta: 'Perfil de Cuenta',
          lblEstadoCuenta: 'Estado Cuenta:',
          txPhEstadoCuenta: 'Estado de Cuenta',
          lblTipoCuenta: 'Tipo Cuenta:',
          txPhTipoCuenta: 'Tipo de Cuenta',
          lblDireccionParticular: 'Dirección Particular:',
          txPhDireccionParticular: 'Dirección Particular',
          lblCelularPrimario: 'Celular:',
          txPhCelularPrimario: 'Celular Principal',
          lblFonoPrimario: 'Teléfono Fijo:',
          txPhFonoPrimario: 'Teléfono Fijo Principal',
          lblNombreContactoEmpresa: 'Nombre Contacto Empresa:',
          txPhNombreContactoEmpresa: 'Nombre del Contacto de la Empresa',
          lblRutComercial: 'RUT Empresa:',
          txPhRutComercial: 'RUT Empresa',
          lblEmailSecundario: 'Email Comercial:',
          txPhEmailSecundario: 'Correo electrónico Comercial',
          lblRazonSocial: 'Razón Social / Nombre Empresa:',
          txPhRazonSocial: 'Razón Social / Nombre Empresa',
          lblGiroEmpresa: 'Giro:',
          txPhGiroEmpresa: 'Giro Comercial',
          lblDireccionComercial: 'Dirección Comercial:',
          txPhDireccionComercial: 'Dirección Comercial',
          lblCelularSecundario: 'Celular Adicional:',
          txPhCelularSecundario: 'Celular Adicional Secundario',
          lblFonoSecundario: 'Teléfono Fijo Adicional:',
          txPhFonoSecundario: 'Teléfono Fijo Adicional Secundario',
          lblUsuarioSesion: 'Usuario de Sesión:',
          txPhUsuarioSesion: 'Usuario para Iniciar Sesión',
          lblPassword: 'Contraseña:',
          txPhPassword: 'Ingrese Contraseña',
          lblPasswordRepeat: 'Confirmar Contraseña:',
          txPhPasswordRepeat: 'Ingrese Confirmación de Contraseña'
        },
        botones: {
          btnLimpiarFormulario: 'Limpiar Formulario',
          btnIngresar: 'Ingresar',
          btnModificar: 'Modificar',
          btnEliminar: 'Eliminar'
        }
      },
      pagination: {
        perPage: 5,
        currentPage: 1,
        perPageOptions: [5, 10, 25, 50],
        total: 0
      },
      searchQuery: '',
      propsToSearch: ['NOMBRE_PERSONA', 'EMAIL'],
      tableColumns: consultarUsuariosModel,
      // tableData: [], // users,
      modelValidations: {
        email: {
          required: true,
          email: true
        },
        emailSecundario: {
          required: true,
          email: true
        },
        usuarioSesion: {
          required: true,
          email: true
        },
        password: {
          required: true,
          min: 4
        }
      },
      model: {
        tokenSession: this.$session.get('token'),
        campos: {
          nombrePersona: '',
          rutPersona: '',
          email: '',
          perfilCuenta: '',
          estadoCuenta: '',
          tipoCuenta: '',
          direccionParticular: '',
          celularPrimario: '',
          fonoPrimario: '',
          rutComercial: '',
          emailSecundario: '',
          razonSocial: '',
          giroEmpresa: '',
          direccionComercial: '',
          celularSecundario: '',
          fonoSecundario: '',
          usuarioSesion: '',
          password: '',
          passwordRepeat: ''
        },
        consultarUsuarios: {
          operacion: 'ConsultarUsuarios',
          listaUsuarios: []
        }
      }
    }
  },
  methods: {
    getError: getError,
    toggleSidebar () {
      if (this.$parent.$sidebar.showSidebar) {
        this.$parent.$sidebar.displaySidebar(false)
      }
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
    handleView (index, row) {
      const vm = this;

      swal({
        title: 'Visualizar',
        text: 'Deseas visualizar los datos para: ' + row.EMAIL + '?',
        type: 'info',
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success btn-fill',
        cancelButtonClass: 'btn btn-danger btn-fill',
        confirmButtonText: 'Si, Visualizar',
        cancelButtonText: 'No',
        buttonsStyling: true
      }).then(function () {
        // vm.$router.push({path: '/lock'});
        vm.notificacion('ti-check-box', 'Visualización: OK', 'success', 'top', 'center');

      }, function (dismiss) {
        // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
        vm.notificacion('ti-close', 'Visualización: CERRADA', 'danger', 'top', 'center');
      })

    },
    handleEdit (index, row) {
      const vm = this;

      swal({
        title: 'Editar Registro',
        text: '¿Deseas editar los datos para el cliente: ' + row.EMAIL + '?',
        type: 'question',
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success btn-fill',
        cancelButtonClass: 'btn btn-danger btn-fill',
        confirmButtonText: 'Si, Editar',
        cancelButtonText: 'No',
        buttonsStyling: true
      }).then(function () {
        console.log(row);
        vm.model.campos.nombrePersona = row.NOMBRE_PERSONA;
        vm.model.campos.rutPersona = row.RUT_PERSONA;
        vm.model.campos.email = row.EMAIL;
        vm.model.campos.perfilCuenta = row.PERFIL_CUENTA;
        vm.model.campos.estadoCuenta = row.ESTADO_CUENTA;
        vm.model.campos.tipoCuenta = row.TIPO_CUENTA;
        vm.model.campos.direccionParticular = row.DIRECCION_PARTICULAR;
        vm.model.campos.celularPrimario = row.CELULAR_PRIMARIO;
        vm.model.campos.fonoPrimario = row.TELEFONO_PRIMARIO;
        vm.model.campos.rutComercial = row.RUT_COMERCIAL;
        vm.model.campos.emailSecundario = row.EMAIL_SECUNDARIO;
        vm.model.campos.razonSocial = '';
        vm.model.campos.giroEmpresa = '';
        vm.model.campos.direccionComercial = row.DIRECCION_COMERCIAL;
        vm.model.campos.celularSecundario = row.CELULAR_SECUNDARIO;
        vm.model.campos.fonoSecundario = row.TELEFONO_SECUNDARIO;
        vm.model.campos.usuarioSesion = row.USUARIO_SESION;
        vm.model.campos.password = row.PASSWORD;
        vm.model.campos.passwordRepeat = '';

        vm.notificacion('ti-check-box', 'Datos Cargados Correctamente', 'success', 'top', 'center');
      }, function (dismiss) {
        // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
        vm.notificacion('', 'Edición cancelada', 'danger', 'top', 'center');
      })

    },
    limpiarFormulario () {
      const vm = this;

      swal({
        title: 'Limpiar Formulario',
        text: '¿Seguro que deseas limpiar por completo el formulario?',
        type: 'question',
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success btn-fill',
        cancelButtonClass: 'btn btn-danger btn-fill',
        confirmButtonText: 'Si, Limpiar Todo',
        cancelButtonText: 'No',
        buttonsStyling: true
      }).then(function () {
        vm.model.campos.nombrePersona = '';
        vm.model.campos.rutPersona = '';
        vm.model.campos.email = '';
        vm.model.campos.perfilCuenta = '';
        vm.model.campos.estadoCuenta = '';
        vm.model.campos.tipoCuenta = '';
        vm.model.campos.direccionParticular = '';
        vm.model.campos.celularPrimario = '';
        vm.model.campos.fonoPrimario = '';
        vm.model.campos.rutComercial = '';
        vm.model.campos.emailSecundario = '';
        vm.model.campos.razonSocial = '';
        vm.model.campos.giroEmpresa = '';
        vm.model.campos.direccionComercial = '';
        vm.model.campos.celularSecundario = '';
        vm.model.campos.fonoSecundario = '';
        vm.model.campos.usuarioSesion = '';
        vm.model.campos.password = '';
        vm.model.campos.passwordRepeat = '';

        vm.notificacion('ti-check-box', 'Formulario Limpiado', 'success', 'top', 'center');

      }, function (dismiss) {
        // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
        // vm.notificacion('ti-close', 'Visualización: CERRADA', 'danger', 'top', 'center');
      })
    },
    ingresarDatos () {
      const vm = this;

      swal({
        title: 'Ingresar Datos',
        text: '¿Los datos ingresados están bien para continuar con el ingreso de la información?',
        type: 'question',
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success btn-fill',
        cancelButtonClass: 'btn btn-danger btn-fill',
        confirmButtonText: 'Si, Ingresar Información',
        cancelButtonText: 'No',
        buttonsStyling: true
      }).then(function () {

        vm.notificacion('ti-check-box', 'Datos Ingresados Correctamente', 'success', 'top', 'center');

      }, function (dismiss) {
        // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
        vm.notificacion('ti-close', 'Ingreso Cancelado', 'danger', 'top', 'center');
      })
    },
    modificarDatos () {
      const vm = this;

      swal({
        title: 'Modificar Datos',
        text: '¿Los datos ingresados están bien para continuar con la modificación de la información?',
        type: 'question',
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success btn-fill',
        cancelButtonClass: 'btn btn-danger btn-fill',
        confirmButtonText: 'Si, Modificar Información',
        cancelButtonText: 'No',
        buttonsStyling: true
      }).then(function () {

        vm.notificacion('ti-check-box', 'Datos Modificados Correctamente', 'success', 'top', 'center');

      }, function (dismiss) {
        // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
        vm.notificacion('ti-close', 'Modificación Cancelada', 'danger', 'top', 'center');
      })
    },
    eliminarDatos (index, row) {
      const vm = this;

      swal({
        title: 'Eliminar Datos',
        text: '¿Está seguro que desea eliminar el registro seleccionado?',
        type: 'question',
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success btn-fill',
        cancelButtonClass: 'btn btn-danger btn-fill',
        confirmButtonText: 'Si, Limpiar Todo',
        cancelButtonText: 'No',
        buttonsStyling: true
      }).then(function () {

        let indexToDelete = vm.model.consultarUsuarios.listaUsuarios.findIndex((tableRow) => tableRow.ID_USUARIO === row.ID_USUARIO)
        if (indexToDelete >= 0) {
          vm.model.consultarUsuarios.listaUsuarios.splice(indexToDelete, 1)
        }

        vm.notificacion('ti-check-box', 'Registro Eliminado Correctamente', 'success', 'top', 'center');

      }, function (dismiss) {
        // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
        vm.notificacion('ti-close', 'Eliminación Cancelada', 'danger', 'top', 'center');
      })

    },
    consultarUsuarios: consultarUsuarios
  }
}

function getError(nombreCampo) {
  return this.errors.first(nombreCampo)
};

function consultarUsuarios (vm) {

  swal({
    title: 'Cargando ...',
    text: '',
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false,
    showCancelButton: false,
    // timer: 2000,
    onOpen: () => {
      swal.showLoading()

      async.parallel([
        function(callback) {

          var dataBody = {
            Auth: {
              Token: vm.model.tokenSession
            },
            Header: {
              Operacion: vm.model.consultarUsuarios.operacion
            },
            Body:{
            }
          };

          //clientLoginCobranzas.post('', dataBody) // vm.model.login.operacion
		  vm.$root.$options.components.serviceLoginCobranzas.post('', dataBody)
          .then(function (response) {
            console.log(response);
            if(response.status === 200){
              callback(null, response.data.Response.Data.BodyData);
            }
          }).catch(function (error) {
            callback(error, null);
          });

        }
      ],
      function(error, results) {

          if (error) {
            console.log(error);
            if (error.response){
              if (error.response.status){
                if (error.response.data){
                  if (error.response.data.Response){
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

            } else {

              let dataMensaje = {
                titulo: 'Error: ' + error.message,
                descripcion: 'Ha ocurrido un error inesperado al ejecutar la operación. ' + error.stack,
                tipo: 'error' // success, error, warning, info, question
              };
              showPopUp(dataMensaje);

            }
          } else {
            console.log(results);
            vm.model.consultarUsuarios.listaUsuarios = results[0];
            swal.closeModal();
          }

      });

    }
  }).then((result) => {
    // console.log(result);
    // swal.closeModal();
  }).catch(function (error) {
    // console.log(error);
  });



};

function showPopUp(data) {
  swal.hideLoading();
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
