import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import store from './store'

// fastclick.attach(document.body)

Vue.use(VueLazyload, {
  loading: require('common/image/default.png')
})

import 'common/stylus/index.styl'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
