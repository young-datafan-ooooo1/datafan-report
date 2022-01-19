<!--
 * @Description: 导入 按钮
 * @Date: 2021-08-25 10:09:12
 * @LastEditTime: 2021-08-30 09:17:43
-->
<template>
  <a-button
    type="primary"
    ghost
    shape="round"
    class="page-handle-item__btn"
    @click="onImp"
  >
    导入
    <!-- 导入 -->
    <CommonImport v-model="isShowImpDialog" :title="importTitle" :controller-name="controllerName" />
  </a-button>

</template>
<script>
import CommonImport from '@/components/excel/index'
export default {
  components: { CommonImport },
  props: {
    ids: {
      type: Array,
      default: () => {
        return []
      }
    },
    importTitle: {
      type: String,
      default: () => {
        return ''
      }
    },
    controllerName: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data() {
    return {
      // 弹框是否显示
      isShowImpDialog: false
    }
  },
  methods: {
    /**
     * @description：导入model框
     */
    onImp() {
      this.isShowImpDialog = true
    }
  }
}
</script>
