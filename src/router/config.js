/*
 * @Description: 路由配置
 * @Date: 2021-11-10 10:28:08
 * @LastEditTime: 2022-01-19 15:54:20
 */
import TabsView from '@/layouts/tabs/TabsView'
// import BlankView from '@/layouts/BlankView'
// import {
//   Resource,
//   RoleManager,
//   OrganizationManager,
//   UserManager,
//   SysAccessLog,
//   DeptManager
// } from '@sense70/common-sysmanage-vue'

// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404')
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403')
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/home',
      children: [
        {
          path: 'home',
          name: '首页',
          meta: {
            nodeEnName: 'home'
          },
          component: () => import('@/pages/home')
        },
        {
          path: 'chart',
          name: '图表',
          meta: {
            nodeEnName: 'chart'
          },
          component: () => import('@/pages/chart')
        }
      ]
    },
    {
      path: '/',
      name: '看板',
      component: TabsView,
      redirect: '/board',
      meta: {
        nodeEnName: 'board'
      },
      children: [
        {
          path: 'board',
          name: '看板列表',
          meta: {
            nodeEnName: 'board'
          },
          component: () => import('@/pages/board')
        },
        {
          path: 'board/dashboard',
          name: '图表',
          meta: {
            nodeEnName: 'board'
          },
          component: () => import('@/pages/board/dashboard.vue')
        }
      ]
    }
  ]
}
export default options
