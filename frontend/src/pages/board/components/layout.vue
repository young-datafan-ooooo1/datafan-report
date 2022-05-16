<!--
 * @Description: 新建/编辑看板布局
 * @Date: 2022-01-19 16:40:06
 -->
<template>
  <div class="dashborad-layout">
    <div class="dashborad-grid flex-box-row">
      <span class="block-title flex-box-row">行列布局</span>
      <Draggable
        class="grid-box flex-box-row"
        :list="gridData"
        :options="draggableOption"
        :clone="original => JSON.parse(JSON.stringify(original))"
      >
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
      <Draggable class="border-box flex-box-row" :list="borderData" :options="draggableOption">
        <template v-for="(border, borderIndex) in borderData">
          <div :key="borderIndex" :class="['border-item', 'common-move', `${border.value}-type`]" />
        </template>
      </Draggable>
    </div>
    <div class="dashborad-title flex-box-row">
      <span class="block-title">标题</span>
      <Draggable
        class="title-box"
        :list="titleData"
        :options="draggableOption"
        :clone="original => JSON.parse(JSON.stringify(original))"
      >
        <template v-for="(title, titleIndex) in titleData">
          <div :key="titleIndex" :class="['title-item', 'common-move']" :style="getTitleStyle(title)">ABCDEF...</div>
        </template>
      </Draggable>
    </div>
    <div class="dashborad-color flex-box-row">
      <span class="block-title flex-box-row">配色方案</span>
      <ChartTheme
        :color-value="colorValue"
        @on-change-color="onChangeColor"
      />
    </div>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import { ChartTheme } from '@/components/common'

export default {
  name: 'Layout',

  components: {
    Draggable,
    ChartTheme
  },

  props: {
    colorValue: {
      type: String,
      default: '16'
    }
  },

  data() {
    return {
      draggableOption: {
        group: { name: 'layout', pull: 'clone', put: false },
        filter: '.undraggable',
        sort: false
      },
      gridData: [
        {
          type: 'grid',
          items: [
            { width: 16, chartContent: [], loading: false, id: '1-1' },
            { width: 8, chartContent: [], loading: false, id: '1-2' }
          ]
        },
        {
          type: 'grid',
          items: [
            { width: 12, chartContent: [], loading: false, id: '2-1' },
            { width: 12, chartContent: [], loading: false, id: '2-2' }
          ]
        },
        {
          type: 'grid',
          items: [
            { width: 8, chartContent: [], loading: false, id: '3-1' },
            { width: 8, chartContent: [], loading: false, id: '3-2' },
            { width: 8, chartContent: [], loading: false, id: '3-3' }
          ]
        },
        {
          type: 'grid',
          items: [{ width: 24, chartContent: [], loading: false, id: '4-1' }]
        }
      ],
      borderData: [
        { type: 'border', value: 'solid' },
        { type: 'border', value: 'dashed' },
        { type: 'border', value: 'dotted' }
      ],
      titleData: [
        {
          type: 'title',
          fontSize: 24,
          fontWeight: 700,
          color: '#000',
          name: '新标题'
        }
      ]
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
    onChangeColor({ colorValue, colorList }) {
      this.$emit('onChangeColor', { colorValue, colorList })
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
          border: 1px solid #dcdcdc;
          border-radius: 3px;
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
}
</style>
