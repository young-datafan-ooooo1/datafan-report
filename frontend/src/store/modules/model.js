/*
 * @Description: 切换模块
 * @Date: 2021-09-10 09:06:58
  */
export default {
  namespaced: true,
  state: {
    model: '',
    modelList: []
  },
  getters: {
    model(state) {
      return state.model
    },
    modelList(state) {
      return state.modelList
    }
  },
  mutations: {
    /**
       * @description: 设置模型id
       * @param {object} state
       */
    setModel(state, obj) {
      state.model = obj
    },
    /**
       * @description: 设置可选模型List
       * @param {object} state
       */
    saveModelList(state, data) {
      state.modelList = data
    }
  }
}

