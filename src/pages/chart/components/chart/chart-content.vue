<!--
 * @Description: 图表内容
 * @Date: 2022-02-23 14:41:04
 * @LastEditTime: 2022-03-01 16:44:26
-->
<template>
  <div class="chart-content">
    <a-spin :spinning="chartLoading" class="common-loading">
      <div class="chart-handle flex-box flex-box--between-justify flex-box--center-items flex-box-row-small">
        <div class="handle-box">
          <a-button
            class="search-btn flex-box-col"
            type="primary"
            :disabled="isDisabledSearch"
            @click="onSearch"
          >查询</a-button>
          <a-button
            class="search-btn flex-box-col"
            type="primary"
            :disabled="isDisabledSearch"
            @click="onSave"
          >保存</a-button>
        </div>
        <ModifyInput
          v-model="reportInfo.reportTittle"
          @on-change="onModifyReportName"
        />
        <a-icon type="download" />
      </div>
      <div class="chart-content-chart flex-box-row-small">
        <SenseTable
          v-if="isTwoDimensionalTable"
          v-bind="{
            ...chartConfig
          }"
          :data="chartData"
          border
          size="small"
          hide-pager
          height="auto"
        />
        <div v-else-if="chartType === 'Multidimensional'" class="chart-view multi-table pivot-table-contain">
          <template v-for="(metrics, metricsIndex) in metricsList">
            <PivotTable
              :key="metricsIndex"
              :data="chartData"
              v-bind="{
                ...chartConfig
              }"
              :reducer="getReducer(metrics)"
            />
          </template>
        </div>
        <div v-else class="chart-view chart">
          <ve-chart
            :colors="themeColors"
            :data="veChartData"
            v-bind="{
              ...chartConfig
            }"
            height="100%"
          />
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { eventBus, eventBusType } from '@/utils/event-bus'
import ChartApiServices from '@/services/chart'
import { PivotTable } from '@click2buy/vue-pivot-table'
import { CHART_OPTION } from '../../workspace.data'
import { ModifyInput } from '@/components/common'

