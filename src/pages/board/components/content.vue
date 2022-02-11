<!--
 * @Description: 内容
 * @Date: 2022-01-21 16:27:42
 * @LastEditTime: 2022-02-11 19:16:39
-->
<template>
  <div class="content-container">
    <div class="title flex-box-row">
      <a-icon type="fullscreen" />
      <span class="msg">{{ dashboardInfo.dashboardName || '请输入看板名称' }}</span>
      <a-icon type="fullscreen" />
    </div>
    <Draggable
      class="container flex-box-row"
      :list="contentData"
      :options="{group:'layout', disabled: disabled}"
    >
      <div
        v-for="(item, index) in contentData"
        :key="index"
        class="container-item flex-box-row"
      >
        <div v-if="item.type === 'grid'" class="grid-box flex-box flex-box--center-items flex-box-row">
          <div class="delete-icon">
            <a-icon type="delete" @click="onDelectContent(index)" />
          </div>
          <a-row class="flex-box__flex flex-box-row common-move">
            <template v-for="(gridItem, gridItemIndex) in item.items">
              <a-col :key="gridItemIndex" :span="gridItem.width">
                <!-- 当内容长度为1时，不能再更新 -->
                <Draggable :list="gridItem.chartContent" :options="{ group: { name: 'chart', put: gridItem.chartContent.length === 1 ? false : true }}" class="dashborad-grid--full" @add="getVeChartData(gridItem)">
                  <template v-for="(chartItem, chartIndex) in gridItem.chartContent">
                    <div :key="chartIndex" class="chart-box flex-box flex-box--column">
                      <a-spin :spinning="gridItem.loading">
                        <div class="chart-title flex-box flex-box--between-justify">
                          <div class="title-msg"> {{ chartItem.reportTitle }}</div>
                          <div class="title-handle">
                            <a-icon class="flex-box-col-small" type="sync" @click="onRefresh(gridItem)" />
                            <a-icon class="flex-box-col-small" type="delete" @click="onDelectChart(gridItem)" />
                          </div>
                        </div>
                        <div v-if="chartItem.chartId === 'twoDimensionalTable'">二维</div>
                        <div v-if="chartItem.chartId === 'Multidimensional'">多维</div>
                        <ve-chart v-else :colors="themeColors" :settings="getVeChartSettings(chartItem)" :data="gridItem.chartData" />
                      </a-spin>
                    </div>
                  </template>
                </Draggable>
              </a-col>
            </template>
          </a-row>
        </div>

        <div v-if="item.type === 'border'" class="border-box flex-box flex-box--center-items flex-box-row">
          <div class="delete-icon">
            <a-icon type="delete" @click="onDelectContent(index)" />
          </div>
          <div :class="['border-item', 'common-move', `${item.value}-type`]" />
        </div>

        <div v-if="item.type === 'title'" class="title-box flex-box flex-box--center-items flex-box-row">
          <div class="delete-icon">
            <a-icon type="delete" @click="onDelectContent(index)" />
          </div>
          <div class="title-content">
            <span class="msg flex-box-col-small" :style="getTitleStyle(item)">新标题</span>
            <colorPicker v-model="item.color" class="color flex-box-col-small" />
            <a-input-number v-model="item.fontSize" class="size flex-box-col-small" />
          </div>
        </div>
      </div>
    </Draggable>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import DashboardApiServices from '@/services/dashboard'
import ChartApiServices from '@/services/chart'

