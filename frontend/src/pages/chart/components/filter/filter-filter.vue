<!--
 * @Description: 筛选器
 * @Date: 2022-02-21 14:45:04
 -->
<template>
  <div class="filter-box">
    <Draggable
      class="filter-filter"
      :list="filterList"
      :options="{group:'workspace', disabled: false}"
      @add="onAddFilter($event)"
    >
      <div v-for="(item, index) in filterList" :key="`${item.id}-${index}`" class="flex-box-row-mini">
        <a-dropdown :trigger="['click']">
          <a-tag closable :color="getTagColorByType(item.type)" @close="onClose(index)">{{ item.name }}</a-tag>
          <a-menu slot="overlay">
            <template v-for="menuItem in drapdownList">
              <a-menu-item :key="menuItem.value" @click="onShowFilterModal(item, index)">
                {{ menuItem.label }}
              </a-menu-item>
            </template>
          </a-menu>
        </a-dropdown>
      </div>
    </Draggable>
    <FilterModal
      v-model="isFilterModalShow"
      :filter-item="filterModalItem"
      :filter-index="filterModalIndex"
      @on-change-filter="onModifyFilter"
    />
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import FilterModal from './filter-modal.vue'
import { eventBus, eventBusType } from '@/utils/event-bus'

export default {
  name: 'FilterFilter',

  components: {
    Draggable,
    FilterModal
  },

  inject: ['chartInfo'],

  data() {
    return {
      typeOptin: {
        number: ['number', 'bignumber', 'integer'],
        string: ['string'],
        date: ['date', 'datetime', 'datestamp', 'timestamp']
      },
      drapdownList: [
        { label: '编辑筛选器', value: 'editFilter' }
      ],
      filterInfo: {
        number: {
          statisticsType: 'sum',
          setting: [
            { label: '最大值', value: 'max' },
            { label: '最小值', value: 'min' },
            { label: '计数', value: 'count' },
            { label: '总和', value: 'sum' },
            { label: '平均值', value: 'avg' }
          ]
        },
        string: {
          statisticsType: 'count',
          setting: [
            { label: '最大值', value: 'max' },
            { label: '最小值', value: 'min' },
            { label: '计数', value: 'count' }
          ]
        },
        date: {
          statisticsType: 'toISOYear',
          setting: [
            { label: '年', value: 'toISOYear' },
            { label: '月', value: 'toMonth' },
            { label: '周', value: 'toISOWeek' },
            { label: '天', value: 'toDate' }
          ]
        }
      },

      filterList: [],
      isFilterModalShow: false,
      filterModalItem: {},
      filterModalIndex: ''
    }
  },

  computed: {
    // 所有的配置信息
    allSetting() {
      const setting = []
      Object.keys(this.filterInfo).forEach(key => {
        setting.push(...this.filterInfo[key].setting)
      })

      return setting
    }
  },

  watch: {
    'chartInfo.data'(value) {
      const { dataJson } = value
      if (dataJson) {
        const data = JSON.parse(dataJson)

        this.filterList = data.filterListVO
      }
    },
    filterList(value) {
      eventBus.$emit(eventBusType.WORKSPACE_PAYLOAD, 'filter', value)
    }
  },

  methods: {
    /**
     * @description: 获取tag颜色
     * @param {string} type 数据类型
     * @return {string} 颜色值
     */
    getTagColorByType(type) {
      const tagColorOption = {
        'dimension': '#5b90a5',
        'mertric': '#54ac87'
      }

      return tagColorOption[type] || '#5b90a5'
    },
    /**
     * @description: 拖拽一个图 修改默认信息
     * @param {event} event
     */
    onAddFilter(event) {
      const handleIndex = event.newIndex
      const handleItem = this.filterList[handleIndex]

      handleItem.filters = []
      this.$nextTick(() => {
        this.filterModalIndex = handleIndex
        this.filterModalItem = handleItem
        this.isFilterModalShow = true
      })
    },
    /**
     * @description: 删除标签
     * @param {*}
     */
    onClose(index) {
      this.filterList.splice(index, 1)
    },
    /**
     * @description: 通过类型获取前端展示的类型
     * @param {string} dateType 后端返回的类型
     * @return {string} 前端展示的类型
     */
    getType(dateType) {
      let type = ''
      const lowerDateType = dateType.toLowerCase()

      Object.keys(this.typeOptin).forEach((key) => {
        // 如果存在则返回key值
        if (this.typeOptin[key].includes(lowerDateType)) {
          type = key
        }
      })

      return type
    },
    /**
     * @description: 获取label 拼接名字
     * @param {string} statisticsType 类型
     * @return {string} 中文名字
     */
    getNameLabel(statisticsType) {
      const setting = this.allSetting.find(item => item.value === statisticsType)

      return setting.label
    },
    /**
     * @description: 打开筛选弹窗
     * @param {Object} item 筛选的项
     * @param {number} index 筛选的下标
     */
    onShowFilterModal(item, index) {
      this.isFilterModalShow = true
      this.filterModalItem = item
      this.filterModalIndex = index
    },
    /**
     * @description: 修改筛选信息
     * @param {Object} value 筛选后的信息
     */
    onModifyFilter(value) {
      const { data, index } = value

      this.filterList[index].filters = data
    }
  }
}
</script>

<style lang="less" scoped>
.filter-box {
  height: 100%;
  .filter-filter {
    padding-top: 10px;
    height: 100%;
  }
}
</style>
