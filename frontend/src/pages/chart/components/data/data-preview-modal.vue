<!--
 * @Description: 数据预览弹窗
 * @Date: 2022-02-21 11:18:32
 * @LastEditTime: 2022-03-07 18:25:19
-->
<template>
  <a-base-modal
    v-model="isModalShow"
    class="data-preview-modal"
    :title="'数据预览'"
    width="900px"
    :footer="null"
    @cancel="onCancel"
  >
    <SenseTable
      class="a-base-modal"
      :columns="columns"
      :data="tableData"
      :loading="tableLoading"
      border
      size="small"
      hide-pager
      height="400"
    />
  </a-base-modal>
</template>

<script>
import ChartApiServices from '@/services/chart'
export default {
  name: 'DataPreviewModal',

  model: {
    prop: 'visible',
    event: 'change'
  },

  props: {
    // modal显示隐藏
    visible: {
      type: Boolean,
      default: false
    },
    config: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      // 是否显示modal
      isModalShow: false,
      tableData: [],
      tableLoading: false
    }
  },

  computed: {
    columns() {
      return this.config?.columnListVOS?.map(item => {
        const { columnChinsesName: title, columnChinsesName: field } = item

        return {
          title,
          field
        }
      })
    }
  },

  watch: {
    // 监听显示隐藏，控制data数据
    visible(val) {
      this.isModalShow = val
      val && this.initPage()
    }
  },

  methods: {
    /**
     * @description: 初始化页面
     */
    initPage() {
      this.tableLoading = true
      ChartApiServices.getChartData(this.config).then(res => {
        this.tableData = res?.data?.content?.groupByRowNames[0].list
      }).finally(() => {
        this.tableLoading = false
      })
    },
    /**
     * @description: 取消按钮
     */
    onCancel() {
      this.onClose()
    },
    /**
     * @description: 关闭弹窗
     */
    onClose() {
      this.$emit('change')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
