import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/store/auth'

const AdminLayout = () => import('@/layouts/AdminLayout.vue')
const PublicLayout = () => import('@/layouts/PublicLayout.vue')
const Login = () => import('@/pages/auth/Login.vue')
const Register = () => import('@/pages/auth/Register.vue')
const Dashboard = () => import('@/pages/admin/Dashboard.vue')
const Categories = () => import('@/pages/admin/Categories.vue')
const MenuItems = () => import('@/pages/admin/MenuItems.vue')
const QRCode = () => import('@/pages/admin/QRCode.vue')
const Menu = () => import('@/pages/public/Menu.vue')

const routes = [
  {
    path: '/',
    redirect: '/auth/login',
  },
  {
    path: '/scan/:uuid',
    component: PublicLayout,
    children: [
      {
        path: '',
        name: 'public-menu',
        component: Menu,
      },
    ],
  },
  {
    path: '/auth/login',
    name: 'login',
    component: Login,
    meta: { guestOnly: true },
  },
  {
    path: '/auth/register',
    name: 'register',
    component: Register,
    meta: { guestOnly: true },
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'categories',
        name: 'categories',
        component: Categories,
      },
      {
        path: 'menu-items',
        name: 'menu-items',
        component: MenuItems,
      },
      {
        path: 'qr-codes',
        name: 'qr-codes',
        component: QRCode,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  authStore.hydrate()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return '/admin'
  }

  return true
})

export default router
