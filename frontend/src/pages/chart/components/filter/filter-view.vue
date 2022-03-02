<!--
 * @Description: 筛选
 * @Date: 2022-02-18 17:43:01
 * @LastEditTime: 2022-02-28 14:34:08
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

      <div class="theme-box flex-box-row">
        <template v-for="(theme, themeIndex) in colorData">
          <a-popover :key="themeIndex">
            <template slot="content">
              <div class="color-box">
                <template v-for="(color, colorIndex) in theme.colors">
                  <div :key="colorIndex" class="color-item" :style="`background: ${color}`" />
                </template>
              </div>
            </template>
            <div :key="themeIndex" :class="['theme-item', 'flex-box-col-small', theme.theme, {active: colorType === theme.theme}]" @click="onChangeColor(theme.theme, theme.colors)" />
          </a-popover>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import FilterIndex from './filter-index.vue'
import FilterFilter from './filter-filter.vue'
import { eventBus, eventBusType } from '@/utils/event-bus'

export default {
  name: 'FilterView',

  components: {
    FilterIndex,
    FilterFilter
  },

  data() {
    return {
      colorData: [
        {
          theme: 'one',
          colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c3', '#7f7f7f', '#bdbd22', '#17bdcf']
        },
        {
          theme: 'two',
          colors: ['#3366cc', '#dc3a12', '#ff9900', '#109619', '#990099', '#0098c6', '#dd4477', '#66aa00', '#b82e2e', '#316395']
        },
        {
          theme: 'three',
          colors: ['#9ecae1', '#fdaf6b', '#a1d99b', '#bcbddc', '#bdbdbd']
        }
      ],
      colorType: 'one'
    }
  },
  methods: {
    onChangeColor(colorType, colorList) {
      this.colorType = colorType
      eventBus.$emit(eventBusType.WORKSPACE_THEME, colorList)
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

.theme-box {
  display: flex;
  align-items: center;
  margin-top: 10px;
  .theme-item {
    width: 26px;
    height: 26px;
    border-radius: 2px;
    cursor: pointer;
    &.one {
      background: linear-gradient(135deg, #1f77b4 0%, #1f77b4 50%, #ff7f0e 51%, #ff7f0e 100%);
    }
    &.two {
      background: linear-gradient(135deg, #3366cc 0%, #3366cc 50%, #dc3a12 51%, #dc3a12 100%);
    }
    &.three {
      background: linear-gradient(135deg, #9ecae1 0%, #9ecae1 50%, #fdaf6b 51%, #fdaf6b 100%);
    }
    &.active {
      border: #e43c59 2px solid;
    }
  }
}
.color-box {
  display: flex;
  align-items: center;
  .color-item {
    margin-right: 5px;
    width: 10px;
    height: 10px;
  }
}
</style>
