<!--
 * @Description: 图表工作台
 * @Date: 2022-02-18 16:47:33
 * @LastEditTime: 2022-02-18 18:16:07
-->
<template>
  <div class="workspace flex-box flex-box--column">
    <div class="workspace-title workspace-block flex-box flex-box--center-items flex-box--between-justify flex-box-row-small">
      <div class="block-title">报表分析工具</div>
      <div class="chart-switch-box">
        <a-icon type="fullscreen" />
      </div>
    </div>
    <div class="workspace-content flex-box flex-box-row-small">
      <DataView class="workspace-content-data workspace-block flex-box-col-small" />
      <FilterView class="workspace-content-filter workspace-block flex-box-col-small" />
      <ChartView class="workspace-content-chart workspace-block flex-box-col-small" />
    </div>
  </div>
</template>

<script>
import {
  DataView,
  FilterView,
  ChartView
} from './components'

export default {
  name: 'Workspace',

  components: {
    DataView,
    FilterView,
    ChartView
  },

  provide() {
    return {
      id: this.$route.query.id,
      type: this.$route.query.type
    }
  },

  data() {
    return {

    }
  },

  methods: {

  }
}
</script>

<style lang="less" scoped>
  .workspace {
    padding: 0;
    height: 100%;
    &-title {
      padding: 0 10px;
      height: 40px;
      border-bottom: 1px solid #E9E9E9;
    }
    &-content {
      flex: 1;
      height: 0;
      &-data, &-filter {
        width: 260px;
      }
      &-chart {
        flex: 1;
        width: 0;
      }
    }

    &-block {
      border-radius: 6px;
      background-color: #fff;
      box-shadow: 0 23px 44px 0 rgb(176 183 195 / 14%);
    }
  }
</style>
