<!--
 * @Description:导入历史
 * @Date: 2021-08-23 10:39:14
 -->

<template>
  <div class="history-content">
    <div class="history-header">
      <!-- <a-space> -->
      <!-- <a-input v-model="text" placeholder="请输入名称" class="history-header__input" @keyup.enter="onClickSearch" @change="onChangeInput" />
        <a-button
          class="search-btn"
          type="primary"
          @click="onClickSearch()"
        >
          查询
        </a-button> -->
      <s-page-handle>
        <div slot="filters" class="page-handle">
          <s-page-handle-item>
            <a-input v-model="text" allow-clear placeholder="请输入名称" @keyup.enter="onClickSearch" />
          </s-page-handle-item>
          <s-page-handle-item>
            <a-button
              class="search-btn"
              type="primary"
              @click="onClickSearch()"
            >
              查询
            </a-button>
          </s-page-handle-item>
        </div>
      </s-page-handle>
      <!-- </a-space> -->
    </div>
    <div class="history-body">
      <!-- 表格 -->
      <div class="table-container">
        <vxe-grid
          ref="senseTable"
          v-bind="gridOptions"
          :columns="columns"
          :data="table.list"
          :loading="table.isTableLoading"
          height="auto"
        >
          <template #status="{row}">
            <span :class="getStatusClass(row.status)">{{ formatStatus(row.status) }}</span>
          </template>
        </vxe-grid>
      </div>
      <!-- 分页 -->
      <div class="table-pager">
        <vxe-pager
          :loading="table.isTableLoading"
          :current-page="table.currentPage"
          :page-size="table.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="table.total"
          :layouts="['Total','PrevPage', 'JumpNumber', 'NextPage', 'Sizes','FullJump']"
          @page-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getAdImportHistory } from '@/services/excel'
import { getDictByType } from '@/services/dict'
export default {
  props: {
    title: {
      type: String,
      default: () => {
        return ''
      }
    },
    tabKey: {
      type: Number,
      default: () => {
        return -1
      }
    }
  },
  data() {
    const buttonGroups = [
      { title: '所有', total: 2, type: 'primary' },
      { title: '成功', total: 2, type: '' },
      { title: '失败', total: 0, type: '' }
    ]

    return {
      // 设置默认的点击button状态
      defaultType: 'primary',
      // 按钮
      buttonGroups,
      // 历史表格参数对象
      importType: [],
      // 输入框的值
      text: '',
      // 表格配置项
      gridOptions: {
        resizable: true,
        autoResize: true,
        stripe: true,
        class: 'sense-table',
        headerCellClassName: 'sense-table-header-cell',
        headerRowClassName: 'sense-table-header-row',
        cellClassName: 'sense-table-cell',
        rowClassName: 'sense-table-row',
        emptyRender: { name: 'no-data', size: 'small' },
        sortConfig: {
          trigger: 'cell',
          remote: true
        }
      },
      // 表格列
      columns: [
        {
          field: 'lineNumber',
          title: '行号',
          titleHelp: { message: '数据在Excel表格中的行数' }
        },
        {
          field: 'baseInfo',
          title: '基本信息'
        },
        {
          field: 'status',
          title: '结果',
          slots: { default: 'status' }
        },
        {
          field: 'comment',
          title: '备注'
        }
      ],
      // 表格相关数据
      table: {
        list: [],
        isTableLoading: true, // 表格loading
        property: 'line_number', // 表格排序字段名
        order: 'asc', // 表格排序方式 desc | asc
        currentPage: 1, // 当前页
        pageSize: 10, // 当前页码
        total: 0// 列表总条数
      }
    }
  },
  watch: {
    tabKey(val) {
      if (val === 1) {
        this.$nextTick(() => {
          this.getList()
        })
      }
    }
  },
  created() {
    this.initButtonGroups()
    this.getImportDictByType()
  },
  methods: {
    getDictCode() {
      let dictCode = ''
      this.importType?.forEach(item => {
        if (this.title.indexOf(item.dictValue.split('-')[1]) >= 0) {
          dictCode = item.dictCode
        }
      })
      return dictCode
    },
    /**
     * @description 根据字典表获取导入历史的dict
     */
    getImportDictByType() {
      const params = { dictType: this.getImportHistoryType() }
      getDictByType(params).then(res => {
        this.importType = res.data.data
        this.getList()
      })
    },
    /**
     * @description 设置导入历史的dictType
     */
    getImportHistoryType() {
      return 'VUL_IMPORT_TYPE'
    },
    /**
     * @description 查询点击
     */
    onClickSearch() {
      this.table.currentPage = 1
      this.table.pageSize = 10
      this.getList()
    },
    /**
    * @description：button点击切换状态
    * @param {number} index 下标
    */
    onClickType(index) {
      this.buttonGroups.map((item, index1) => {
        if (index === index1) {
          item.type = this.defaultType
          return item
        } else {
          item.type = ''
          return item
        }
      })

      this.onClickHistoryStautsButton(index)
    },
    /**
     * @description: 获取列表数据
     */
    getList() {
      const dictCode = this.getDictCode()
      this.table.isTableLoading = true
      const { currentPage, pageSize, property, order } = this.table
      const parmas = {
        page: currentPage,
        pageSize,
        // 其他参数
        importType: dictCode,
        baseInfo: this.text
      }
      // 排序字段
      if (property && order) {
        parmas.sorts = `${property}:${order}`
      }

      getAdImportHistory(parmas).then((res) => {
        const { content } = res.data
        this.table.list = content.list
        this.table.total = content.total
      }).finally(() => {
        this.table.isTableLoading = false
      })
      // getTableListTest(parmas).then(res => {
      //   this.table.list = res.data?.content?.list
      //   // 为了掩饰‘无效’的数据状态, 无意义
      //   this.table.list[0].drStatus = '0'
      //   this.table.isTableLoading = false
      //   this.table.total = res.data?.content?.total
      // })
    },
    /**
     * @description: 数据颜色
     * @param {Number} val
     */
    getStatusClass(val) {
      switch (val) {
        case 1:
          return 'success-color'
        case '失败':
          return 'error-color'
        default:
          return 'disabled-color'
      }
    },
    /**
     * @description 格式化数据
     * @param {Number} val
     */
    formatStatus(val) {
      switch (val) {
        case 1:
          return '成功'
        case '失败':
          return '失败'
        default:
          return ''
      }
    },
    /**
     * @description: 更改分页
     * @param {number} currentPage 当前页
     * @param {number} pageSize 每页条数
     */
    handlePageChange({ currentPage, pageSize }) {
      this.table.currentPage = currentPage
      this.table.pageSize = pageSize
      this.getList()
    },
    /**
     * @description：输入框输入函数
     */
    onChangeInput(val) {
      console.log(val)
    },
    /**
     * @description: 初始化按钮状态，默认第一个
     */
    initButtonGroups() {
      this.buttonGroups = [
        { title: '所有', total: 2, type: 'primary' },
        { title: '成功', total: 2, type: '' },
        { title: '失败', total: 0, type: '' }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.history-content {
    display: flex;
    flex-direction: column;
    padding: 0 16px;

    .history-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding-top: 10px;

        .page-handle {
          margin-top: 0px;
        }
    }

    .history-body {
      display: flex;
      flex-direction: column;

      .table-container {
        height: calc(70vh - 200px);
      }
    }

    .success-color {
      color: @success-color;
    }
    .error-color {
      color: @error-color;
    }
    .disabled-color {
    color: @disabled-color;
  }
}
</style>
