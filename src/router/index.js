import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/store/auth'

const AdminLayout = () => import('@/layouts/AdminLayout.vue')
const PublicLayout = () => import('@/layouts/PublicLayout.vue')
const Login = () => import('@/pages/auth/Login.vue')
const Register = () => import('@/pages/auth/Register.vue')
const Dashboard = () => import('@/pages/admin/Dashboard.vue')
const Roles = () => import('@/pages/admin/Roles.vue')
const Users = () => import('@/pages/admin/Users.vue')
const Restaurants = () => import('@/pages/admin/Restaurants.vue')
const Branches = () => import('@/pages/admin/Branches.vue')
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
        meta: { title: 'ເມນູ QR' },
      },
    ],
  },
  {
    path: '/auth/login',
    name: 'login',
    component: Login,
    meta: { guestOnly: true, title: 'ເຂົ້າສູ່ລະບົບ' },
  },
  {
    path: '/auth/register',
    name: 'register',
    component: Register,
    meta: { guestOnly: true, title: 'ສ້າງບັນຊີ' },
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
        meta: { title: 'ໜ້າຫຼັກ' },
      },
      {
        path: 'roles',
        name: 'roles',
        component: Roles,
        meta: { title: 'ບົດບາດ' },
      },
      {
        path: 'users',
        name: 'users',
        component: Users,
        meta: { title: 'ຜູ້ໃຊ້' },
      },
      {
        path: 'restaurants',
        name: 'restaurants',
        component: Restaurants,
        meta: { title: 'ຮ້ານອາຫານ' },
      },
      {
        path: 'branches',
        name: 'branches',
        component: Branches,
        meta: { title: 'ສາຂາ' },
      },
      {
        path: 'categories',
        name: 'categories',
        component: Categories,
        meta: { title: 'ໝວດໝູ່' },
      },
      {
        path: 'menu-items',
        name: 'menu-items',
        component: MenuItems,
        meta: { title: 'ລາຍການເມນູ' },
      },
      {
        path: 'qr-codes',
        name: 'qr-codes',
        component: QRCode,
        meta: { title: 'ລະຫັດ QR' },
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

  document.title = to.meta.title ? `${to.meta.title} | ເມນູ QR` : 'ເມນູ QR'

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return '/admin'
  }

  return true
})

export default router
