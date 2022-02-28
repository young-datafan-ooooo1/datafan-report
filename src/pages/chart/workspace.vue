<!--
 * @Description: 图表工作台
 * @Date: 2022-02-18 16:47:33
 * @LastEditTime: 2022-02-28 18:30:22
-->
<template>
  <div class="workspace flex-box flex-box--column">
    <div class="workspace-title workspace-block flex-box flex-box--center-items flex-box--between-justify flex-box-row-small">
      <div class="block-title">报表分析工具</div>
      <div class="chart-switch-box flex-box">
        <template v-for="item in chartOption">
          <i
            :key="item.value"
            :class="[
              'chart-icon',
              'flex-box-col-small',
              `${item.className}_chart`,
              { disabled: disabledList.includes(item.value) },
              { actived: chartInfo.type === item.value }
            ]"
            @click="onChangeChartType(item.value)"
          />
        </template>
      </div>
    </div>
    <div class="workspace-content flex-box flex-box-row-small">
      <DataView class="workspace-content-data workspace-block flex-box-col-small" />
      <FilterView class="workspace-content-filter workspace-block flex-box-col-small" />
      <ChartView class="workspace-content-chart flex-box-col-small" />
    </div>
  </div>
</template>

<script>
import {
  DataView,
  FilterView,
  ChartView
} from './components'
import ChartApiServices from '@/services/chart'
import { eventBus, eventBusType } from '@/utils/event-bus'
import { CHART_OPTION } from './workspace.data'

export default {
  name: 'Workspace',

  components: {
    DataView,
    FilterView,
    ChartView
  },

  provide() {
    return {
      chartInfo: this.chartInfo
    }
  },

  data() {
    return {
      chartInfo: {
        data: {},
        type: ''
      },
      chartConfig: {
        index: [],
        column: [],
        row: []
      },
      chartOption: CHART_OPTION
    }
  },
  computed: {
    // 指标个数
    metricsNumber() {
      return this.chartConfig?.index?.length || 0
    },
    // 维度个数
    dimensionNumber() {
      return [...this?.chartConfig?.column, ...this?.chartConfig?.row]?.length || 0
    },
    // 禁用列表
    disabledList() {
      const list = []

      if (this.metricsNumber || this.dimensionNumber) {
        this?.chartOption.forEach(item => {
          if (this?.metricsNumber > item.metrics || this?.dimensionNumber > item.dimension) {
            list.push(item.value)
          }
        })
      }

      return list
    }
  },

  created() {
    this.initPage()
  },

  mounted() {
    // 挂载eventbus
    eventBus.$on(eventBusType.WORKSPACE_PAYLOAD, this.getWorkSpacePayload)
  },

  beforeDestroy() {
    // 卸载eventbus
    eventBus.$off(eventBusType.WORKSPACE_PAYLOAD, this.getWorkSpacePayload)
  },

  methods: {
    /**
     * @description: 初始化页面
     */
    initPage() {
      this.getChartDetail()
    },
    /**
     * @description: 获取图表数据
     */
    getChartDetail() {
      const payload = {
        reportId: this.$route.query.id
      }

      ChartApiServices.getChartDetail(payload).then(res => {
        this.chartInfo.data = res.data.content
        this.chartInfo.type = res.data.content.chartId

        setTimeout(() => {
          eventBus.$emit(eventBusType.WORKSPACE_CHANGE_CHART_TYPE)
        }, 0)
      })
    },
    /**
     * @description: 修改图表类型
     * @param {sting} type 图表类型
     */
    onChangeChartType(type) {
      this.chartInfo.type = type
      // 修改类型时，触发其他组件查询事件
      eventBus.$emit(eventBusType.WORKSPACE_CHANGE_CHART_TYPE)
    },

    /**
     * @description: 修改配置
     * @param {string} type 类型
     * @param {Object} value 值
     */
    getWorkSpacePayload(type, value) {
      this.$set(this.chartConfig, type, value)
    }
  }
}
</script>

<style lang='less' scoped>
  .workspace {
    padding: 0;
    height: 100%;
    &-title {
      padding: 0 10px;
      height: 40px;
      border-bottom: 1px solid #E9E9E9;
      .chart-switch-box {
        .chart-icon {
          width: 20px;
          height: 20px;
          background-size: 100% 100%;
          cursor: pointer;
          &.disabled {
            filter: grayscale(100%);
          }
          &.twoDimensionalTable_chart {
            background-image: url('~@/assets/svg/twoDimensionalTable.svg');
          }
          &.multidimensional_chart {
            background-image: url('~@/assets/svg/multidimensional.svg');
          }
          &.line_chart {
            background-image: url('~@/assets/svg/line.svg');
          }
          &.histogram_chart {
            background-image: url('~@/assets/svg/histogram.svg');
          }
          &.pie_chart {
            background-image: url('~@/assets/svg/pie.svg');
          }
          &.bar_chart {
            background-image: url('~@/assets/svg/bar.svg');
          }
          &.ring_chart {
            background-image: url('~@/assets/svg/ring.svg');
          }
          &.waterfall_chart {
            background-image: url('~@/assets/svg/waterfall.svg');
          }
          &.funnel_chart {
            background-image: url('~@/assets/svg/funnel.svg');
          }
        }
      }
    }
    &-content {
      flex: 1;
      height: 0;
      &-data, &-filter {
        width: 260px;
      }
      &-chart {
        flex: 1;
        width: 0;
      }
    }

    &-block {
      border-radius: 6px;
      background-color: #fff;
      box-shadow: 0 23px 44px 0 rgb(176 183 195 / 14%);
    }
  }
</style>
