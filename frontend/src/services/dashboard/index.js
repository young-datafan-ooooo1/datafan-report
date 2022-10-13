/*
 * @Description: dashboard
 * @Date: 2021-12-08 18:18:17
  */
import { REPORT } from '@/services/api'
import { request, METHOD } from '@datamp/common-component'

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
   * @description: 新建看板
   */
  saveDashboard(params) {
    return request(`${REPORT}/dpPortalDashboard/saveDashboard`, METHOD.POST, params)
  },
  /**
   * @description: 批量删除看板
   */
  batchDeleteDashboard(params) {
    return request(`${REPORT}/dpPortalDashboard/batchDel`, METHOD.DELETE, { data: params })
  },
  /**
   * @description: 校验名称重复
   */
  onCheckDashboardName(params = {}) {
    return request(`${REPORT}/dpPortalDashboard/isRepeat`, METHOD.GET, { params })
  }
}
export default DashboardApiServices
