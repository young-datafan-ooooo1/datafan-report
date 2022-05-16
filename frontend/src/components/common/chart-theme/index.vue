<template>
  <div class="theme-box">
    <div class="flex-box flex-box--wrap">
      <template v-for="(theme, themeIndex) in complexColorData">
        <a-popover :key="themeIndex">
          <template slot="content">
            <div class="color-box">
              <template v-for="(color, colorIndex) in theme.colors">
                <div :key="colorIndex" class="color-item" :style="`background: ${color}`" />
              </template>
            </div>
          </template>
          <div
            :key="themeIndex"
            :class="['theme-item', {active: colorValue === theme.value}]"
            :style="getThemeItemStyle(theme)"
            @click="onChangeColor(theme.value, theme.colors)"
          />
        </a-popover>
      </template>
    </div>
    <div class="flex-box flex-box--wrap">
      <template v-for="(theme, themeIndex) in singleColorData">
        <a-popover :key="themeIndex">
          <template slot="content">
            <div class="color-box">
              <template v-for="(color, colorIndex) in theme.colors">
                <div :key="colorIndex" class="color-item" :style="`background: ${color}`" />
              </template>
            </div>
          </template>
          <div
            :key="themeIndex"
            :class="['theme-item', {active: colorValue === theme.value}]"
            :style="getThemeItemStyle(theme)"
            @click="onChangeColor(theme.value, theme.colors)"
          />
        </a-popover>
      </template>
    </div>
  </div>
</template>

<script>
import {
  COLOR_DATA
} from './color.data'
export default {
  name: 'ChartTheme',

  props: {
    colorValue: {
      type: String,
      default: '16'
    }
  },

  data() {
    return {
      colorData: COLOR_DATA
    }
  },

  computed: {
    complexColorData() {
      return this.colorData.filter(item => item.type === 'complex')
    },
    singleColorData() {
      return this.colorData.filter(item => item.type === 'single')
    }
  },

  methods: {
    getThemeItemStyle(theme) {
      const { type, colors } = theme
      const isComplex = ['complex'].includes(type)
      const isSingle = ['single'].includes(type)
      let first
      let second
      if (isComplex) {
        [first, second] = colors

        return {
          background: `linear-gradient(135deg, ${first} 0%, ${first} 50%, ${second} 51%, ${second} 100%)`
        }
      } else if (isSingle) {
        [first] = colors;
        [second] = [...colors].reverse()
        return {
          background: `linear-gradient(135deg, ${first}, ${second})`
        }
      }
    },
    /**
     * @description: 修改颜色
     * @param {string} colorValue 当前颜色值
     * @param {array} colorList 颜色列表
     */
    onChangeColor(colorValue, colorList) {
      this.$emit('on-change-color', { colorValue, colorList })
    }
  }
}
</script>

<style lang="less" scoped>
.theme-box {
  overflow: auto;
  margin-top: 10px;
  height: 100%;
  .theme-item {
    margin: 5px;
    width: 26px;
    height: 26px;
    border-radius: 2px;
    cursor: pointer;
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
