<!--
 * @Description: 内容
 * @Date: 2022-01-21 16:27:42
 -->
<template>
  <div :class="['content-container' , {full: isFull}]">
    <div class="title flex-box-row">
      <a-icon type="fullscreen" @click="toggleFull" />
      <ModifyInput ref="dashboardTitle" v-model="dashboardInfo.dashboardName" class="msg" placeholder="标题" @on-change="onModifyDashboardName" />
      <div class="content-handle">
        <a-button
          type="primary"
          ghost
          shape="round"
          @click="onSaveDashboard"
        >保存</a-button>
        <a-button
          type="primary"
          ghost
          shape="round"
          @click="onExportPdf"
        >导出pdf</a-button>
      </div>
    </div>
    <Draggable
      v-model="contentData"
      class="container flex-box-row"
      :options="{group:'layout', disabled: false}"
    >
      <div
        v-for="(contentItem, contentIndex) in contentData"
        :key="contentIndex"
        class="container-item flex-box-row"
      >
        <div v-if="contentItem.type === 'grid'" class="grid-box flex-box flex-box--center-items flex-box-row">
          <div class="delete-icon">
            <a-icon type="delete" @click="onDelectContent(contentIndex)" />
          </div>
          <a-row class="flex-box__flex flex-box-row common-move">
            <template v-for="gridItem in contentItem.items">
              <a-col :key="gridItem.id" :span="gridItem.width">
                <!-- 当内容长度为1时，不能再更新 -->
                <Draggable
                  :list="gridItem.chartContent"
                  :options="{ group: { name: 'chart', put: gridItem.chartContent.length === 1 ? false : true }}"
                  class="dashborad-grid--full"
                  @add="drawChart(gridItem)"
                >
                  <template v-for="chartItem in gridItem.chartContent">
                    <div :key="chartItem.reportId" class="chart-box flex-box flex-box--column">
                      <a-spin :spinning="gridItem.loading" class="common-loading">
                        <div class="chart-title flex-box flex-box--between-justify">
                          <div class="title-msg"> {{ chartItem.reportTitle }}</div>
                          <div class="title-handle">
                            <a-icon class="flex-box-col-small" type="sync" @click="onRefresh(gridItem)" />
                            <a-icon class="flex-box-col-small" type="delete" @click="onDelectChart(gridItem)" />
                          </div>
                        </div>
                        <div v-if="chartItem.chartId === 'twoDimensionalTable'" class="chart-view gride-table">
                          <DTable
                            class="flex-box-row"
                            v-bind="{
                              ...chartItem.config
                            }"
                            :data="chartItem.chartData"
                            border
                            size="small"
                            hide-pager
                            height="auto"
                          />
                        </div>
                        <div v-else-if="chartItem.chartId === 'Multidimensional'" class="chart-view multi-table pivot-table-contain">
                          <template v-for="(metrics, metricsIndex) in chartItem.charact">
                            <PivotTable
                              :key="metricsIndex"
                              :data="chartItem.chartData"
                              v-bind="{
                                ...chartItem.config
                              }"
                              :reducer="getReducer(metrics)"
                            />
                          </template>
                        </div>
                        <div v-else class="chart-view chart">
                          <ve-chart
                            :colors="themeColors"
                            :data="chartItem.chartData"
                            v-bind="{
                              ...chartItem.config
                            }"
                          />
                        </div>
                      </a-spin>
                    </div>
                  </template>
                </Draggable>
              </a-col>
            </template>
          </a-row>
        </div>

        <div v-if="contentItem.type === 'border'" class="border-box flex-box flex-box--center-items flex-box-row">
          <div class="delete-icon">
            <a-icon type="delete" @click="onDelectContent(contentIndex)" />
          </div>
          <div :class="['border-item', 'common-move', `${contentItem.value}-type`]" />
        </div>

        <div v-if="contentItem.type === 'title'" class="title-box flex-box flex-box--center-items flex-box-row">
          <div class="delete-icon">
            <a-icon type="delete" @click="onDelectContent(contentIndex)" />
          </div>
          <div class="title-content">
            <ModifyInput
              v-if="contentItem.name"
              v-model="contentItem.name"
              class="msg flex-box-col-small"
              :style="getTitleStyle(contentItem)"
              @on-change="onChangeTitle($event, contentItem)"
            />
            <colorPicker v-model="contentItem.color" class="color flex-box-col-small" />
            <a-input-number v-model="contentItem.fontSize" class="size flex-box-col-small" />
          </div>
        </div>
      </div>
    </Draggable>
  </div>
