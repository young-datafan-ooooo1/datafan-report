/*
 * @Description: 下载导入模板
 * @params: 各个不同controller的模板导入
 * @Date: 2021-08-23 17:27:42
 * @LastEditTime: 2021-08-30 08:39:52
 */
import { KNOWLEDGE } from '@/services/api'
import { request, METHOD } from '@sense70/common-component-vue'
import qs from 'qs'

/**
 * @description 导入模板
 * @param {*} controllerName 控制器名称
 */
export async function downLoadTemplate(controllerName) {
  return window.open(`${KNOWLEDGE}/${controllerName}/template`, METHOD.GET)
}

/**
 * @description 导入历史信息
 * @param {*} importType
    THEME(1),
    TABLE(2),
    FIELD(3),
    RELATIONSHIP(4),
    DICTIONARY(5);
 */
export async function getAdImportHistory(params) {
  return request(`${KNOWLEDGE}/adImportHistory/`, METHOD.GET, { params })
}

/**
 * @description 导入配置
 * @param {params}} 导出参数
 * @param {file} file 文件信息
 */
export async function postAdThemeImport(params, file) {
  return request(`${KNOWLEDGE}/${params.controllerName}/excel?isUpdate=${params.isUpdate}`, METHOD.POST, file)
}

/**
 * @description 导出
 * @param {params} params 控制器名称，ids
 */
export async function getAdThemeExport(params) {
  return window.open(`${KNOWLEDGE}/${params.controllerName}/excel/${params.ids}?` + qs.stringify(params.fileds), METHOD.GET)
}
