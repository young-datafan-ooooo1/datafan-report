<!--
 * @Description: 数据
 * @Date: 2022-02-18 17:42:32
 * @LastEditTime: 2022-02-18 18:57:08
-->
<template>
  <div class="data-view">
    <div class="dimension data-item">
      <div class="block-title">维度</div>
      <Draggable
        class="data-content"
        :list="dimension"
        :options="draggableOption"
      >
        <div v-for="item in dimension" :key="item.id">
          <a-tag color="#5b90a5">{{ item.columnChinsesName }}</a-tag>
        </div>
      </Draggable>
    </div>
    <div class="data-item">
      <div class="block-title">度量</div>
      <Draggable
        class="data-content"
        :list="mertric"
        :options="draggableOption"
      >
        <div v-for="item in mertric" :key="item.id">
          <a-tag color="#54ac87">{{ item.columnChinsesName }}</a-tag>
        </div>
      </Draggable>
    </div>
  </div>
</template>

<script>
import ChartApiServices from '@/services/chart'
import Draggable from 'vuedraggable'
export default {
  name: 'DataView',

  components: {
    Draggable
  },

  inject: ['type', 'id'],

  data() {
    return {
      draggableOption: {
        group: { name: 'workspace', pull: 'clone', put: false },
        filter: '.undraggable',
        sort: false
      },
      dimension: [],
      mertric: []
    }
  },

  computed: {
    isEdit() {
      return this.type === 'edit'
    }
  },

  mounted() {
    this.initPage()
  },

  methods: {
    /**
     * @description: 初始化页面
     */
    initPage() {
      this.getData()
    },
    /**
     * @description: 获取数据
     */
    getData() {
      if (this.isEdit) {
        this.getEditData()
      } else {
        this.getAddData()
      }
    },
    /**
     * @description: 获取编辑数据--也就是报表平台本身
     */
    getEditData() {
      const payload = {
        reportId: this.id
      }

      ChartApiServices.getChartDetail(payload).then(res => {
        const { data: { content: { dimensionList: dimension, mertricList: mertric }}} = res

        this.dimension = dimension
        this.mertric = mertric
      })
    },
    /**
     * @description: 获取新增数据--也就是探索平台本身
     */
    getAddData() {}
  }
}
</script>
<style lang="less" scoped>
.data-view {
  display: flex;
  flex-direction: column;
  .dimension {
  }
  .data-item {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 10px;
    height: 0;
    .data-content {
      overflow: auto;
      flex: 1;
      height: 0;
    }
  }
  .data-item + .data-item {
    border-top: 1px solid #E9E9E9;
  }
}
</style>
