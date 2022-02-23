<!--
 * @Description: 筛选指标
 * @Date: 2022-02-21 14:45:04
 * @LastEditTime: 2022-02-23 17:38:21
-->
<template>
  <Draggable
    class="filter-index"
    :list="indexList"
    :options="{group:'workspace', disabled: false}"
    @add="onAddFilterIndex($event)"
  >
    <div v-for="(item, index) in indexList" :key="`${item.id}-${index}`" class="flex-box-row-mini">
      <a-dropdown :trigger="['click']">
        <a-tag closable :color="getTagColorByType(item.type)" @close="onClose(index)">{{ item.showName || item.name }}</a-tag>
        <a-menu slot="overlay">

          <template v-for="menuItem in item.setting">
            <a-sub-menu :key="menuItem.value">
              <span slot="title">{{ menuItem.label }}</span>
              <a-menu-item
                v-for="children in menuItem.children"
                :key="children.value"
                @click="onChangeStatisticsType(item, menuItem.value, children.value)"
              >{{ children.label }}</a-menu-item>
            </a-sub-menu>
          </template>
        </a-menu>
      </a-dropdown>
    </div>
  </Draggable>
</template>

<script>
import Draggable from 'vuedraggable'
import { eventBus, eventBusType } from '@/utils/event-bus'

export default {
  name: 'FilterIndex',

  components: {
    Draggable
  },

  inject: ['chartInfo'],

  data() {
    const sortList = [
      { label: '无序', value: '' },
      { label: '升序', value: 'asc' },
      { label: '降序', value: 'desc' }
    ]
    return {
      typeOptin: {
        number: ['number', 'bignumber', 'integer'],
        string: ['string'],
        date: ['date', 'datetime', 'datestamp', 'timestamp']
      },
      sortSetting: sortList,
      indexInfo: {
        number: {
          statisticsType: 'sum',
          setting: [
            { label: '最大值', value: 'max', children: sortList },
            { label: '最小值', value: 'min', children: sortList },
            { label: '计数', value: 'count', children: sortList },
            { label: '总和', value: 'sum', children: sortList },
            { label: '平均值', value: 'avg', children: sortList }
          ]
        },
        string: {
          statisticsType: 'count',
          setting: [
            { label: '最大值', value: 'max', children: sortList },
            { label: '最小值', value: 'min', children: sortList },
            { label: '计数', value: 'count', children: sortList }
          ]
        },
        date: {
          statisticsType: 'toISOYear',
          setting: [
            { label: '年', value: 'toISOYear', children: sortList },
            { label: '月', value: 'toMonth', children: sortList },
            { label: '周', value: 'toISOWeek', children: sortList },
            { label: '天', value: 'toDate', children: sortList }
          ]
        }
      },

      indexList: []
    }
  },

  computed: {
    // 所有的配置信息
    allSetting() {
      const setting = []
      Object.keys(this.indexInfo).forEach(key => {
        setting.push(...this.indexInfo[key].setting)
      })

      return setting
    }
  },

  watch: {
    'chartInfo.data'(value) {
      const { dataJson } = value
      const data = JSON.parse(dataJson)

      this.indexList = data.characts.map(item => {
        const { statisticsType, columnChinsesName: name, sort } = item
        const type = this.getType(item.dateType)
        const nameLabel = this.getNameLabel(statisticsType)
        const sortIcon = {
          'asc': ' | ↑ ',
          'desc': ' | ↓ ',
          '': '',
          undefined: ''
        }

        return {
          ...item,
          setting: this.indexInfo[type].setting,
          showName: `${nameLabel}(${name}${sortIcon[sort]})`
        }
      })
    },
    indexList(value) {
      eventBus.$emit(eventBusType.WORKSPACE_PAYLOAD, 'index', value)
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
    onAddFilterIndex(event) {
      const handleIndex = event.newIndex
      const handleItem = this.indexList[handleIndex]
      const type = this.getType(handleItem.dateType)
      const statisticsType = this.indexInfo[type].statisticsType
      const nameLabel = this.getNameLabel(statisticsType)
      const sortIcon = {
        'asc': ' | ↑ ',
        'desc': ' | ↓ ',
        '': ''
      }

      this.$set(handleItem, 'setting', this.indexInfo[type].setting)
      this.$set(handleItem, 'sort', '')
      this.$set(handleItem, 'statisticsType', statisticsType)
      this.$set(handleItem, 'showName', `${nameLabel}(${handleItem.columnChinsesName}${sortIcon[handleItem.sort]})`)
    },
    /**
     * @description: 删除标签
     * @param {*}
     */
    onClose(index) {
      this.indexList.splice(index, 1)
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
     * @description: 获取label 拼接名字  todo 目前存在问题（会有多个方法名字拼接）
     * @param {string} statisticsType 类型
     * @return {string} 中文名字
     */
    getNameLabel(statisticsType) {
      const setting = this.allSetting.find(item => item.value === statisticsType)

      return setting.label
    },
    /**
     * @description: 修改统计类型
     * @param {Object} item 修改的项
     * @param {string} value 修改类型的值
     */
    onChangeStatisticsType(item, value, sort) {
      const nameLabel = this.getNameLabel(value)
      const sortIcon = {
        'asc': ' | ↑ ',
        'desc': ' | ↓ ',
        '': ''
      }

      this.$set(item, 'statisticsType', value)
      this.$set(item, 'sort', sort)
      this.$set(item, 'showName', `${nameLabel}(${item.columnChinsesName}${sortIcon[sort]})`)
    }
  }
}
</script>

<style lang="less" scoped>
.filter-index {
  padding-top: 10px;
  height: 100%;
}
</style>
