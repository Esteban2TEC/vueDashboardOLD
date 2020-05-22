import {rutFilter} from 'vue-dni'
/**
 * You can register global filters here and use them as a plugin in your main Vue instance
 */

const GlobalFilters = {
  install (Vue) {
    Vue.filter('rutFilter', rutFilter)
  }
}

export default GlobalFilters
