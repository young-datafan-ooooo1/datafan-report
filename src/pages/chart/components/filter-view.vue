<!--
 * @Description: 筛选
 * @Date: 2022-02-18 17:43:01
 * @LastEditTime: 2022-02-18 18:08:05
-->
<template>
  <div class="filter-view">
    <div class="dimension filter-item">
      <div class="block-title">指标</div>
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
export default {
  name: 'FilterView'
}
</script>
<style lang="less" scoped>
.filter-view {
  display: flex;
  flex-direction: column;
  .filter-item {
    flex: 1;
    padding: 10px;
    height: 0;
    & + .filter-item {
      border-top: 1px solid #E9E9E9;
    }
  }
}
</style>
