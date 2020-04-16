import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)

Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + 1 + '').padStart(2, '0')

  const hh = (dt.getHours() + 1 + '').padStart(2, '0')
  const mm = (dt.getMinutes() + 1 + '').padStart(2, '0')
  const ss = (dt.getSeconds() + 1 + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.filter('dataFormat01', function (originVal) {
  const newDate = new Date()
  newDate.setTime(originVal * 1000)
  return newDate.toLocaleString()
})

Vue.prototype.$http = axios
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 一旦调用axios。会优先调用request。
axios.interceptors.request.use(confi => {
  // console.log(confi)
  confi.headers.Authorization = window.sessionStorage.getItem('data')
  return confi
})

Vue.config.productionTip = false

// 1. 先new一个vue的实例
// 2. 通过render函数将app根组件渲染到页面
// 3. 把router 路由挂载到了vue实例上
//
new Vue({
  router,
  render: h => h(App)

}).$mount('#app')
