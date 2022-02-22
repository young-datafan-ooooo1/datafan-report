<!--
 * @Description: 数据
 * @Date: 2022-02-18 17:42:32
 * @LastEditTime: 2022-02-21 15:12:51
-->
<template>
  <div class="data-view">
    <div class="dimension data-item">
      <div class="dimension-title flex-box flex-box--between-justify">
        <div class="block-title">维度</div>
        <div>
          <a-icon type="file-search" @click="onDataPreview" />
        </div>
      </div>
      <Draggable
        class="data-content"
        :list="dimension"
        :options="draggableOption"
        :clone="original => JSON.parse(JSON.stringify(original))"
      >
        <div v-for="item in dimension" :key="item.id" class="flex-box-row-mini">
          <a-tag color="#5b90a5"><a-icon :type="getIncoType(item.dateType)" /> {{ item.columnChinsesName }}</a-tag>
        </div>
      </Draggable>
    </div>
    <div class="data-item">
      <div class="block-title">度量</div>
      <Draggable
        class="data-content"
        :list="mertric"
        :options="draggableOption"
        :clone="original => JSON.parse(JSON.stringify(original))"
      >
        <div v-for="item in mertric" :key="item.id" class="flex-box-row-mini">
          <a-tag color="#54ac87"><a-icon type="number" /> {{ item.columnChinsesName }}</a-tag>
        </div>
      </Draggable>
    </div>
    <DataPreviewModal v-model="isShowDataPreviewModal" :config="dataPreviewConfig" />
  </div>
</template>

<script>
import ChartApiServices from '@/services/chart'
import Draggable from 'vuedraggable'
import DataPreviewModal from './data-preview-modal.vue'

export default {
  name: 'DataView',

  components: {
    Draggable,
    DataPreviewModal
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
      mertric: [],
      isShowDataPreviewModal: false,
      dataPreviewConfig: {}
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
        const { data: { content: { dimensionList: dimension, mertricList: mertric, datasourceDTO, reportTable }}} = res

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
      })
    },
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
      padding-top: 10px;
      height: 0;
    }
  }
  .data-item + .data-item {
    border-top: 1px solid #E9E9E9;
  }
}
</style>
