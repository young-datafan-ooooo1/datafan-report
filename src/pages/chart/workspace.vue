<!--
 * @Description: 图表工作台
 * @Date: 2022-02-18 16:47:33
 * @LastEditTime: 2022-02-28 14:10:22
-->
<template>
  <div class="workspace flex-box flex-box--column">
    <div class="workspace-title workspace-block flex-box flex-box--center-items flex-box--between-justify flex-box-row-small">
      <div class="block-title">报表分析工具</div>
      <div class="chart-switch-box flex-box">
        <template v-for="item in chartOption">
          <i :key="item.value" :class="['chart-icon', 'flex-box-col-small', `${item.className}_chart`]" @click="onChangeChartType(item.value)" />
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
      chartOption: [{
        id: 0,
        name: '二维表',
        value: 'twoDimensionalTable',
        metrics: 16,
        dimension: 16,
        rowCount: 100,
        rowCountDes: '0个或多个',
        columnCountDes: '0个或多个',
        characterCountDes: '0个或多个',
        disable: false,
        className: 'twoDimensionalTable'
      },
      {
        id: 1,
        name: '透视表',
        value: 'Multidimensional',
        metrics: 16,
        dimension: 100,
        rowCount: 100,
        rowCountDes: '1个或多个',
        columnCountDes: '1个或多个',
        characterCountDes: '1个或多个',
        disable: false,
        className: 'multidimensional'
      },
      {
        id: 2,
        name: '折线图',
        value: 'line',
        metrics: 4,
        dimension: 1,
        rowCount: 1,
        rowCountDes: '1个',
        columnCountDes: '1个',
        characterCountDes: '1个或多个数值',
        disable: false,
        className: 'line'
      }, {
        id: 3,
        name: '柱状图',
        value: 'histogram',
        metrics: 4,
        dimension: 1,
        rowCount: 1,
        rowCountDes: '1个',
        columnCountDes: '1个',
        characterCountDes: '1个或多个数值',
        disable: false,
        className: 'histogram'
      }, {
        id: 4,
        name: '饼图',
        value: 'pie',
        metrics: 1,
        dimension: 1,
        rowCount: 1,
        rowCountDes: '1个',
        columnCountDes: '1个',
        characterCountDes: '1个或多个',
        disable: false,
        className: 'pie',
        selected: {}
      },
      {
        id: 5,
        name: '条形图',
        value: 'bar',
        metrics: 2,
        dimension: 1,
        rowCount: 1,
        rowCountDes: '1个',
        columnCountDes: '1个',
        characterCountDes: '1个或多个',
        disable: false,
        className: 'bar',
        selected: {}
      },
      {
        id: 6,
        name: '环图',
        value: 'ring',
        metrics: 1,
        dimension: 1,
        rowCount: 1,
        rowCountDes: '1个',
        columnCountDes: '1个',
        characterCountDes: '1个或多个',
        disable: false,
        className: 'ring'
      },
      {
        id: 7,
        name: '瀑布图',
        value: 'waterfall',
        metrics: 1,
        dimension: 1,
        rowCount: 0,
        rowCountDes: '0个',
        columnCountDes: '1个',
        characterCountDes: '1个或多个',
        disable: false,
        className: 'waterfall'
      },
      {
        id: 8,
        name: '漏斗图',
        value: 'funnel',
        metrics: 2,
        dimension: 1,
        rowCount: 1,
        rowCountDes: '1个',
        columnCountDes: '1个',
        characterCountDes: '1个或多个',
        disable: false,
        className: 'funnel'
      }
      ]
    }
  },

  created() {
    this.initPage()
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
      })
    },
    onChangeChartType(type) {
      this.chartInfo.type = type
      console.log(type)
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
          &.twoDimensionalTable_chart {
            background-image: url('~@/assets/svg/twoDimensionalTable.svg');
            &.disabled {
              background-image: url('~@/assets/svg/twoDimensionalTable-disabled.svg');
            }
          }
          &.multidimensional_chart {
            background-image: url('~@/assets/svg/multidimensional.svg');
            &.disabled {
              background-image: url('~@/assets/svg/multidimensional-disabled.svg');
            }
          }
          &.line_chart {
            background-image: url('~@/assets/svg/line.svg');
            &.disabled {
              background-image: url('~@/assets/svg/line-disabled.svg');
            }
          }
          &.histogram_chart {
            background-image: url('~@/assets/svg/histogram.svg');
            &.disabled {
              background-image: url('~@/assets/svg/histogram-disabled.svg');
            }
          }
          &.pie_chart {
            background-image: url('~@/assets/svg/pie.svg');
            &.disabled {
              background-image: url('~@/assets/svg/pie-disabled.svg');
            }
          }
          &.bar_chart {
            background-image: url('~@/assets/svg/bar.svg');
            &.disabled {
              background-image: url('~@/assets/svg/bar-disabled.svg');
            }
          }
          &.ring_chart {
            background-image: url('~@/assets/svg/ring.svg');
            &.disabled {
              background-image: url('~@/assets/svg/ring-disabled.svg');
            }
          }
          &.waterfall_chart {
            background-image: url('~@/assets/svg/waterfall.svg');
            &.disabled {
              background-image: url('~@/assets/svg/waterfall-disabled.svg');
            }
          }
          &.funnel_chart {
            background-image: url('~@/assets/svg/funnel.svg');
            &.disabled {
              background-image: url('~@/assets/svg/funnel-disabled.svg');
            }
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
