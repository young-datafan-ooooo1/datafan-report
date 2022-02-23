<!--
 * @Description: 图表内容
 * @Date: 2022-02-23 14:41:04
 * @LastEditTime: 2022-02-23 19:42:33
-->
<template>
  <div class="chart-content">
    <a-spin :spinning="chartLoading" class="common-loading">
      <div class="chart-handle flex-box-row-small">
        <div class="handle-box">
          <a-button
            class="search-btn"
            type="primary"
            @click="onSearch"
          >查询</a-button>
          {{ chartInfo.type }}
        </div>
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
          <!-- <template v-for="(metrics, metricsIndex) in chartItem.charact">
            <PivotTable
              :key="metricsIndex"
              :data="chartItem.chartData"
              v-bind="{
                ...chartItem.config
              }"
              :reducer="getReducer(metrics)"
            />
          </template> -->
        </div>
        <div v-else class="chart-view chart">
          <ve-chart
            :colors="themeColors"
            :data="veChartData"
            v-bind="{
              ...chartConfig
            }"
          />
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { eventBus, eventBusType } from '@/utils/event-bus'
import ChartApiServices from '@/services/chart'
// import { PivotTable } from '@click2buy/vue-pivot-table'
export default {
  name: 'ChartContent',

  components: {
    // PivotTable
  },

  inject: ['chartInfo'],

  data() {
    return {
      searchPaylod: {},
      chartData: [],
      chartLoading: false,
      themeColors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c3', '#7f7f7f', '#bdbd22', '#17bdcf']
    }
  },

  computed: {
    chartType() {
      return this.chartInfo.type
    },
    isTwoDimensionalTable() {
      return ['twoDimensionalTable'].includes(this.chartType)
    },
    isMultidimensionalTable() {
      return ['Multidimensional'].includes(this.chartType)
    },
    chartConfig() {
      if (this.isTwoDimensionalTable) {
        const { index: metrics = [], column = [], row = [] } = this.searchPaylod
        const columnList = [...column, ...row, ...metrics]
        const columns = columnList.map(item => {
          const { columnChinsesName: title, name: field } = item

          return {
            title,
            field
          }
        })

        return {
          columns
        }
      } else if (this.isMultidimensionalTable) {
        return {}
      } else {
        const { chartType } = this
        const { index = [], column = [] } = this.searchPaylod
        const metrics = index.map(item => item.name)
        const dimension = column.map(item => item.columnChinsesName)

        return {
          settings: {
            type: chartType,
            metrics: [...metrics],
            dimension: [...dimension]
          }
        }
      }
    },
    veChartData() {
      const { index = [], column = [] } = this.searchPaylod
      const metrics = index.map(item => item.columnChinsesName)
      const dimension = column.map(item => item.columnChinsesName)

      const isWaterfall = ['waterfall'].includes(this.chartType)
      return {
        columns: isWaterfall ? [...metrics, ...dimension] : [...dimension, ...metrics],
        rows: this.chartData
      }
    }
  },

  mounted() {
    eventBus.$on(eventBusType.WORKSPACE_PAYLOAD, this.getWorkSpacePayload)
  },

  beforeDestroy() {
    eventBus.$off(eventBusType.WORKSPACE_PAYLOAD, this.getWorkSpacePayload)
  },

  methods: {
    onSearch() {
      const {
        index: characterListVOS,
        filter: filterListVOS,
        column: columnListVOS,
        row: rowListVOS
      } = this.searchPaylod
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
    getWorkSpacePayload(type, value) {
      this.$set(this.searchPaylod, type, value)
    }
  }
}
</script>

<style lang="less" scoped>
  .chart-content {
    padding: 10px;
    height: 100%;
    .chart-content-chart {
      flex: 1;
      height: 0;
      .chart-view {
        height: 100%;
      }
    }
  }
</style>
