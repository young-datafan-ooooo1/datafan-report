/*
 * @Description: 首页
 * @Date: 2021-12-08 18:18:17
  */
import { REPORT } from '@/services/api'
import { request, METHOD } from '@sense70/common-component-vue'

const HomeApiServices = {
  /**
   * @description: 获取首页列表数据
   */
  getHomeListInfo(params = {}) {
    return request(`${REPORT}/dpPortalDashboard`, METHOD.GET, { params })
  },
  /**
   * @description: 删除
   * @param {number} id id
   */
  deleteDashboard(id) {
    return request(`${REPORT}/dpPortalDashboard/deleteDashboard/${id}`, METHOD.DELETE)
  }
}
export default HomeApiServices
