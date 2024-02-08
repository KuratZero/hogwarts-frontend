import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import InfoView from '../views/InfoView.vue'
import UserView from '../views/user/UserView.vue'
import LoginView from '../views/user/actions/LoginView.vue'
import RegisterView from '../views/user/actions/RegisterView.vue'
import WritePostView from '../views/post/actions/WritePostView.vue'
import UserUpdateView from "@/views/user/actions/UserUpdateView.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/info',
    name: 'info',
    component: InfoView
  },
  {
    path: '/user/:name',
    name: 'user-page',
    component: UserView
  },
  {
    path: '/user/:name/update',
    name: 'user-page-update',
    component: UserUpdateView
  },
  {
    path: '/register',
    name: 'user-register',
    component: RegisterView
  },
  {
    path: '/login',
    name: 'user-login',
    component: LoginView
  },
  {
    path: '/writePost',
    name: 'write-post',
    component: WritePostView
  }
]


const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
