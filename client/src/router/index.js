import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/Welcome'
import Register from '@/components/Register'
import Login from '@/components/Login'
import MemMain from '@/components/MemMain'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'root',
      component: Welcome
    },
    {
      path: '/mem-main',
      name: 'mem-main',
      component: MemMain
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
