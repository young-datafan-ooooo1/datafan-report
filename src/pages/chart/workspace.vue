<!--
 * @Description: 图表工作台
 * @Date: 2022-02-18 16:47:33
 * @LastEditTime: 2022-02-23 19:22:35
-->
<template>
  <div class="workspace flex-box flex-box--column">
    <div class="workspace-title workspace-block flex-box flex-box--center-items flex-box--between-justify flex-box-row-small">
      <div class="block-title">报表分析工具</div>
      <div class="chart-switch-box flex-box">
        <template v-for="item in chartOption">
          <div :key="item.value" @click="onChangeChartType(item.value)">
            {{ item.name }}-
          </div>
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
        className: '#icon-erweibiaoshujuji'
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
        className: '#icon-pivot'
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
        className: '#icon-zhexiantu3'
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
        className: '#icon-zhuzhuangtu'
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
        className: '#icon-bingtu1',
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
        className: '#icon-tiaoxingtu2',
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
        className: '#icon-yuanhuantu'
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
        className: '#icon-BI_tubiaoICON_pubutu_S'
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
        className: '#icon-BI_tubiaoICON_loudoutu_S'
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
