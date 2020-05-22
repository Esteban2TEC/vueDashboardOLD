import { rutValidator, rutFilter, rutInputDirective } from 'vue-dni'
/**
 * You can register global plugins here and use them as a plugin in your main Vue instance
 */

const GlobalPlugins = {
  install (Vue) {
    Vue.validator('rutValidator', rutValidator)
    Vue.filter('rutFilter', rutFilter)
    Vue.directive('rut', rutInputDirective)
  }
}

export default GlobalPlugins
