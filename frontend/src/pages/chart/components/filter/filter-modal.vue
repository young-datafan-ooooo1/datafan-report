<!--
 * @Description: 数据预览弹窗
 * @Date: 2022-02-21 11:18:32
 -->
<template>
  <a-base-modal
    v-model="isModalShow"
    class="filter-modal"
    :title="'筛选条件'"
    width="900px"
    @ok="onOk"
    @cancel="onCancel"
  >
    <div class="filter-modal-content">
      <div class="modal-handle flex-box flex-box--between-justify flex-box-row-small">
        <span>(PS:可对字段进行过滤处理.)</span>
        <a-button
          type="primary"
          ghost
          shape="round"
          @click="onAddFilter"
        >新增</a-button>
      </div>
      <SenseTable
        class="flex-box-row-small"
        :columns="columns"
        :data="filterInfo.filters"
        border
        size="small"
        hide-pager
        height="300"
      >
        <template #opertationSign="{ row }">
          <a-select v-model="row.opertationSign" class="full-item">
            <a-select-option
              v-for="item in operateOption"
              :key="item"
              :value="item"
            >{{ item }}</a-select-option>
          </a-select>
        </template>
        <template #fixedValue="{ row }">
          <a-input
            v-if="isNumberFilter"
            v-model="row.fixedValue"
            type="number"
          />
          <a-date-picker
            v-else-if="isDateFilter"
            v-model="row.fixedValue"
          />
          <a-date-picker
            v-else-if="isDateTimeFilter"
            v-model="row.fixedValue"
            format="YYYY-MM-DD HH:mm:ss"
          />
          <a-input
            v-else
            v-model="row.fixedValue"
            allow-clear
          />
        </template>
        <template #relation="{ row, rowIndex }">
          <a-select v-model="row.relation" v-bind="{disabled: rowIndex === 0}" class="full-item">
            <a-select-option
              v-for="item in relationOption"
              :key="item"
              :value="item"
            >{{ item }}</a-select-option>
          </a-select>
        </template>
        <template #operate="{ rowIndex }">
          <a-tooltip title="删除">
            <a-icon class="icon-btn" type="delete" @click="onDelete(rowIndex)" />
          </a-tooltip>
        </template>
      </SenseTable>
    </div>
  </a-base-modal>
</template>

<script>
export default {
  name: 'FilterModal',

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
    filterItem: {
      type: Object,
      default: () => {}
    },
    filterIndex: {
      type: [Number, String],
      default: ''
    }
  },

  data() {
    return {
      // 是否显示modal
      isModalShow: false,
      filterInfo: {},
      operateOption: ['=', '<>', '<', '<=', '>', '>='],
      relationOption: ['-', 'AND', 'OR'],
      columns: [
        {
          type: 'seq',
          title: '序号',
          width: 60,
          align: 'center'
        },
        {
          field: 'modelColumn',
          title: '字段名',
          minWidth: 120,
          align: 'center'
        },
        {
          field: 'opertationSign',
          title: '操作符',
          minWidth: 120,
          align: 'center',
          slots: { default: 'opertationSign' }
        },
        {
          field: 'fixedValue',
          title: '固定值',
          minWidth: 120,
          align: 'center',
          slots: { default: 'fixedValue' }
        },
        {
          field: 'relation',
          title: '与上一条件关系',
          width: 120,
          align: 'center',
          slots: { default: 'relation' }
        },
        {
          title: '操作',
          width: 90,
          align: 'center',
          fixed: 'right',
          slots: { default: 'operate' }
        }
      ]
    }
  },

  computed: {
    lowerDateType() {
      return this.filterInfo?.dateType.toLowerCase()
    },
    isNumberFilter() {
      return ['number', 'bignumber', 'integer'].includes(this.lowerDateType)
    },
    isDateFilter() {
      return ['date'].includes(this.lowerDateType)
    },
    isDateTimeFilter() {
      return ['datetime'].includes(this.lowerDateType)
    }
  },

  watch: {
    // 监听显示隐藏，控制data数据
    visible(val) {
      this.isModalShow = val
      val && this.initPage()
    }
  },

  methods: {
    /**
     * @description: 初始化页面
     */
    initPage() {
      this.filterInfo = JSON.parse(JSON.stringify(this.filterItem))
    },
    /**
     * @description: 取消按钮
     */
    onCancel() {
      this.onClose()
    },
    onOk() {
      this.$emit('on-change-filter', { data: this.filterInfo.filters, index: this.filterIndex })

      this.onClose()
    },
    /**
     * @description: 关闭弹窗
     */
    onClose() {
      this.$emit('change')
    },
    onDelete(index) {
      this.filterInfo.filters.splice(index, 1)
    },
    onAddFilter() {
      const { name: modelColumn } = this.filterInfo
      const isAddFirstFilter = this.filterInfo.filters.length === 0
      this.filterInfo.filters.push({
        modelColumn,
        opertationSign: '=',
        fixedValue: '',
        columnType: '',
        relation: isAddFirstFilter ? '-' : 'AND'
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .filter-modal {
    &-content {
      height: 100%;
      .full-item {
        width: 100%;
      }
    }
  }
</style>
