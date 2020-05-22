import {directive} from 'vue-clickaway'
import {rutInputDirective} from 'vue-dni'
/**
 * You can register global directives here and use them as a plugin in your main Vue instance
 */

const GlobalDirectives = {
  install (Vue) {
    Vue.directive('click-outside', directive)
    Vue.directive('rut', rutInputDirective)
  }
}

export default GlobalDirectives