</template>

<script>
import { ModifyInput } from '@/components/common'
import Draggable from 'vuedraggable'
import DashboardApiServices from '@/services/dashboard'
import ChartApiServices from '@/services/chart'
import { PivotTable } from '@click2buy/vue-pivot-table'
import exportPdf from '@/utils/export-pdf'

export default {
  name: 'Content',

  components: {
    Draggable,
    PivotTable,
    ModifyInput
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
      dashboardInfo: {
        dashboardName: undefined
      },
      isFull: this.$route.query.viewType === 'read'
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
     * @description: 切换全屏
     */
    toggleFull() {
      this.isFull = !this.isFull
      // 手动触发resize，为了让图表自适应
      window.dispatchEvent(new Event('resize'))
    },
    /**
     * @description: 导出pdf
     */
    onExportPdf() {
      exportPdf('.content-container', this.dashboardInfo.dashboardName)
    },
    /**
     * @description: 修改标题
     * @param {string} value 组件传出的东西
     * @param {Object} item 修改的标题项
     */
    onChangeTitle(value, item) {
      item.name = value
    },
    /**
     * @description: 修改看板名称
     * @param {string} value 值
     */
    onModifyDashboardName(value) {
      this.dashboardInfo.dashboardName = value
    },
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
        this.contentData = JSON.parse(res.data.content.queryData)

        this.$nextTick(() => {
          if (this.contentData.length) {
            this.contentData.forEach(item => {
              if (item.type === 'grid') {
                item.items.forEach(gridItem => {
                  if (gridItem.chartContent.length) {
                    this.drawChart(gridItem)
                  }
                })
              }
            })
          }
        })
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
     * @description: 画图
     * @param {Object} gridItem grid信息
     */
    drawChart(gridItem) {
      // 一个grid只有一个图表
      const { chartContent: [chart] } = gridItem

      this.getChartConfig(chart)
      this.getChartData(gridItem)
    },
    /**
     * @description: 获取图表配置
     * @param {Object} chart 图表信息
     */
    getChartConfig(chart) {
      const { chartId: chartType } = chart
      const getChartConfigOption = {
        'twoDimensionalTable': this.getTwoDimensionalTableConfig,
        'Multidimensional': this.getMultiDimensionalTableConfig
      }

      if (getChartConfigOption[chartType]) {
        getChartConfigOption[chartType](chart)
      } else {
        this.getVeChartConfig(chart)
      }
    },
    /**
     * @description: 获取二维表格配置
     * @param {Object} chart 表格信息
     */
    getTwoDimensionalTableConfig(chart) {
      const { charact: metrics = [], column = [], row = [] } = chart
      const columnList = [... metrics, ...column, ...row]
      const columns = columnList.map(item => {
        const { columnChinsesName: title, columnChinsesName: field } = item

        return {
          title,
          field
        }
      })

      chart.config = { columns }
    },
    /**
     * @description: 获取多维表格配置
     * @param {Object} chart 表格信息
     */
    getMultiDimensionalTableConfig(chart) {
      const { row = [], column = [] } = chart
      const rowFields = row.map(item => {
        const { columnChinsesName: label } = item
        return {
          label,
          getter: item => item[label]
        }
      })
      const colFields = column.map(item => {
        const { columnChinsesName: label } = item
        return {
          label,
          getter: item => item[label]
        }
      })

      chart.config = { rowFields, colFields }
    },
    /**
     * @description: 获取vechart配置
     * @param {Object} chart 表格信息
     */
    getVeChartConfig(chart) {
      const { chartId: chartType, charact = [], column = [], row = [] } = chart
      const metrics = charact.map(item => item.columnChinsesName)
      const dimension = [...column, ...row].map(item => item.columnChinsesName)

      chart.config = {
        settings: {
          type: chartType,
          metrics: [...metrics],
          dimension: [...dimension]
        }
      }
    },
    /**
     * @description: 获取表格信息
     * @param {Object} gridItem 图表信息
     */
    getChartData(gridItem) {
      const { chartContent: [chart] } = gridItem
      const payload = this.getChartPaylod(chart)

      gridItem.loading = true
      ChartApiServices.getChartDetailInfo(payload).then(response => {
        const { data: { content: chartData }} = response
        const rows = chartData.map(item => item.list).flat()
        this.formatChartData(chart, rows)
      }).finally(() => {
        gridItem.loading = false
      })
    },
    /**
     * @description: 根据不同情况整合不同图表数据
     * @param {Object} chart 图表信息
     * @param {array} data 后端返回数据
     */
    formatChartData(chart, data) {
      const { chartId: chartType, charact = [], column = [], row = [] } = chart
      const metrics = charact.map(item => item.columnChinsesName)
      const dimension = [...row, ...column].map(item => item.columnChinsesName)
      const isTable = ['twoDimensionalTable', 'Multidimensional'].includes(chartType)
      const isWaterfall = ['waterfall'].includes(chartType)

      if (isTable) {
        chart.chartData = data
      } else {
        chart.chartData = {
          // 瀑布图类型与其他不同，需要反转维度和指标 后续完善
          columns: isWaterfall ? [...metrics, ...dimension] : [...dimension, ...metrics],
          rows: data
        }
      }
    },
    /**
     * @description: 获取图表数据的参数
     * @param {Object} chart 图表信息
     * @return {Object} 参数
     */
    getChartPaylod(chart) {
      const { charact: charater, datasourceId, querySql, row: rowList = [], column = [] } = chart

      return {
        charater,
        datasourceId,
        querySql,
        rowList,
        column
      }
    },
    getReducer(metrics) {
      return (sum, items) => items[metrics.columnChinsesName]
    },
    /**
     * @description: 保存
     */
    onSaveDashboard() {
      const payload = this.getDashboardDetailPayload()
      // 新增
      if (this.isAddDashboard) {
        if (!payload.dashboardName) {
          this.$message.warn('请输入看板名称')

          return
        }
        this.loading = true
        DashboardApiServices.saveDashboard(payload).then(res => {
          this.$message.success('新增成功')
          const { data: { content: { dashboardId }}} = res
          this.$router.push({ path: '/board/dashboard', query: { dashboardId, viewType: 'edit' }})
          setTimeout(() => {
            location.reload()
          }, 100)
        }).catch(() => {
          this.$message.error('新增失败')
        }).finally(() => {
          this.loading = false
        })
      } else {
        // 修改
        this.loading = true
        DashboardApiServices.updateDashboard(payload).then(res => {
          this.$message.success('修改成功')
        }).catch(() => {
          this.$message.error('修改失败')
        }).finally(() => {
          this.loading = false
        })
      }
    },
    /**
     * @description: 获取看板参数
     * @return {Object} 看板参数
     */
    getDashboardDetailPayload() {
      const { dashboardId, contentData } = this
      const { dashboardName } = this.dashboardInfo
      const queryData = JSON.stringify(contentData)

      return {
        dashboardId,
        dashboardName,
        queryData
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import '../css/bootstrap.css';
.content-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  &.full {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
  }
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
    .content-handle {
      & > button {
        padding-right: 10px;
        padding-left: 10px;
        min-width: 70px;
        height: 26px;
        border-radius: 32px;
        font-size: 13px;
        line-height: 1 !important;
      }
      button + button {
        margin-left: 10px;
      }
    }
  }
  .container {
    overflow: auto;
    overflow-x: hidden;
    flex: 1;
    width: 100%;
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
          padding: 10px;
          height: 420px;
          border: dashed #eee;
          border-width: 2px 1px;
          .chart-box {
            height: 100%;
            .chart-title {
              height: 30px;
              .title-msg {
                font-weight: bold;
                font-size: 16px;
              }
              .title-handle {
                display: none;
              }
            }
            .chart-view {
              flex: 1;
              height: 0;
              &.pivot-table-contain {
                /*overflow-y: scroll;*/
                overflow: auto;
                /*padding: 70px 52px 0px 52px;*/
                font-size: 12px;
                .position-relative + .position-relative {
                  margin-top: 10px;
                }
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
          min-height: 40px;
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
