/*
 * @Description:
 * @Date: 2021-06-17 10:17:44
 * @LastEditTime: 2021-08-16 11:14:35
 */
import Vue from 'vue'
import Router from 'vue-router'
import { formatRoutes } from '@/utils/routerUtil'
import { getMyResourceTree } from '@/services/system/resource.js'
import Cookie from 'js-cookie'

Vue.use(Router)

// 不需要登录拦截的路由配置
const loginIgnore = {
  names: ['404', '403'], // 根据路由名称匹配
  paths: ['/login'], // 根据路由fullPath匹配
  /**
   * 判断路由是否包含在该配置中
   * @param route vue-router 的 route 对象
   * @returns {boolean}
   */
  includes(route) {
    return this.names.includes(route.name) || this.paths.includes(route.path)
  }
}

/**
 * 初始化路由实例
 * @param isAsync 是否异步路由模式
 * @returns {VueRouter}
 */
function initRouter(isAsync) {
  const options = isAsync
    ? require('./async/config.async').default
    : require('./config').default
  formatRoutes(options.routes)
  return new Router(options)
}

/**
 * @description: 从后端获取路由信息
 * @return 完整路由
 */
async function getResourceBySystem_() {
  const params = 'vulcan-assets-dev'
  // 获取用户菜单列表
  const headerConfig = { 'authorization-userId': Cookie.get('userId') }
  const res = await getMyResourceTree(params, headerConfig)
  if (res.status === 200) {
    const menuData = res.data.data?.children[0]?.children
    const btnArray = [...menuData]
    const btnData = []
    saveBtn(btnArray, btnData)
    setPath(menuData)
    return { menuData, btnData }
  }
}

/**
 * @description: 设置路由名称等信息
 * @param {array} array 路由节点数组
 * @param {string} parentName 父级路由名称
 */
function setPath(array, parentName) {
  for (let i = 0; i < array.length; i++) {
    const item = array[i]
    if (item.nodeType !== 'MENU') {
      continue
    }
    item.fullPath = parentName ? '/' + parentName + '/' + item.link : '/' + item.link
    item.path = item.link
    // item.meta = { icon: 'appstore-o' }
    // item.meta = { icon: 'icondibutubiao_shouye' }
    item.meta = { icon: item.icon }
    item.name = item.nodeName
    if (item.hasChildren) {
      if (item.children[0].nodeType !== 'MENU') {
        delete item.children
      } else {
        setPath(item.children, item.path)
      }
    }
  }
}

function saveBtn(array, btnData) {
  if (!array || array.length === 0) {
    return
  }
  for (let i = 0; i < array.length; i++) {
    const item = array[i]
    if (item.nodeType === 'MENU') {
      saveBtn(item.children, btnData)
    } else {
      btnData.push(item.nodeEnName)
      if (item.hasChildren) {
        saveBtn(item.children, btnData)
      }
    }
  }
}

export { loginIgnore, initRouter, getResourceBySystem_ }
