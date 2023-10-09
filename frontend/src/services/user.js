import { LOGIN, ROUTES, SYSTEM_MANAGER } from '@/services/api'
import { request, METHOD, removeAuthorization } from '@datamp/common-component-sgm'

/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
// export async function login(name, password) {
//   return request(LOGIN, METHOD.POST, {
//     name: name,
//     password: password
//   })
// }

const headers = {
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
}
const transformRequest = [
  function(data) {
    let ret = ''
    for (const it in data) {
      ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    ret = ret.substring(0, ret.lastIndexOf('&'))
    return ret
  }
]

export async function login(data) {
  return request(LOGIN, METHOD.POST, data, {
    headers: headers,
    transformRequest: transformRequest
  })
}

export async function getRoutesConfig() {
  return request(ROUTES, METHOD.GET)
}

/**
 * 退出登录
 */
export function logout() {
  localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
  localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
  localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
  removeAuthorization()
}

/**
 * @description: 统一认证退出登录
 */
export async function sgmLoginOut() {
  return request(`${SYSTEM_MANAGER}/sgm/loginOut`, METHOD.GET)
}

export default {
  login,
  logout,
  sgmLoginOut,
  getRoutesConfig
}
