import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
import swal from 'sweetalert2'

export default {
  template: '#userMenu',
  components: {
    [CollapseTransition.name]: CollapseTransition
  },
  data () {
    return {
      model: {
        userData: {
          mailUsuario: ''
        }
      },
      isClosed: true,
      typeNotify: ['', 'info', 'success', 'warning', 'danger']
    }
  },
  created: function () {
    if (!this.$session.exists()) {
      this.$router.push('/login')
    } else {
      let loginData = this.$session.get('loginData')
      if('usuario' in loginData) {
        this.model.userData.mailUsuario = loginData.usuario
      } else {
        this.$router.push('/login')
      }
    }

  },
  methods: {
    toggleMenu () {
      this.isClosed = !this.isClosed
    }
  }
}

function notifyVue (message, typeMessage, verticalAlign, horizontalAlign) {
  this.$notify(
    {
      component: {
        template: '<span><center>' + message + '</center></span>'
      },
      icon: 'ti-check',
      horizontalAlign: horizontalAlign,
      verticalAlign: verticalAlign,
      type: typeMessage
    })
};
