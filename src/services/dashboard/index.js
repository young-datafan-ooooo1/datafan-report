/*
 * @Description: dashboard
 * @Date: 2021-12-08 18:18:17
 * @LastEditTime: 2022-01-21 17:00:30
 */
import { REPORT } from '@/services/api'
import { request, METHOD } from '@sense70/common-component-vue'

const DashboardApiServices = {
  /**
   * @description: 获取首页列表数据
   */
  getDashboardDetailInfo(params = {}) {
    return request(`${REPORT}/dpPortalDashboard/getDashboardDetailById`, METHOD.GET, { params })
  }
}
export default DashboardApiServices
