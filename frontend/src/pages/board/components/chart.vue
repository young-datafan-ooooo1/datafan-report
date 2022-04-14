<!--
 * @Description: 图表
 * @Date: 2022-01-21 15:00:14
 -->
<template>
  <div class="dashborad-chart">
    <a-spin :spinning="loading" class="common-spin">
      <div class="chart-content">
        <a-input v-model="search" class="flex-box-row" allow-clear placeholder="请输入图表名称" />
        <Draggable class="chart-list flex-box-row" :list="effectChartList" :options="draggableOption">
          <template v-for="chart in effectChartList">
            <div :key="chart.reportId" class="chart-item flex-box-row-small common-move">
              <span class="title">{{ chart.reportTitle }}</span>
              <div class="flex-box flex-box--center-items">
                <div class="item-label flex-box-col-small">创建人:</div>
                <div class="msg flex-box-col-small">{{ chart.createUser }}</div>
              </div>
              <div class="flex-box flex-box--center-items">
                <div class="item-label flex-box-col-small">创建时间:</div>
                <div class="msg flex-box-col-small">{{ chart.createTime }}</div>
              </div>
              <div class="flex-box flex-box--center-items">
                <div class="item-label flex-box-col-small">图表类型:</div>
                <div class="msg flex-box-col-small">{{ chart.chartName }}</div>
              </div>
            </div>
          </template>
        </Draggable>
      </div>
    </a-spin>
  </div>
</template>
<script>
import Draggable from 'vuedraggable'
import ChartApiServices from '@/services/chart'

export default {
  name: 'Chart',

  components: {
    Draggable
  },

  data() {
    return {
      // 拖拽配置
      draggableOption: {
        group: { name: 'chart', pull: 'clone', put: false },
        filter: '.undraggable',
        sort: false
      },
      // 搜索内容
      search: '',
      loading: false,
      // 图表
      chartList: []
    }
  },

  computed: {
    // 生效的图表类表
    effectChartList() {
      return this.chartList.filter(chart => chart.reportTitle.includes(this.search))
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
      this.getChartList()
    },
    /**
     * @description: 获取图表列表
     */
    getChartList() {
      this.loading = true

      ChartApiServices.getChartInfo().then(res => {
        this.chartList = res.data.content || []
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.dashborad-chart {
  padding: 0 10px;
  height: 100%;
  /deep/.ant-spin-container {
    height: 100%;
  }
  .chart-content {
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
    height: 100%;
    .chart-list {
      overflow: auto;
      flex: 1;
      height: 0;
      .chart-item {
        padding: 10px 10px;
        border: 1px solid #cfd8dc;
        border-radius: 4px;
        .title {
          font-weight: bold;
        }
        .item-label {
          font-size: 12px;
        }
        .msg {
          color: #2c3e50;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
