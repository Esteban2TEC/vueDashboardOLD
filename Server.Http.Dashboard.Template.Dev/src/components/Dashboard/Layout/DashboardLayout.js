/* eslint-disable */

  import swal from 'sweetalert2'
  import TopNavbar from './TopNavbar.vue'
  import ContentFooter from './ContentFooter.vue'
  import DashboardContent from './Content.vue'
  import UserMenu from 'src/components/UIComponents/SidebarPlugin/UserMenu.vue'
  import MobileMenu from 'src/components/UIComponents/SidebarPlugin/MobileMenu.vue'

  //import {clientLoginCobranzas} from '../../../axios_ClientLoginCobranzas'
  import async from '../../../async'

  export default {
    template: '#dashboardLayout',
    components: {
      TopNavbar,
      ContentFooter,
      DashboardContent,
      UserMenu,
      MobileMenu
    },
    beforeCreate: function () {
      if (!this.$session.exists()) {
        this.$router.push('/login')

      } else {
        swal({
          title: 'Cargando Tablero ...',
          text: 'Un momento por favor, estamos preparando todo lo que necesitas ;)',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          showConfirmButton: false,
          showCancelButton: false,
          timer: 2000,
          onOpen: () => {
            swal.showLoading()
          }
        }).then((result) => {
          // console.log(result);
        }).catch(function (error) {
          // console.log(error);
        });
      }
    },
    created: function () {
      // swal.closeModal();
    },
    data () {
      return {
        typeNotify: ['', 'info', 'success', 'warning', 'danger']
      }
    },
    methods: {
      toggleSidebar () {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false)
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
      bloquearSesion: function () {
        const vm = this;
        vm.toggleSidebar()

        swal({
          title: 'Bloquear Sesión',
          text: '¿Está seguro que desea bloquear la sesión actual?',
          type: 'question',
          allowOutsideClick: false,
          showCancelButton: true,
          confirmButtonClass: 'btn btn-success btn-fill',
          cancelButtonClass: 'btn btn-danger btn-fill',
          confirmButtonText: 'Bloquear',
          cancelButtonText: 'No',
          buttonsStyling: false
        }).then(function () {
          vm.$router.push({path: '/lock'});
          vm.notificacion('', 'Sesión bloqueada', 'success', 'top', 'center');

        }, function (dismiss) {
          // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
        })
      },
      cerrarSesion: function () {
        const vm = this;
        vm.toggleSidebar()

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
          vm.notificacion('', 'La sesión se ha cerrado y destruido correctamente', 'success', 'top', 'center');

        }, function (dismiss) {
          // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
        })
      }
    }
  }
