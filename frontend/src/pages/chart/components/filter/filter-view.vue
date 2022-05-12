<!--
 * @Description: 筛选
 * @Date: 2022-02-18 17:43:01
 -->
<template>
  <div class="filter-view">
    <div class="dimension filter-item">
      <div class="block-title">指标</div>
      <div class="filter-content">
        <FilterIndex />
      </div>
    </div>
    <div class="filter-item">
      <div class="block-title">筛选器</div>
      <div class="filter-content">
        <FilterFilter />
      </div>
    </div>
    <div class="filter-item">
      <div class="block-title">页面</div>
      <ChartTheme
        :color-value="colorValue"
        @on-change-color="onChangeColor"
      />
    </div>
  </div>
</template>

<script>
import FilterIndex from './filter-index.vue'
import FilterFilter from './filter-filter.vue'
import { eventBus, eventBusType } from '@/utils/event-bus'
import { ChartTheme } from '@/components/common'
export default {
  name: 'FilterView',

  components: {
    FilterIndex,
    FilterFilter,
    ChartTheme
  },

  inject: ['chartInfo'],

  data() {
    return {
      colorValue: '16',
      colorList: ['#A05400', '#CC6B00', '#FF8905', '#FEA23C', '#FFC27E', '#FFDBB3', '#FFE9D0', '#FFF0E0']
    }
  },

  watch: {
    'chartInfo.data'(value) {
      const { dataJson } = value
      if (dataJson) {
        const data = JSON.parse(dataJson)

        this.colorValue = data?.setting?.colorValue || '16'
        this.colorList = data?.setting?.colorList || ['#A05400', '#CC6B00', '#FF8905', '#FEA23C', '#FFC27E', '#FFDBB3', '#FFE9D0', '#FFF0E0']

        this.onChangeColor({ colorValue: this.colorValue, colorList: this.colorList })
      }
    }
  },

  methods: {
    /**
    * @description: 修改颜色
     * @param {string} colorValue 当前颜色值
     * @param {array} colorList 颜色列表
     */
    onChangeColor({ colorValue, colorList }) {
      this.colorValue = colorValue
      eventBus.$emit(eventBusType.WORKSPACE_THEME, { colorValue, colorList })
    }
  }
}
</script>
<style lang="less" scoped>
.filter-view {
  display: flex;
  flex-direction: column;
  .filter-item {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 10px;
    height: 0;
    .filter-content {
      overflow: auto;
      flex: 1;
      height: 0;
    }
    & + .filter-item {
      border-top: 1px solid #E9E9E9;
    }
  }
}
</style>
