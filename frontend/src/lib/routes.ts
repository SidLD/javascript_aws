import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/home/index.vue'
import Login from '@/pages/authentication/Login.vue'
import Register from '@/pages/authentication/Register.vue'
import Dashboard from '@/pages/dashboard/index.vue'
import Records from '@/components/Records.vue'
import { auth } from './auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false, redirectIfAuth: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false, redirectIfAuth: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/records',
    name: 'Records',
    component: Records,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  // Check if route requires authentication
  if (to.meta.requiresAuth && !auth.isAuthenticated()) {
    next('/login')
    return
  }

  // Redirect authenticated users away from login/register
  if (to.meta.redirectIfAuth && auth.isAuthenticated()) {
    next('/dashboard')
    return
  }

  next()
})

export default router
