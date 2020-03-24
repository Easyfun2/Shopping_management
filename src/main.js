import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

Vue.config.productionTip = false

// 1. 先new一个vue的实例
// 2. 通过render函数将app根组件渲染到页面
// 3. 把router 路由挂载到了vue实例上
//
new Vue({
  router,
  render: h => h(App)

}).$mount('#app')
