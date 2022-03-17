<!--
 * @Description: 图表轴
 * @Date: 2022-02-22 19:20:19
 * @LastEditTime: 2022-03-02 17:47:45
-->
<template>
  <div class="axis-box">
    <div class="column axis-item flex-box-row-small">
      <div class="axis-label">
        <a-icon type="menu" class="flex-box-col-small need-turn" />
        <span class="flex-box-col-small">列</span>
        <a-tooltip>
          <template slot="title">
            <div>列的功能：</div>
            <div>1、在透视表中，将列的数据打横放在第一行，从左到右依次排开展示。</div>
            <div>2、在其他图表中，列数据会放在每个图的X坐标。</div>
          </template>
          <a-icon type="question-circle" class="flex-box-col-small" />
        </a-tooltip>
      </div>
      <Draggable
        class="axis-content"
        :list="columnList"
        :options="{group:'workspace', disabled: false}"
        @add="onAddaxis($event, 'column')"
      >
        <div v-for="(item, index) in columnList" :key="`${item.id}-${index}`" class="axis-tag">
          <a-dropdown :trigger="['click']">
            <a-tag closable :color="getTagColorByType(item.type)" @close="onClose(index, 'column')">{{ item.showName || item.name }}</a-tag>
            <a-menu slot="overlay">
              <template v-for="menuItem in item.setting">
                <a-sub-menu v-if="menuItem.children" :key="menuItem.value">
                  <span slot="title">{{ menuItem.label }}</span>
                  <a-menu-item
                    v-for="children in menuItem.children"
                    :key="children.value"
                    @click="onChangeStatisticsType(item, menuItem.value, children.value)"
                  >{{ children.label }}</a-menu-item>
                </a-sub-menu>
                <a-menu-item
                  v-else
                  :key="menuItem.value"
                  @click="onJustChangeSort(item, menuItem.value)"
                >{{ menuItem.label }}</a-menu-item>
              </template>
            </a-menu>
          </a-dropdown>
        </div>
      </Draggable>
    </div>
    <div class="row axis-item flex-box-row-small">
      <div class="axis-label">
        <a-icon type="menu" class="flex-box-col-small" />
        <span class="flex-box-col-small">行</span>
        <a-tooltip>
          <template slot="title">
            <div>行的功能</div>
            <div>1、在透视表中，将行的数据放在第一列，从上到下依次排开展示。</div>
            <div>2、在其他图表中，行数据会把图拆分多个图。</div>
          </template>
          <a-icon type="question-circle" class="flex-box-col-small" />
        </a-tooltip>
      </div>

      <Draggable
        class="axis-content"
        :list="rowList"
        :options="{group:'workspace', disabled: false}"
        @add="onAddaxis($event, 'row')"
      >
        <div v-for="(item, index) in rowList" :key="`${item.id}-${index}`" class="axis-tag">
          <a-dropdown :trigger="['click']">
            <a-tag closable :color="getTagColorByType(item.type)" @close="onClose(index, 'row')">{{ item.showName || item.name }}</a-tag>
            <a-menu slot="overlay">
              <template v-for="menuItem in item.setting">
                <a-sub-menu v-if="menuItem.children" :key="menuItem.value">
                  <span slot="title">{{ menuItem.label }}</span>
                  <a-menu-item
                    v-for="children in menuItem.children"
                    :key="children.value"
                    @click="onChangeStatisticsType(item, menuItem.value, children.value)"
                  >{{ children.label }}</a-menu-item>
                </a-sub-menu>
                <a-menu-item
                  v-else
                  :key="menuItem.value"
                  @click="onJustChangeSort(item, menuItem.value)"
                >{{ menuItem.label }}</a-menu-item>
              </template>
            </a-menu>
          </a-dropdown>
        </div>
      </Draggable>
    </div>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import { eventBus, eventBusType } from '@/utils/event-bus'

