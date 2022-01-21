<!--
 * @Description: 新增/编辑看板布局
 * @Date: 2022-01-19 16:40:06
 * @LastEditTime: 2022-01-21 15:49:58
-->
<template>
  <div class="dashborad-layout">
    <div class="dashborad-grid flex-box-row">
      <span class="block-title flex-box-row">行列布局</span>
      <Draggable class="grid-box flex-box-row" :list="gridData" :options="draggableOption" @start="handleDragRow" @end="hanDragRowEnd">
        <a-row v-for="(grid, gridIndex) in gridData" :key="gridIndex" class="grid-item flex-box-row common-move">
          <template v-for="(item, itemIndex) in grid.items">
            <a-col :key="itemIndex" :span="item.width">
              <div class="dashborad-grid--full" />
            </a-col>
          </template>
        </a-row>
      </Draggable>
    </div>
    <div class="dashborad-border flex-box-row">
      <span class="block-title flex-box-row">分割线</span>
      <Draggable class="border-box flex-box-row" :list="borderData" :options="draggableOption" @start="handleDragRow" @end="hanDragRowEnd">
        <template v-for="(border, borderIndex) in borderData">
          <div :key="borderIndex" :class="['border-item', 'common-move', `${border.type}-type`]" />
        </template>
      </Draggable>
    </div>
    <div class="dashborad-title flex-box-row">
      <span class="block-title">标题</span>
      <Draggable class="title-box" :list="titleData" :options="draggableOption" @start="handleDragRow" @end="hanDragRowEnd">
        <template v-for="(title, titleIndex) in titleData">
          <div :key="titleIndex" :class="['title-item', 'common-move']" :style="getTitleStyle(title)">ABCDEF...</div>
        </template>
      </Draggable>
    </div>
    <div class="dashborad-color flex-box-row">
      <span class="block-title flex-box-row">配色方案</span>
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
            <div :key="themeIndex" :class="['theme-item', 'flex-box-col-small', theme.theme, {active: colorType === theme.theme}]" @click="colorType = theme.theme" />
          </a-popover>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'

export default {
  name: 'Layout',

  components: {
    Draggable
  },

  data() {
    return {
      draggableOption: {
        group: { name: 'article', pull: 'clone', put: false },
        filter: '.undraggable',
        sort: false
      },
      gridData: [
        {
          type: 'grid',
          items: [{ width: 16 }, { width: 8 }]
        },
        {
          type: 'grid',
          items: [{ width: 12 }, { width: 12 }]
        },
        {
          type: 'grid',
          items: [{ width: 8 }, { width: 8 }, { width: 8 }]
        },
        {
          type: 'grid',
          items: [{ width: 24 }]
        }
      ],
      borderData: [
        { type: 'solid' },
        { type: 'dashed' },
        { type: 'dotted' }
      ],
      titleData: [
        {
          type: 'title',
          fontSize: 24,
          fontWeight: 700,
          color: '#000'
        }
      ],
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
    getTitleStyle(title) {
      const { color, fontSize, fontWeight } = title

      return {
        color,
        fontSize: `${fontSize}px`,
        fontWeight
      }
    },
    handleDragRow(event, row) {
      // this.$emit("drag-row-start", event, row);
    },
    hanDragRowEnd(event, row) {

    },

    getColorBlock() {
      return `<div class="color-item" style="background: red" />`
    }
  }
}
</script>
<style lang="less" scoped>
.dashborad-layout {
  overflow: auto;
  padding: 0 10px;
  height: 100%;
  .dashborad-grid {
    .grid-box {
      .grid-item {
        .dashborad-grid--full {
          height: 33px;
          border: 1px solid #eee;
        }
      }
    }
  }
  .dashborad-border {
    margin-right: 10px;
    .border-box {
      .border-item {
        margin-top: 10px;
        padding-bottom: 10px;
        width: 100%;
        height: 2px;
        border-width: 2px 0 0;
        border-color: #dcdcdc;
        &.solid-type {
          border-style: solid;
        }
        &.dashed-type {
          border-style: dashed;
        }
        &.dotted-type {
          border-style: dotted;
        }
      }
    }
  }
  .dashborad-color {
    .theme-box {
      display: flex;
      align-items: center;
      .theme-item {
        width: 26px;
        height: 26px;
        border-radius: 2px;
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
