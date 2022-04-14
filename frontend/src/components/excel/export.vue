<!--
 * @Description: 导出 按钮
 * @Date: 2021-08-25 10:09:12
 -->
<template>
  <a-button
    type="primary"
    ghost
    shape="round"
    class="page-handle-item__btn"
    @click="onExport"
  >
    导出
  </a-button>
</template>
<script>
import { getAdThemeExport } from '@/services/excel'
export default {
  props: {
    ids: {
      type: Array,
      default: () => {
        return []
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
    // 导出默认参数配置
    const exportParmas = {
      includeName: true,
      includeCode: true,
      includeDesc: true,
      includeCreateUser: true,
      includeCreateTime: true,
      includeUpdateTime: true
    }
    return {
      exportParmas
    }
  },
  methods: {
    /**
     * @description：导出
     */
    onExport() {
      if (this.ids.length !== 0) {
        let ids = ''
        this.ids?.forEach((id, index) => {
          if (index !== this.ids.length - 1) {
            ids = ids + id.id + ','
          } else {
            ids = ids + id.id
          }
        })
        const params = {
          controllerName: this.controllerName,
          ids: ids,
          fileds: { ...this.exportParmas }
        }
        getAdThemeExport(params).then((res) => {
          console.log(res)
        })
      } else {
        this.$message.warning('请至少选择一行数据', 5)
      }
    }
  }
}
</script>
