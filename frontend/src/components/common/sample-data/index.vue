<!--
 * @Description:查看样例数据弹窗
 * @Date: 2021-11-25 14:16:16
 -->
<template>
  <div>
    <a-base-modal
      v-model="isSampleDataModalShow"
      :title="title"
      width="65%"
      @ok="onOk"
      @cancel="onCancel"
    >
      <div class="data-list">
        <div class="list-title">
          {{ tableName }}
          <span class="remarks-text">(注：前100条记录显示)</span>
        </div>
        <!--列表-->
        <div class="table-container">
          <DTable
            v-bind="tableOptions"
            ref="senseTable"
            :columns="columns"
            @page-change="changePage"
          />
        </div>
      </div>
    </a-base-modal>
  </div>
</template>
<script>

export default {
  name: 'SampleData',
  model: {
    prop: 'visible',
    event: 'change'
  },
  props: {
    // modal显示隐藏
    visible: {
      type: Boolean,
      default: false
    },
    // 弹窗标题
    title: {
      type: String,
      default: ''
    },
    // 表格标题
    tableName: {
      type: String,
      default: ''
    },
    // 所有数据
    tableData: {
      type: Array,
      default: () => []
    },
    // 表头
    columnsTable: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 弹窗是否打开
      isSampleDataModalShow: false,
      // 表格配置
      tableOptions: {
        emptyRender: {
          size: 'small'
        },
        pagerConfig: {
          pageSizes: [10, 20, 50, 100], // 页面展示条数选择范围
          total: 0, // 列表总条数
          currentPage: 1, // 当前页
          pageSize: 10// 当前页码
        },
        // 表格数据
        data: []
      }
    }
  },
  computed: {
    // 表头数据转换
    columns() {
      return this.columnsTable.map(item => {
        return {
          title: item.chineseName,
          field: item.englishName,
          minWidth: 150
        }
      })
    }
  },
  watch: {
    // 监听显示隐藏
    visible(val) {
      this.isSampleDataModalShow = val
      val && this.splitArr()
    }
  },
  methods: {
    /**
     * @description: 切换分页
     * @param {Object} page 分页对象
     */
    changePage(page) {
      this.tableOptions.pagerConfig.currentPage = page.currentPage
      this.tableOptions.pagerConfig.pageSize = page.pageSize
      this.splitArr()
    },
    /**
     * @description: 前端分页
     */
    splitArr() {
      this.tableOptions.pagerConfig.total = this.tableData.length
      const begin = (this.tableOptions.pagerConfig.currentPage - 1) * this.tableOptions.pagerConfig.pageSize
      const end = this.tableOptions.pagerConfig.currentPage * this.tableOptions.pagerConfig.pageSize
      this.tableOptions.data = this.tableData.slice(begin, end)
    },
    /**
     * @description: 确定
     */
    onOk() {
      this.onClose()
    },
    /**
     * @description: 取消
     */
    onCancel() {
      this.onClose()
    },
    /**
     * @description: 关闭弹窗
     */
    onClose() {
      this.tableOptions.pagerConfig.total = 0
      this.tableOptions.pagerConfig.currentPage = 1
      this.tableOptions.pagerConfig.pageSize = 10
      this.$emit('change')
      // 弹窗关闭刷新列表数据
      this.$emit('updateListInfo')
    }
  }
}
</script>
<style lang="less" scoped>
.data-list {
  margin: 0 50px;
  height: 100%;
  background: #FAFAFA;
  .list-title {
    padding:15px 25px;
    .remarks-text {
      margin-left: 14px;
      color: #AEB7C4;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
    }
  }
  .table-container {
    padding: 0 16px;
  }
}
</style>
