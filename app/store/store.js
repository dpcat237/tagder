import Vue from 'nativescript-vue';
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: loadModules(),
})

function loadModules() {
  const files = require.context('./modules', false, /\.js$/)
  const modules = {}

  files.keys().forEach(key => {
    modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
  })
  return modules
}