export default {
  name: 'ChartContent',

  components: {
    PivotTable,
    ModifyInput
  },

  inject: ['chartInfo'],

  data() {
    return {
      workspacePayload: {},
      chartData: [],
      chartLoading: false,
      // 默认配色
      themeColors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c3', '#7f7f7f', '#bdbd22', '#17bdcf'],
      chartOption: CHART_OPTION,
      chartConfig: {},
      reportInfo: ''
    }
  },

  computed: {
    // 图表类型
    chartType() {
      return this.chartInfo.type
    },
    // 是不是二维表格
    isTwoDimensionalTable() {
      return ['twoDimensionalTable'].includes(this.chartType)
    },
    // 是不是多维表格
    isMultidimensionalTable() {
      return ['Multidimensional'].includes(this.chartType)
    },
    // vechart图表数据
    veChartData() {
      const { index = [], column = [] } = this.workspacePayload
      const metrics = index.map(item => item.name)
      const dimension = column.map(item => item.columnChinsesName)

      const isWaterfall = ['waterfall'].includes(this.chartType)
      return {
        columns: isWaterfall ? [...metrics, ...dimension] : [...dimension, ...metrics],
        rows: this.chartData
      }
    },
    metricsList() {
      const { index = [] } = this.workspacePayload

      return index
    },
    metricsNumber() {
      return this.metricsList.length || 0
    },
    // 维度个数
    dimensionNumber() {
      const { column = [], row = [] } = this.workspacePayload

      return [...column, ...row]?.length || 0
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
    },
    // 是否禁用查询 -- 查询列表中有当前的图表类型
    isDisabledSearch() {
      return this.disabledList.includes(this.chartType)
    }
  },
  watch: {
    'chartInfo.data'(value) {
      this.reportInfo = value
    }
  },
  mounted() {
    // 挂载eventbus
    eventBus.$on(eventBusType.WORKSPACE_PAYLOAD, this.getWorkSpacePayload)
    eventBus.$on(eventBusType.WORKSPACE_THEME, this.getWorkspaceTheme)
    eventBus.$on(eventBusType.WORKSPACE_CHANGE_CHART_TYPE, this.onSearch)
  },

  beforeDestroy() {
    // 卸载eventbus
    eventBus.$off(eventBusType.WORKSPACE_PAYLOAD, this.getWorkSpacePayload)
    eventBus.$off(eventBusType.WORKSPACE_THEME, this.getWorkspaceTheme)
    eventBus.$off(eventBusType.WORKSPACE_CHANGE_CHART_TYPE, this.onSearch)
  },

  methods: {
    /**
     * @description: 查询表格数据
     */
    onSearch() {
      this.onFormatChartConfig()
      window.dispatchEvent(new Event('resize'))

      const {
        index: characterListVOS = [],
        filter: filterListVOS = [],
        column: columnListVOS = [],
        row: rowListVOS = []
      } = this.workspacePayload
      const { datasourceDTO, reportTable } = this.chartInfo.data
      const payload = {
        limits: 200,
        characterListVOS,
        filterListVOS,
        columnListVOS,
        rowListVOS,
        datasourceVO: {
          ...datasourceDTO,
          tableName: reportTable
        }
      }

      this.chartLoading = true
      ChartApiServices.getChartData(payload).then(res => {
        this.chartData = res.data.content.groupByRowNames.map(item => item.list).flat()
      }).finally(() => {
        this.chartLoading = false
      })
    },
    /**
     * @description: 修改配置
     * @param {string} type 类型
     * @param {Object} value 值
     */
    getWorkSpacePayload(type, value) {
      this.$set(this.workspacePayload, type, value)
    },
    /**
     * @description: 修改颜色列表
     * @param {array} colorList 颜色列表
     */
    getWorkspaceTheme(colorList) {
      this.themeColors = colorList
    },
    /**
     * @description: 整合不同类型图表的配置
     */
    onFormatChartConfig() {
      if (this.isTwoDimensionalTable) {
        const { index: metrics = [], column = [], row = [] } = this.workspacePayload
        const columnList = [...column, ...row, ...metrics]
        const columns = columnList.map(item => {
          const { columnChinsesName: title, name: field } = item

          return {
            title,
            field
          }
        })

        this.chartConfig = {
          columns
        }
      } else if (this.isMultidimensionalTable) {
        const { row, column } = this.workspacePayload
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

        this.chartConfig = { rowFields, colFields }
      } else {
        const { chartType } = this
        const { index = [], column = [] } = this.workspacePayload
        const metrics = index.map(item => item.name)
        const dimension = column.map(item => item.columnChinsesName)

        this.chartConfig = {
          settings: {
            type: chartType,
            metrics: [...metrics],
            dimension: [...dimension]
          }
        }
      }
    },
    /**
     * @description: 多维表配置
     */
    getReducer(metrics) {
      return (sum, items) => items[metrics.columnChinsesName]
    },

    /**
     * @description: 修改看板名称
     * @param {string} value 值
     */
    onModifyReportName(value) {
      this.reportInfo.reportTittle = value
    },
    onSave() {
      if (!this.reportInfo.reportTittle) {
        this.$message.warn('请输入名称')

        return
      }
      if (this.reportInfo.reportId) {
        this.$confirm({
          title: '提示',
          content: `是否覆盖之前信息 ?`,
          okText: '确认',
          onOk: () => {
            const payload = this.getSavePayload()

            return ChartApiServices.saveReports(payload).then(res => {
              this.$message.success('保存成功')
            }).catch(() => {
              this.$message.error('保存失败')
            })
          }
        })
      } else {
        const payload = this.getSavePayload()

        ChartApiServices.saveReports(payload).then(res => {
          this.$message.success('保存成功')
        }).catch(() => {
          this.$message.error('保存失败')
        })
      }
    },
    getSavePayload() {
      const {
        index: characts = [],
        column: columnListVO = [],
        filter: filterListVO = [],
        row: rowListVO = []
      } = this.workspacePayload
      const {
        chartId,
        datasourceDTO: { datasourceId },
        querySql,
        reportId,
        stepName,
        stepProjectId,
        reportTable: tableName,
        reportTittle: tittle,
        dimensionList,
        mertricList
      } = this.reportInfo
      const dataObj = {
        characts,
        columnListVO,
        filterListVO,
        rowListVO
      }
      const dataJson = JSON.stringify(dataObj)

      return {
        characts,
        columnListVO,
        filterListVO,
        rowListVO,
        dimensionList,
        mertricList,
        reportVO: {
          chartId,
          dataJson,
          datasourceId,
          querySql,
          reportId,
          stepName,
          stepProjectId,
          tableName,
          tittle
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../css/bootstrap.css';
  .chart-content {
    padding: 10px;
    height: 100%;
    .chart-content-chart {
      flex: 1;
      height: 0;
      .chart-view {
        height: 100%;
        border: 1px solid #e9e9e9;
        border-radius: 6px;
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
    }
  }
</style>
