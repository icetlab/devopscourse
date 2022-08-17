import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Customer from './views/Customer.vue'
import Basket from './views/Basket.vue'
import Admin from './views/Admin.vue'
import History from './views/History.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/customer',
      name: 'customer',
      component: Customer
    },
    {
      path: '/customer/finalize',
      name: 'basket',
      component: Basket
    },
    {
      path: '/customer/orders',
      name: 'history',
      component: History
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin
    }
  ]
})
