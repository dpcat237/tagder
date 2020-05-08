import Vue from 'nativescript-vue'
import App from './components/App'
import VueDevtools from 'nativescript-vue-devtools'
import axios from 'axios'

if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}
import store from './store/store'

// Prints Vue logs when --env.production is *NOT* set while building
Vue.http = Vue.prototype.$http = axios
Vue.config.silent = (TNS_ENV === 'production')


new Vue({
  store,
  render: h => h('frame', [h(App)])
}).$start()
