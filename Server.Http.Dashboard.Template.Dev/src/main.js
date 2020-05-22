/* eslint-disable */
/* Documentación de Proyecto:
* http://vuejs.creative-tim.com/paper-dashboard-pro/documentation.html?utm_source=tim&utm_medium=email&utm_campaign=documentation&selectedKind=Welcome&selectedStory=to%20Vue%20Paper%20Dashboard%20PRO&full=0&down=1&left=1&panelRight=0&downPanel=storybook%2Factions%2Factions-panel
*/
import Vue from 'vue'
import './pollyfills'
import VueSession from 'vue-session'
import VueRouter from 'vue-router'
import VueNotify from 'vue-notifyjs'
// import VeeValidate from 'vee-validate'
import es from 'vee-validate/dist/locale/es'
import VeeValidate, { Validator } from 'vee-validate'

import lang from 'element-ui/lib/locale/lang/es'
import locale from 'element-ui/lib/locale'
import App from './App.vue'

// Plugins
import GlobalComponents from './gloablComponents'
import GlobalDirectives from './globalDirectives'
import GlobalFilters from './globalFilters'
import GlobalValidators from './globalValidators'
// import GlobalPlugIns from './globalPlugins'
import SideBar from './components/UIComponents/SidebarPlugin'

// router setup
import routes from './routes/routes'

// library imports
import './assets/sass/paper-dashboard.scss'
import './assets/sass/element_variables.scss'
import './assets/sass/demo.scss'

import sidebarLinks from './sidebarLinks'

import swal from 'sweetalert2'
import {serviceAuthLoginEntitie, serviceAuthLoginClient, serviceAuthLoginUser, serviceLoginCobranzas} from './apiService.LoginCobranzas'
import {async} from './async'

// plugin setup
Vue.use(VueSession)
Vue.use(VueRouter)
Vue.use(GlobalComponents)
Vue.use(GlobalDirectives)
Vue.use(GlobalFilters)
Vue.use(GlobalValidators)
// Vue.use(GlobalPlugIns)
Vue.use(VueNotify)
Vue.use(SideBar, {sidebarLinks: sidebarLinks})

Validator.localize('es', es)
Vue.use(VeeValidate)

locale.use(lang)

// configure router
const router = new VueRouter({
  // mode: 'history',
  routes: routes, // short only specify routes
  linkActiveClass: 'active'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: router,
  created: function () {
    // this.swal = swal;
    // this.clientLoginCobranzas = clientLoginCobranzas;
    // this.async = async;
  },
  render: h => h(App),
  components: {
    // globalFunctions
    serviceAuthLoginEntitie, 
    serviceAuthLoginClient, 
    serviceAuthLoginUser,
    serviceLoginCobranzas    
  }
})
