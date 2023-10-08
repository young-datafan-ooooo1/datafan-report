import { request, METHOD } from '@datamp/common-component-sgm'
import { REPORT } from '@/services/api'

/**
 * @description: 分享报表分页查询
 */
export function getSharedReportListByPage(params) {
  return request(`${REPORT}/dpPortalDashboardShare/sharePage`, METHOD.GET, params)
}

/**
 * @description: 获取能够分享的用户列表
 */
export function getCanShareUserListApi(params) {
  return request(`${REPORT}/dpPortalDashboardShare/getUser`, METHOD.GET, { params })
}

/**
 * @description: 获取已分享用户
 */
export function getSharedUserApi(params) {
  return request(`${REPORT}/dpPortalDashboardShare/getSharedUser`, METHOD.GET, { params })
}

/**
 * @description: 分享报表
 */
export function shareReportApi(params) {
  return request(`${REPORT}/dpPortalDashboardShare/add`, METHOD.POST, params)
}