export default {
  name: 'ChartAxis',

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
      dateSetting: [
        { label: '年', value: 'toISOYear', children: sortList },
        { label: '月', value: 'toMonth', children: sortList },
        { label: '周', value: 'toISOWeek', children: sortList },
        { label: '天', value: 'toDate', children: sortList }
      ],
      columnList: [],
      rowList: []
    }
  },

  watch: {
    'chartInfo.data'(value) {
      const { dataJson } = value
      if (dataJson) {
        const data = JSON.parse(dataJson)

        this.columnList = data.columnListVO.map(item => {
          const type = this.getType(item.dateType)
          const setting = type === 'date' ? this.dateSetting : this.sortSetting

          return {
            ...item,
            setting
          }
        })
        this.rowList = data.rowListVO.map(item => {
          const type = this.getType(item.dateType)
          const setting = type === 'date' ? this.dateSetting : this.sortSetting

          return {
            ...item,
            setting
          }
        })
      }
    },
    columnList(value) {
      eventBus.$emit(eventBusType.WORKSPACE_PAYLOAD, 'column', value)
    },
    rowList(value) {
      eventBus.$emit(eventBusType.WORKSPACE_PAYLOAD, 'row', value)
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
    onAddaxis(event, handleType) {
      const typeOption = {
        column: 'columnList',
        row: 'rowList'
      }
      const handleIndex = event.newIndex
      const handleItem = this[typeOption[handleType]][handleIndex]
      const type = this.getType(handleItem.dateType)
      const setting = type === 'date' ? this.dateSetting : this.sortSetting
      const sortIcon = {
        'asc': ' | ↑ ',
        'desc': ' | ↓ ',
        '': '',
        undefined: ''
      }
      const nameInfo = this.dateSetting.find(settingItem => settingItem.value === handleItem.statisticsType)
      let showName = ''
      if (nameInfo) {
        showName = `${nameInfo.label}(${handleItem.columnChinsesName}${sortIcon[handleItem.sort]})`
      } else {
        showName = `${handleItem.columnChinsesName}${sortIcon[handleItem.sort]}`
      }

      this.$set(handleItem, 'showName', showName)

      this.$set(handleItem, 'setting', setting)
    },

    onClose(index, type) {
      const typeOption = {
        column: 'columnList',
        row: 'rowList'
      }

      this[typeOption[type]].splice(index, 1)
    },

    /**
     * @description: 修改统计类型
     * @param {Object} item 修改的项
     * @param {string} value 修改类型的值
     */
    onChangeStatisticsType(item, value, sort) {
      const nameLabel = this.dateSetting.find(settingItem => settingItem.value === value).label
      const sortIcon = {
        'asc': ' | ↑ ',
        'desc': ' | ↓ ',
        '': ''
      }

      this.$set(item, 'statisticsType', value)
      this.$set(item, 'sort', sort)
      this.$set(item, 'showName', `${nameLabel}(${item.columnChinsesName}${sortIcon[sort]})`)
    },
    onJustChangeSort(item, sort) {
      const sortIcon = {
        'asc': ' | ↑ ',
        'desc': ' | ↓ ',
        '': ''
      }

      this.$set(item, 'sort', sort)
      this.$set(item, 'showName', `${item.columnChinsesName}${sortIcon[sort]}`)
    }
  }
}
</script>

<style lang="less" scoped>
.axis-box {
  display: flex;
  flex-direction: column;
  .axis-item {
    display: flex;
    align-items: center;
    min-height: 40px;
    border: 1px solid #E9E9E9;
    background-color: #fff;
    box-shadow: 0 23px 44px 0 rgb(176 183 195 / 14%);
    .axis-label {
      display: flex;
      align-items: center;
      padding: 0 10px;
      height: 100%;
      border-right: 1px solid #E9E9E9;
      .need-turn {
        transform: rotate(90deg);
      }
    }
    .axis-content {
      display: flex;
      flex: 1;
      flex-wrap: wrap;
      padding: 5px;
      width: 0;
      height: 100%;
      .axis-tag {
        margin: 2px 0;
      }
    }
  }
}
</style>