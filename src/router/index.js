
import NotFound from '../views/404.vue'
import Home from '../views/dashboard'
import Group from '../views/tree'
import User from '../views/table'
import Login from '../views/login/index'
import Layout from '../views/layout/common'

let routes = [
  {
    path: '/login',
    component: Login,
    name: '登陆',
    hidden: true
  },
  {
    path: '/404',
    component: NotFound,
    name: '404',
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    },
      { path: '/user/table',
        component: User,
        name: '用户管理'},
      { path: '/group/tree',
        component: Group,
        name: '组织机构'
      }
    ]
  },
  {
    path: '/example',
    component: Home,
    name: '首页',
    iconCls: 'el-icon-menu',
    children: [
      { path: '/user/table',
        component: User,
        name: '用户管理'},
      { path: '/group/tree',
        component: Group,
        name: '组织机构'
      }
    ]
  },
  {
    path: '*',
    hidden: true,
    redirect: { path: '/404' }
  }
]
export default routes

