import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import adminRouter from './modules/admin'

import caseRouter from './modules/case'
import newsRouter from './modules/news'
import aboutRouter from './modules/about'

import orderRouter from './modules/order'
import categoryRouter from './modules/category'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', name: '404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', name: '401', component: () => import('@/views/errorPage/401'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', noCache: true },
        component: () => import('@/views/dashboard/index')
      },
      { path: 'profile', name: 'Profile', component: () => import('@/views/set/profile'), hidden: true },
      { path: 'password', name: 'Password', component: () => import('@/views/set/password'), hidden: true }
    ]
  }
]

export const asyncRoutes = [
  adminRouter,
  caseRouter,
  newsRouter,
  aboutRouter,
  orderRouter,
  categoryRouter,
  {
    path: '/set',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Set',
    meta: { title: '系统设置', icon: 'example' },
    children: [
      {
        path: 'parameter',
        name: 'ParameterList',
        component: () => import('@/views/set/parameter'),
        meta: { title: '参数管理', icon: 'form', auth: true }
      },
      {
        path: 'menu',
        name: 'MenuList',
        component: () => import('@/views/set/menu'),
        meta: { title: '菜单管理', icon: 'form', auth: true }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
