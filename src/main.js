// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import routes from './router'
import ElementUI from 'element-ui';
import VueRouter from 'vue-router'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(ElementUI);
Vue.config.productionTip = false
//在vuerouter组件中引用啦 routes
const router = new VueRouter({routes})
/* eslint-disable no-new */


//登录拦截
router.beforeEach((to, from, next) => {
  // 去登陆将登录页面中的session删除
    if (to.path === '/login') {
      sessionStorage.removeItem('user')
    }
    // 在这个页面判断session中有没有你这个用户，没有的话强制去登陆页面
    let user = JSON.parse(sessionStorage.getItem('user'))
    if (!user && to.path !== '/login') {
      next({ path: '/login' })
    } else {
    next()
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