export default {
  name: 'Content',

  components: {
    Draggable
  },

  inject: ['dashboardId', 'viewType'],

  props: {
    themeColors: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      loading: false,
      contentData: [],
      dashboardInfo: {},
      disabled: false,
      chartData: []
    }
  },
  computed: {
    isAddDashboard() {
      return !this.dashboardId
    }
  },

  mounted() {
    this.initPage()
  },

  methods: {
    /**
     * @description: 初始化页面
     */
    initPage() {
      this.dashboardId && this.getDashboardDetail()
    },
    /**
     * @description: 获取详情
     */
    getDashboardDetail() {
      const payload = {
        dashboardId: this.dashboardId
      }

      this.loading = true
      DashboardApiServices.getDashboardDetailInfo(payload).then(res => {
        this.dashboardInfo = res.data.content
      }).finally(() => {
        this.loading = false
      })
    },
    /**
     * @description: 删除内容
     * @param {number} index 内容下标
     */
    onDelectContent(index) {
      this.contentData.splice(index, 1)
    },
    /**
     * @description: 标题样式
     * @param {Object} title 标题信息
     * @return {Object} 标题样式
     */
    getTitleStyle(title) {
      const { color, fontSize, fontWeight } = title

      return {
        color,
        fontSize: `${fontSize}px`,
        fontWeight
      }
    },
    /**
     * @description: 刷新图表
     * @param {Object} gridItem 图表信息
     */
    onRefresh(gridItem) {
      this.getChartData(gridItem)
    },
    /**
     * @description: 删除图表
     */
    onDelectChart(gridItem) {
      gridItem.chartContent = []
    },
    /**
     * @description: 获取图标设置
     * @param {Object} chart 图表信息
     * @return {Object} 图表配置信息 type-类型 metrics-指标 dimension-维度
     */
    getVeChartSettings(chart) {
      const { chartId: chartType, charact: [{ columnChinsesName: metrics }], column: [{ columnChinsesName: dimension }] } = chart

      return {
        type: chartType,
        metrics: [metrics],
        dimension: [dimension]
      }
    },
    /**
     * @description: 获取vechart格式的数据
     * @param {Object} gridItem 图表信息
     */
    getVeChartData(gridItem) {
      this.getChartData(gridItem)
    },
    /**
     * @description: 获取表格信息
     * @param {Object} gridItem 图表信息
     */
    getChartData(gridItem) {
      const { chartContent: [chart] } = gridItem

      const payload = this.getChartPaylod(chart)
      const { chartId: chartType, charact: [{ columnChinsesName: metrics }], column: [{ columnChinsesName: dimension }] } = chart

      gridItem.loading = true
      ChartApiServices.getChartDetailInfo(payload).then(response => {
        const { data: { content: [chartData] }} = response
        const { list: rows } = chartData
        // 是不是瀑布图类型
        const isWaterfall = ['waterfall'].includes(chartType)

        gridItem.chartData = {
          // 瀑布图类型与其他不同，需要反转维度和指标 后续完善
          columns: isWaterfall ? [metrics, dimension] : [dimension, metrics],
          rows
        }
      }).finally(() => {
        gridItem.loading = false
      })
    },

    /**
     * @description: 获取图表数据的参数
     * @param {Object} chart 图表信息
     * @return {Object} 参数
     */
    getChartPaylod(chart) {
      const { charact: charater, datasourceId, querySql, row: rowList, column } = chart

      return {
        charater,
        datasourceId,
        querySql,
        rowList,
        column
      }
    }
  }
}
</script>
<style lang="less" scoped>
.content-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
    border-bottom: 1px solid #dcdcdc;
    .msg {
      font-weight: bold;
      font-size: 20px;
    }
  }
  .container {
    overflow: auto;
    flex: 1;
    height: 0;
    .container-item {
      .delete-icon {
        width: 20px;
        color: #869399;
        cursor: pointer;
        & > i {
          display: none;
        }
      }
      &:hover {
        .delete-icon {
          & > i {
            display: flex;
          }
        }
      }
      .grid-box {
        .dashborad-grid--full {
          height: 420px;
          border: dashed #eee;
          border-width: 2px 1px;
          padding: 10px;
          .chart-box {
            height: 100%;
            .chart-title {
              .title-msg {
                font-size: 16px;
                font-weight: bold;
              }
              .title-handle {
                display: none;
              }
            }
            &:hover {
              .title-handle {
                display: flex;
                color: #869399;
              }
            }
          }
        }
      }
      .border-box {
        .border-item {
          margin-top: 10px;
          padding-bottom: 10px;
          width: 100%;
          height: 2px;
          border-width: 2px 0 0;
          border-color: #dcdcdc;
          &.solid-type {
            border-style: solid;
          }
          &.dashed-type {
            border-style: dashed;
          }
          &.dotted-type {
            border-style: dotted;
          }
        }
      }
      .title-box {
        .title-content {
          display: flex;
          align-items: center;
          flex: 1;
          padding: 10px 0;
          border-width: 1px;
          border-style: dashed;
          border-color: transparent;
          .color {
            /deep/.box {
              width: 220px;
              &.open {
                z-index: 1;
              }
            }
          }
          .color,.size {
            display: none;
          }
          &:hover {
            border-color:#dcdcdc;
            .color,.size {
              display: flex;
            }
          }
        }
      }
    }
  }
}
</style>
