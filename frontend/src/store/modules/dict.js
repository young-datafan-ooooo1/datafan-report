/*
 * @Description: 字典下拉相关store
 * @Date: 2021-09-10 09:06:58
  */
export default {
  namespaced: true,
  state: {
    dictObj: {}
  },
  getters: {
    dictObj(state) {
      return state.dictObj
    }
  },
  mutations: {
    /**
     * @description: 设置字典项
     * @param {object} state
     * @param {string} key
     * @param {array} value
     */
    setDictItem(state, { key, value }) {
      if (key && value && value.length > 0) {
        state.dictObj[key] = value
      }
    }
  }
}
