<!--
 * @Description: chart
 * @Date: 2022-01-18 15:16:24
 * @LastEditTime: 2022-02-18 15:00:49
-->
<template>
  <div class="chart page-container">
    <s-page-handle>
      <div slot="filters">
        <s-page-handle-item>
          <a-input v-model="filter.name" allow-clear placeholder="请输入图表名称" />
        </s-page-handle-item>
        <s-page-handle-item>
          <a-select v-model="filter.type" allow-clear placeholder="请选择图表类型">
            <a-select-option
              v-for="item in chartTypeOption"
              :key="item.value"
              :value="item.value"
            >{{ item.name }}</a-select-option>
          </a-select>
        </s-page-handle-item>
        <s-page-handle-item>
          <a-button
            class="search-btn"
            type="primary"
            @click="onGetChartData()"
          >查询</a-button>
        </s-page-handle-item>
      </div>
    </s-page-handle>

    <div class="table-container">
      <SenseTable
        :columns="columns"
        :data="tableData"
        :pager-config="pagerConfig"
        :loading="tableLoading"
        height="auto"
        @page-change="changePage"
      >
        <template #action="{ row }">
          <a-tooltip title="编辑">
            <a-icon
              class="icon-btn"
              type="edit"
              @click="onEditBoard(row)"
            />
          </a-tooltip>
          <a-tooltip title="删除">
            <a-icon
              class="icon-btn"
              type="delete"
              @click="onDeleteChart(row)"
            />
          </a-tooltip>
        </template>
      </SenseTable>
    </div>
  </div>
</template>

<script>
import ChartApiServices from '@/services/chart'

export default {
  name: 'Chart',

  data() {
    return {
      filter: {
        name: undefined,
        type: undefined
      },
      chartTypeOption: [
        { name: '二维表', value: 'twoDimensionalTable' },
        { name: '多维表', value: 'Multidimensional' },
        { name: '折线图', value: 'line' },
        { name: '柱状图', value: 'histogram' },
        { name: '饼图', value: 'pie' },
        { name: '条形图', value: 'bar' },
        { name: '环图', value: 'ring' },
        { name: '瀑布图', value: 'waterfall' },
        { name: '漏斗图', value: 'funnel' }
      ],
      columns: [
        {
          title: '图表名称',
          field: 'reportTittle'
        },
        {
          title: '图表类型',
          field: 'chartName'
        },
        {
          title: '创建人',
          field: 'createUserId'
        },
        {
          title: '创建时间',
          field: 'createTime'
        },
        {
          width: 180,
          title: '操作',
          fixed: 'right',
          align: 'center',
          slots: { default: 'action' }
        }
      ],
      pagerConfig: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      tableLoading: false,
      tableData: []
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
      this.onGetChartData()
    },
    /**
     * @description: 获取图表数据
     */
    onGetChartData() {
      const payload = this.getPayload()

      this.tableLoading = true
      ChartApiServices.getChartList(payload).then(res => {
        this.tableData = res.data.content.list
        this.pagerConfig.total = res.data.content.total
      }).finally(() => {
        this.tableLoading = false
      })
    },
    /**
     * @description: 获取配置
     * @return {Object} 配置信息
     */
    getPayload() {
      const { type: chartType, name: reportTittle } = this.filter
      const { pageSize: rows, currentPage: pageSize } = this.pagerConfig

      return {
        chartType,
        reportTittle,
        rows,
        pageSize
      }
    },
    /**
     * @description: 切换分页
     * @param {Object} page 分页对象
     */
    changePage(page) {
      this.pagerConfig.currentPage = page.currentPage
      this.pagerConfig.pageSize = page.pageSize
      this.onGetChartData()
    },
    onEditBoard() {},
    /**
     * @description: 删除图表
     * @param {Objcet} row 删除的行
     */
    onDeleteChart(row) {
      const { reportId: id, reportTittle: name } = row

      this.$confirm({
        title: '删除提示',
        content: `是否删除 “${name}” ?`,
        okText: '确认',
        onOk: () => {
          return ChartApiServices.deleteChart(id).then(res => {
            if (res.data.content === true) {
              this.$message.success('删除成功')
              this.onGetChartData()
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .chart {
    padding: 0;
  }
</style>
