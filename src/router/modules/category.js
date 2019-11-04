/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const categoryRouter = {
  path: '/category',
  component: Layout,
  redirect: 'noRedirect',
  name: 'category',
  meta: {
    title: '分类管理',
    icon: 'category'
  },
  children: [
    {
    path: 'category',
    component: () => import('@/views/category/category'),
    name: 'categoryList',
    meta: { title: '类目管理', icon: 'cate', auth: true }
    },
    {
     path: 'class',
     component: () => import('@/views/category/class'),
     name: 'classList',
     meta: { title: '标签管理', icon: 'tag', auth: true }
    }
  ]
}
export default categoryRouter
