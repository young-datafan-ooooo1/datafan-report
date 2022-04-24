<!--
 * @Description: 数据预览弹窗
 * @Date: 2022-02-21 11:18:32
 -->
<template>
  <a-base-modal
    v-model="isModalShow"
    class="data-preview-modal"
    :title="'数据预览'"
    width="1200px"
    :footer="null"
    @cancel="onCancel"
  >
    <DTable
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
      if (this.config?.columnListVOS) {
        const oneWorldLength = 14
        const gap = 25
        const tableWholeWidth = 1150
        let columns = this.config.columnListVOS.map(item => {
          const { columnChinsesName: title, columnChinsesName: field } = item
          const width = title.length * oneWorldLength + gap

          return {
            title,
            field,
            width
          }
        })
        const allWorldLength = columns?.reduce((x, y) => x + y.width, 0)

        if (allWorldLength < tableWholeWidth) {
          columns = columns.map(item => {
            delete item.width
            return item
          })
        }

        return columns
      }

      return []
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
      const payload = {
        ...this.config,
        reportId: this.$route.query.id
      }

      this.tableLoading = true
      ChartApiServices.getChartData(payload).then(res => {
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
