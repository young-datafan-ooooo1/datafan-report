/*
 * @Description:
 * @Date: 2021-07-07 16:05:37
  */
import { SYSTEM_MANAGER } from '@/services/api'
import { request, METHOD } from '@datamp/common-component-hrui'

const BASE_URL = SYSTEM_MANAGER + '/permission'

export async function getMyResourceTree(params, config) {
  return request(BASE_URL + '/myListTree/' + params, METHOD.GET, config)
}
