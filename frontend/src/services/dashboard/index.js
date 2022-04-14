/*
 * @Description: dashboard
 * @Date: 2021-12-08 18:18:17
  */
import { REPORT } from '@/services/api'
import { request, METHOD } from '@sense70/common-component-vue'

const DashboardApiServices = {
  /**
   * @description: 获取首页列表数据
   */
  getDashboardDetailInfo(params = {}) {
    return request(`${REPORT}/dpPortalDashboard/getDashboardDetailById`, METHOD.GET, { params })
  },
  /**
   * @description: 更新看板
   */
  updateDashboard(params) {
    return request(`${REPORT}/dpPortalDashboard/updateDashboard`, METHOD.PUT, params)
  },
  /**
   * @description: 新增看板
   */
  saveDashboard(params) {
    return request(`${REPORT}/dpPortalDashboard/saveDashboard`, METHOD.POST, params)
  }
}
export default DashboardApiServices
