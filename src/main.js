import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Toasted from 'vue-toasted';

Vue.use(Toasted)

Vue.config.productionTip = false

import "../public/normalize.css"
import "./assets/css/main.css"
import "./assets/css/forms.css"
import "./assets/css/articles.css"
import "./assets/css/user.css"

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
