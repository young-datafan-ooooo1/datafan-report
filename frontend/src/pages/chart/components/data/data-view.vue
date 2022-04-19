<!--
 * @Description: 数据
 * @Date: 2022-02-18 17:42:32
 -->
<template>
  <div class="data-view">
    <a-input
      v-if="isSearch"
      v-model="searchMsg"
      class="flex-box-row-small"
      placeholder="请输入搜索内容"
    />
    <div class="dimension data-item flex-box-row-small">
      <div class="dimension-title flex-box flex-box--between-justify">
        <div class="block-title">维度</div>
        <div>
          <a-tooltip>
            <template #title>数据预览</template>
            <a-icon type="file-search" @click="onDataPreview" />
          </a-tooltip>
          <a-tooltip>
            <template #title>搜索</template>
            <a-icon type="search" :class="['dimension-search', { 'active': isSearch }]" @click="onSearchDataView" />
          </a-tooltip>
        </div>
      </div>
      <Draggable
        class="data-content"
        :list="dimensionFilted"
        :options="draggableOption"
        :clone="original => JSON.parse(JSON.stringify(original))"
      >
        <div v-for="item in dimensionFilted" :key="item.id" class="flex-box-row-mini">
          <a-tag color="#5b90a5"><a-icon :type="getIncoType(item.dateType)" /> {{ item.columnChinsesName }}</a-tag>
        </div>
      </Draggable>
    </div>
    <div class="data-item">
      <div class="block-title">度量</div>
      <Draggable
        class="data-content"
        :list="mertricFilted"
        :options="draggableOption"
        :clone="original => JSON.parse(JSON.stringify(original))"
      >
        <div v-for="item in mertricFilted" :key="item.id" class="flex-box-row-mini">
          <a-tag color="#54ac87"><a-icon type="number" /> {{ item.columnChinsesName }}</a-tag>
        </div>
      </Draggable>
    </div>
    <DataPreviewModal v-model="isShowDataPreviewModal" :config="dataPreviewConfig" />
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import DataPreviewModal from './data-preview-modal.vue'

export default {
  name: 'DataView',

  components: {
    Draggable,
    DataPreviewModal
  },

  inject: ['chartInfo'],

  data() {
    return {
      draggableOption: {
        group: { name: 'workspace', pull: 'clone', put: false },
        filter: '.undraggable',
        sort: false
      },
      dimension: [],
      mertric: [],
      isShowDataPreviewModal: false,
      dataPreviewConfig: {},
      isSearch: false,
      searchMsg: ''
    }
  },

  computed: {
    dimensionFilted() {
      return this.dimension.filter(item => item.columnChinsesName.includes(this.searchMsg))
    },
    mertricFilted() {
      return this.mertric.filter(item => item.columnChinsesName.includes(this.searchMsg))
    }
  },

  watch: {
    // 监听图表数据
    'chartInfo.data'(value) {
      console.log('watch')
      const { dimensionList: dimension, mertricList: mertric, datasourceDTO, reportTable } = value

      this.dimension = dimension
      this.mertric = mertric
      this.dataPreviewConfig = {
        rowListVOS: [],
        characterListVOS: [],
        filterListVOS: [],
        limits: 20,
        columnListVOS: [...dimension, ...mertric],
        datasourceVO: { ...datasourceDTO, tableName: reportTable }
      }
    }
  },

  methods: {
    /**
     * @description: 根据数据类型获得图标
     * @param {strign} dateType
     * @return {string} 图标type
     */
    getIncoType(dateType) {
      const dateTypeOption = {
        'Date': 'calendar',
        'Timestamp': 'schedule',
        'String': 'font-colors'
      }

      return dateTypeOption[dateType] || 'font-colors'
    },
    /**
     * @description: 数据预览
     */
    onDataPreview() {
      this.isShowDataPreviewModal = true
    },
    /**
     * @description: 搜索
     */
    onSearchDataView() {
      this.isSearch = !this.isSearch
      this.$nextTick(() => {
        if (!this.isSearch) {
          this.searchMsg = ''
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.data-view {
  display: flex;
  flex-direction: column;
  .dimension {
    &-search {
      margin-left: 5px;
      &.active {
        color: #ff794a;
      }
    }
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
      padding-top: 10px;
      height: 0;
    }
  }
  .data-item + .data-item {
    border-top: 1px solid #E9E9E9;
  }
}
</style>
