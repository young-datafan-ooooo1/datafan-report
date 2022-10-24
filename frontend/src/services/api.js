/*
 * @Description:
 * @Date: 2021-06-17 10:17:44
  */
// 跨域代理前缀
// const API_PROXY_PREFIX='/api'
// const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
const BASE_URL = process.env.VUE_APP_API_BASE_URL

let BASE = location.origin + '/api'
let ASSETS_URL = location.origin + '/static'
if (process.env.NODE_ENV === 'development') {
  BASE = BASE_URL
  ASSETS_URL = 'http://192.168.10.155:18180/static'
}
module.exports = {
  ASSETS_URL,
  // 知识库模块
  KNOWLEDGE: `${BASE}/vulcan-knowledgebase-management-provider`,
  LOGIN: `${BASE}/rbac-user-server/oauth/token`,
  ROUTES: `${BASE_URL}/routes`,
  SYSTEM_MANAGER: `${BASE}/rbac-user-server`,
  FILE: `${BASE}/escat-file-management-provider`,
  TAG: `${BASE}/mousika-tagmanagement-provider`,
  REPORT: `${BASE}/escat-report-portal-provider`
}
