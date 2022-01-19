<!--
 * @Description: 列表视图
 * @Date: 2022-01-18 17:46:02
 * @LastEditTime: 2022-01-19 15:41:20
-->
<template>
  <div class="list">
    <SenseTable
      :columns="columns"
      :data="tableData"
      :pager-config="pagerConfig"
      :loading="tableLoading"
      height="auto"
      @page-change="changePage"
    >
      <template #action="{ row }">
        <a-tooltip title="查看">
          <a-icon
            class="icon-btn"
            type="file-search"
            @click="onViewBoard(row)"
          />
        </a-tooltip>
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
    </SenseTable>
  </div>
</template>
<script>
import HomeApiServices from '@/services/home'

export default {
  name: 'HomeList',

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
          title: '创建者',
          field: 'createUserId'
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

  computed: {

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
    getHomeListData(name) {
      const payload = {
        rows: this.pagerConfig.pageSize,
        pageSize: this.pagerConfig.currentPage,
        name
      }

      this.tableLoading = true
      HomeApiServices.getHomeListInfo(payload).then(res => {
        this.tableData = res.data.content.list || []
        this.pagerConfig.total = res.data.content.total
      }).finally(() => {
        this.tableLoading = false
      })
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
     * @description: 查看看板
     * @param {Object} row 行信息
     */
    onViewBoard(row) {
      const { dashboardId } = row

      this.$router.push({ path: '/board/dashboard', query: { dashboardId, viewType: 'read' }})
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
