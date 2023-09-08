<!--
 * @Description: 列表视图
 * @Date: 2022-01-18 17:46:02
 -->
<template>
  <div class="list">
    <DTable
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
            @click="onDeleteBoard(row)"
          />
        </a-tooltip>
      </template>
    </DTable>
  </div>
</template>
<script>
import HomeApiServices from '@/services/home'
import { getSharedReportListByPage } from '@/services/dashboard-share'

export default {
  name: 'HomeList',

  props: {
    dashboardName: {
      type: String,
      default: ''
    },
    reportType: {
      type: String,
      default: 'myself'
    }
  },

  data() {
    return {
      // 表格数据
      tableData: [],
      // 分页配置
      pagerConfig: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      // 表格配置
      columns: [
        {
          title: '看板名称',
          field: 'dashboardName'
        },
        {
          title: '创建人',
          field: 'createUser'
        },
        {
          title: '创建时间',
          field: 'createTime'
        },
        {
          title: '最后修改时间',
          field: 'updateTime'
        },
        {
          width: 180,
          title: '操作',
          fixed: 'right',
          align: 'center',
          slots: { default: 'action' }
        }
      ],
      // 表格loading
      tableLoading: false
    }
  },
  watch: {
    reportType(newValue) {
      this.getHomeListData()
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
      this.getHomeListData()
    },
    /**
     * @description: 获取列表信息
     * @param {*} name 看板调用次方法，会传
     */
    getHomeListData() {
      const { pageSize, currentPage: page } = this.pagerConfig
      const { dashboardName } = this
      const payload = {
        page,
        pageSize,
        dashboardName
      }

      this.tableLoading = true

      if (this.reportType === 'shared') {
        getSharedReportListByPage(payload).then(res => {
          this.tableData = res.data.content.content || []
          this.pagerConfig.total = res.data.content.total
        }).finally(() => {
          this.tableLoading = false
        })
      } else {
        HomeApiServices.getHomeListInfo(payload).then(res => {
          this.tableData = res.data.content.content || []
          this.pagerConfig.total = res.data.content.total
        }).finally(() => {
          this.tableLoading = false
        })
      }
    },
    /**
     * @description: 切换分页
     * @param {Object} page 分页对象
     */
    changePage(page) {
      this.pagerConfig.currentPage = page.currentPage
      this.pagerConfig.pageSize = page.pageSize
      this.getHomeListData()
    },
    /**
     * @description: 编辑看板
     * @param {Object} row 行信息
     */
    onEditBoard(row) {
      const { dashboardId } = row

      this.$router.push({ path: '/board/dashboard', query: { dashboardId, viewType: 'edit' }})
    },
    /**
     * @description: 删除看板
     * @param {Object} row 行信息
     */
    onDeleteBoard(row) {
      const { dashboardId: id, dashboardName: name } = row
      this.$confirm({
        title: '删除提示',
        content: `是否删除 “${name}” ?`,
        okText: '确认',
        onOk: () => {
          return HomeApiServices.deleteDashboard(id).then(res => {
            if (res.data.content === true) {
              this.$message.success('删除成功')
              this.getHomeListData()
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.list {
  height: 100%;
}
</style>
