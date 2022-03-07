/*
 * @Description: 首页
 * @Date: 2021-12-08 18:18:17
 * @LastEditTime: 2022-03-07 16:39:04
 */
import { REPORT } from '@/services/api'
import { request, METHOD } from '@sense70/common-component-vue'

const ChartApiServices = {
  /**
   * @description: 获取首页列表数据
   */
  getChartInfo() {
    return request(`${REPORT}/dpPortalDashboard/reportList`, METHOD.GET)
  },
  /**
   * @description: 获取详情
   * @param {Object} params 参数
   */
  getChartDetailInfo(params) {
    return request(`${REPORT}/dpPortalDashboard/queryReportData`, METHOD.POST, params)
  },
  /**
   * @description: 获取列表
   * @param {Object} params 参数
   */

  getChartList(params) {
    return request(`${REPORT}/dpPortalReportRecord`, METHOD.GET, { params })
  },
  /**
   * @description: 删除图表
   * @param {number} chartId 图表id
   */
  deleteChart(chartId) {
    return request(`${REPORT}/dpPortalReportRecord/${chartId}`, METHOD.DELETE)
  },
  /**
   * @description: 获取图表详情
   * @param {Object} params 参数
   */
  getChartDetail(params) {
    return request(`${REPORT}/dpPortalReportRecord/get/reportById`, METHOD.GET, { params })
  },
  /**
   * @description: 获取详情
   * @param {Object} params 参数
   */
  getChartData(params) {
    return request(`${REPORT}/dpPortalReportRecord/querySql`, METHOD.POST, params)
  },
  /**
   * @description: 保存报表
   * @param {*} params
   */
  saveReports(params) {
    return request(`${REPORT}/dpPortalReportRecord/save/reports`, METHOD.POST, params)
  },
  /**
   * @description: 通过dm获取详情
   * @param {Object} params 参数
   */
  getChartDetailByDm(params) {
    return request(`${REPORT}/dpPortalReportRecord/get/dm`, METHOD.GET, { params })
  },
  // 下载url
  downloadReportExcelUrl: `${REPORT}/dpPortalReportRecord/excelDownloadByNativeSql?access_token=`
}
export default ChartApiServices
