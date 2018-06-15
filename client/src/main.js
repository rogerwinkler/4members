// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { sync } from 'vuex-router-sync'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import colors from 'vuetify/es5/util/colors'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import store from '@/store/store'

Vue.config.productionTip = false

Vue.use(Vuetify, {
  theme: {
    primary: colors.teal.base,
    secondary: colors.teal.lighten2,
    accent: colors.teal.darken4,
    error: colors.orange.darken4,
    info: colors.teal.lighten4,
    success: colors.teal.darken4,
    warning: colors.amber.lighten2
  }
})
// Vue.use(Vuetify)

sync(store, router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
