/*
 * @Description: 正则验证
 * @Date: 2021-08-17 14:39:34
 * @LastEditTime: 2021-09-08 16:05:36
 */

/**
 * @description: 统一校验
 * @param {RegExp} rule 校验规则
 * @param {string｜number} value 被校验的值
 * @param {Function} callback 回调函数
 * @param {string} tips 提示语
 */
 export function validate(rule, value, callback, tips) {
  if(value && !rule.test(value)) {
    callback(new Error(tips))
  } else {
    callback()
  }
}

/**
 * @description: 校验是否只包含英文、数字、下划线
 * @param 入参为antdv表单自定义校验传入, callback必须被调用
 */
 
export function regEngNumLine(rule,value,callback) {
  const reg = /^[_a-zA-Z0-9]+$/
  const tips = '请输入英文、数字、下划'
  validate(reg, value, callback, tips)
}

/**
 * @description: 校验是否英文开头，只包含英文、数字、下划线
 * @param 入参为antdv表单自定义校验传入, callback必须被调用
 */
 
export function regEngStarNumLine(rule,value,callback) {
  const reg = /^[a-zA-Z][a-zA-Z0-9_]*$/
  const tips = '以英文开始，可包含英文、数字、下划'
  validate(reg, value, callback, tips)
}

/**
 * @description: 校验是否是中文
 * @param 入参为antdv表单自定义校验传入, callback必须被调用
 */
export function regChinese(rule,value,callback) {
  const reg=/^[\u4e00-\u9fa5]+$/
  const tips='请输入中文'
  validate(reg, value, callback, tips)
}
/**
 * @description: 校验是否是英文
 * @param 入参为antdv表单自定义校验传入, callback必须被调用
 */
export function regEnglish(rule,value,callback) {
  const reg=/^[a-zA-Z]+$/
  const tips='请输入英文'
  validate(reg, value, callback, tips)
}
/**
 * @description: 校验是否是正整数
 * @param 入参为antdv表单自定义校验传入, callback必须被调用
 */
 export function regNumber(rule,value,callback) {
  const reg=/^[+]{0,1}(\d+)$/
  const tips='请输入正整数'
  validate(reg, value, callback, tips)
}