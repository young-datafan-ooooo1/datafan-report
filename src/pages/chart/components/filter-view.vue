<!--
 * @Description: 筛选
 * @Date: 2022-02-18 17:43:01
 * @LastEditTime: 2022-02-21 15:41:48
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
    </div>
    <div class="filter-item">
      <div class="block-title">页面</div>
    </div>
  </div>
</template>

<script>
import FilterIndex from './filter-index.vue'

export default {
  name: 'FilterView',

  components: {
    FilterIndex
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
