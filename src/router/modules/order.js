/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const orderRouter = {
  path: '/order',
  component: Layout,
  redirect: 'noRedirect',
  name: 'order',
  meta: {
    title: '订单管理',
    icon: 'order'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/order/list'),
      name: 'OrderList',
      meta: { title: '订单列表', icon: 'form', auth: true }
    }
  ]
}
export default orderRouter
