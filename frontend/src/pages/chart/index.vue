<!--
 * @Description: chart
 * @Date: 2022-01-18 15:16:24
 -->
<template>
  <div class="chart page-container">
    <DPageTitle title="图表管理" />
    <DPageHandle>
      <div slot="filters">
        <DPageHandleItem>
          <a-input v-model="filter.reportTittle" allow-clear placeholder="请输入图表名称" />
        </DPageHandleItem>
        <DPageHandleItem>
          <a-select v-model="filter.chartType" allow-clear placeholder="请选择图表类型">
            <a-select-option
              v-for="item in chartTypeOption"
              :key="item.value"
              :value="item.value"
            >{{ item.name }}</a-select-option>
          </a-select>
        </DPageHandleItem>
        <DPageHandleItem>
          <DFiltersPopover>
            <DFiltersPopoverItem label="来源平台">
              <DDictSelect
                v-model="filter.sourcePlatform"
                placeholder="请选择来源平台"
                dict-type="REPORTSOURCEPLATFORM"
              />
            </DFiltersPopoverItem>
            <DFiltersPopoverItem label="来源项目">
              <a-input v-model="filter.sourceProjectName" placeholder="来源项目" />
            </DFiltersPopoverItem>
            <DFiltersPopoverItem label="所属用户">
              <a-input v-model="filter.sourceCreateUser" placeholder="来源项目所属用户" />
            </DFiltersPopoverItem>
            <DFiltersPopoverItem label="创建时间">
              <a-range-picker
                v-model="filter.timeRange"
                allow-clear
                format="YYYY-MM-DD"
                :placeholder="['创建开始时间', '创建结束时间']"
              />
            </DFiltersPopoverItem>
            <template slot="footer">
              <a-button ghost type="primary" @click="onResetFilter">
                重置
              </a-button>
            </template>
          </DFiltersPopover>
        </DPageHandleItem>
        <DPageHandleItem>
          <a-button
            class="search-btn"
            type="primary"
            @click="onGetChartData()"
          >查询</a-button>
        </DPageHandleItem>
      </div>
      <div slot="actions">
        <DPageHandleItem>
          <a-button type="primary" ghost :disabled="!hasChecked" @click="onBatchDelete">
            批量删除
          </a-button>
        </DPageHandleItem>
      </div>
    </DPageHandle>

    <div class="table-container">
      <DTable
        :columns="columns"
        :data="tableData"
        :pager-config="pagerConfig"
        :loading="tableLoading"
        height="auto"
        @page-change="changePage"
        @checkbox-all="onTableSelect"
        @checkbox-change="onTableSelect"
      >
        <template #action="{ row }">
          <a-tooltip title="编辑">
            <a-icon
              class="icon-btn"
              type="edit"
              @click="onEditChart(row)"
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
      </DTable>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import ChartApiServices from '@/services/chart'

export default {
  name: 'Chart',

  data() {
    return {
      filter: {
        reportTittle: undefined,
        chartType: undefined,
        sourcePlatform: undefined,
        sourceProjectName: undefined,
        sourceCreateUser: undefined,
        timeRange: []
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
          type: 'checkbox',
          width: 60,
          fixed: 'left'
        },
        {
          title: '图表名称',
          minWidth: 220,
          field: 'reportTittle'
        },
        {
          title: '图表类型',
          width: 100,
          field: 'chartName'
        },
        {
          title: '来源平台名称',
          width: 120,
          field: 'sourcePlatform'
        },
        {
          title: '来源项目名称',
          width: 220,
          field: 'sourceProjectName'
        },
        {
          title: '来源步骤名称',
          width: 120,
          field: 'stepName'
        },
        {
          title: '来源项目所属用户',
          width: 150,
          field: 'projectCreateName'
        },
        {
          title: '创建人',
          width: 120,
          field: 'createUserId'
        },
        {
          title: '创建时间',
          width: 180,
          field: 'createTime'
        },
        {
          title: '修改人',
          width: 120,
          field: 'updateUser'
        },
        {
          title: '修改时间',
          width: 180,
          field: 'updateTime'
        },
        {
          width: 150,
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
      tableData: [],
      checkedList: []
    }
  },

  computed: {
    hasChecked() {
      return !!this.checkedList.length
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
        this.tableData = res.data.content.content
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
      const { chartType, reportTittle, sourcePlatform, sourceProjectName, sourceCreateUser, timeRange } = this.filter
      const { pageSize, currentPage: page } = this.pagerConfig
      let createStartTime
      let createEndTime
      const [start, end] = timeRange

      if (start && end) {
        createStartTime = moment(start).format('YYYY-MM-DD 00:00:00')
        createEndTime = moment(end).format('YYYY-MM-DD 23:59:59')
      }

      return {
        chartType,
        reportTittle,
        sourcePlatform,
        sourceProjectName,
        sourceCreateUser,
        createStartTime,
        createEndTime,
        page,
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
    /**
     * @description: 编辑图表
     * @param {Object} row 行信息
     */
    onEditChart(row) {
      const { reportId: id } = row

      this.$router.push({ path: '/chart/workspace', query: { id, type: 'edit' }})
    },
    /**
     * @description: 删除图表
     * @param {Objcet} row 删除的行
     */
    onDeleteChart(row) {
      const { reportId, reportTittle } = row

      this.$confirm({
        title: '删除提示',
        content: `是否删除 “${reportTittle}” ?`,
        okText: '确认',
        onOk: () => {
          return ChartApiServices.deleteChart(reportId).then(res => {
            if (res.data.content === true) {
              this.$message.success('删除成功')
              this.onGetChartData()
            }
          })
        }
      })
    },
    /**
     * @description: 重置筛选条件
     */
    onResetFilter() {
      this.filter.sourcePlatform = undefined
      this.filter.sourceProjectName = undefined
      this.filter.timeRange = []
      this.filter.sourceCreateUser = undefined
    },
    /**
     * @description: 表格选中事件
     * @param {Object} checked 所有选中信息
     */
    onTableSelect(checked) {
      this.checkedList = checked.records
    },
    /**
     * @description: 批量删除
     */
    onBatchDelete() {
      const deleteIdList = this.checkedList.map(item => item.reportId)
      const deleteNameList = this.checkedList.map(item => item.reportTittle)
      const payload = {
        ids: deleteIdList
      }

      this.$confirmList({
        title: `注意：是否删除以下内容（${deleteIdList.length}）项？`,
        content: deleteNameList,
        onOk: () => {
          return ChartApiServices.batchDeleteChart(payload)
            .then((res) => {
              if (res.data.content === true) {
                this.$message.success('删除成功')
                this.onGetChartData()
              } else {
                this.$message.warn('删除失败')
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
