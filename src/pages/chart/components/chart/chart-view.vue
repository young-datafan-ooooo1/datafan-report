<!--
 * @Description: 图表视图
 * @Date: 2022-02-18 17:43:33
 * @LastEditTime: 2022-02-22 19:49:09
-->
<template>
  <div class="chart-view flex-box flex-box--column">
    <Axis class="flex-box-row-small" />
    <div class="chart-view-content flex-box-row-small" />
  </div>
</template>
<script>
import Axis from './chart-axis.vue'

export default {
  name: 'ChartView',

  components: {
    Axis
  }
}
</script>

<style lang="less" scoped>
.chart-view {
  height: 100%;
  &-content {
    flex: 1;
    height: 0;
    border-radius: 6px;
    background-color: #fff;
    box-shadow: 0 23px 44px 0 rgb(176 183 195 / 14%);
  }
}
</style>
