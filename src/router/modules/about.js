/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const aboutRouter = {
  path: '/about',
  component: Layout,
  redirect: 'noRedirect',
  name: 'about',
  meta: {
    title: '公司管理',
    icon: 'user'
  },
  children: [
    {
      path: 'about',
      component: () => import('@/views/about/list'),
      name: 'Aboutlist',
      meta: { title: '公司管理', icon: 'company', auth: true }
    }
  ]
}
export default aboutRouter
