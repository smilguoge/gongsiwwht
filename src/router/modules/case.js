/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const userRouter = {
  path: '/case',
  component: Layout,
  redirect: 'noRedirect',
  name: 'anli',
  meta: {
    title: '案例管理',
    icon: 'user'
  },
  children: [
    {
      path: 'case',
      component: () => import('@/views/case/list'),
      name: 'CaseList',
      meta: { title: '案例管理', icon: 'form', auth: true }
    }
  ]
}
export default userRouter
