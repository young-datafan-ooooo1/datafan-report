/*
 * @Description: 字典相关数据API
 * @Date: 2021-07-12 15:21:01
 * @LastEditTime: 2021-09-02 11:26:39
 */
import { SYSTEM_MANAGER } from '@/services/api'
import { request, METHOD } from '@sense70/common-component-vue'

export async function getDictByType(params) {
  return request(`${SYSTEM_MANAGER}/dict/query`, METHOD.GET, {
    params: params
  })
}

export default {
  getDictByType
}
