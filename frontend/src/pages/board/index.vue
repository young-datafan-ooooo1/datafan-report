<!--
 * @Description: board
 * @Date: 2022-01-18 15:16:24
 -->
<template>
  <div class="board page-container">
    <DPageTitle title="看板管理">
      <a-button
        type="primary"
        icon="plus"
        @click="onAddBoard"
      >新建看板</a-button>
    </DPageTitle>
    <DPageHandle>
      <div slot="filters">
        <DPageHandleItem>
          <a-input v-model="dashboardName" allow-clear placeholder="请输入看板名称" />
        </DPageHandleItem>
        <DPageHandleItem>
          <a-range-picker
            v-model="timeRange"
            allow-clear
            format="YYYY-MM-DD"
            :placeholder="['创建开始时间', '创建结束时间']"
          />
        </DPageHandleItem>
        <DPageHandleItem>
          <a-button
            class="search-btn"
            type="primary"
            @click="onGetBoardData()"
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
  </div>
</template>

<script>
import moment from 'moment'
import HomeApiServices from '@/services/home'
import DashboardApiServices from '@/services/dashboard'

export default {
  name: 'Board',

  data() {
    return {
      dashboardName: '',
      tableData: [],
      // 分页配置
      pagerConfig: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      columns: [
        {
          type: 'checkbox',
          width: 60,
          fixed: 'left'
        },
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
          title: '修改人',
          field: 'updateUser'
        },
        {
          title: '修改时间',
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
      tableLoading: false,
      checkedList: [],
      timeRange: []
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
      this.onGetBoardData()
    },
    /**
     * @description: 获取看板数据
     */
    onGetBoardData() {
      const payload = this.onGetBoardPayload()

      this.tableLoading = true
      HomeApiServices.getHomeListInfo(payload).then(res => {
        this.tableData = res.data.content.content || []
        this.pagerConfig.total = res.data.content.total
      }).finally(() => {
        this.tableLoading = false
      })
    },
    /**
     * @description: 获取看板参数
     * @return {Object} 看板查询参数
     */
    onGetBoardPayload() {
      const { pageSize, currentPage: page } = this.pagerConfig
      const { dashboardName } = this
      let createStartTime
      let createEndTime
      const [start, end] = this.timeRange

      if (start && end) {
        createStartTime = moment(start).format('YYYY-MM-DD 00:00:00')
        createEndTime = moment(end).format('YYYY-MM-DD 23:59:59')
      }

      return {
        pageSize,
        page,
        dashboardName,
        createStartTime,
        createEndTime
      }
    },
    /**
     * @description: 新增看板
     */
    onAddBoard() {
      this.$router.push({ path: '/board/dashboard' })
    },
    /**
     * @description: 切换分页
     * @param {Object} page 分页对象
     */
    changePage(page) {
      this.pagerConfig.currentPage = page.currentPage
      this.pagerConfig.pageSize = page.pageSize
      this.onGetBoardData()
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
              this.onGetBoardData()
            } else {
              this.$message.warn('删除失败')
            }
          })
        }
      })
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
      const deleteIdList = this.checkedList.map(item => item.dashboardId)
      const deleteNameList = this.checkedList.map(item => item.dashboardName)
      const payload = {
        ids: deleteIdList
      }

      this.$confirmList({
        title: `注意：是否删除以下内容（${deleteIdList.length}）项？`,
        content: deleteNameList,
        onOk: () => {
          return DashboardApiServices.batchDeleteDashboard(payload)
            .then((res) => {
              if (res.data.content === true) {
                this.$message.success('删除成功')
                this.onGetBoardData()
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
.board {
  padding: 0;
}
</style>
