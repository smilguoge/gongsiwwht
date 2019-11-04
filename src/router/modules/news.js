/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const newsRouter = {
  path: '/news',
  component: Layout,
  redirect: 'noRedirect',
  name: 'news',
  meta: {
    title: '新闻管理',
    icon: 'user'
  },
  children: [
    {
      path: 'news',
      component: () => import('@/views/news/list'),
      name: 'newsList',
      meta: { title: '新闻管理', icon: 'list', auth: true }
    }
  ]
}
export default newsRouter
