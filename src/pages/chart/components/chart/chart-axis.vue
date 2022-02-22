<!--
 * @Description: 图表轴
 * @Date: 2022-02-22 19:20:19
 * @LastEditTime: 2022-02-22 19:46:59
-->
<template>
  <div class="axis-box">
    <div class="column axis-item flex-box-row-small">
      <div class="axis-label">
        <a-icon type="menu" class="flex-box-col-small need-turn" />
        <span class="flex-box-col-small">列</span>
        <a-tooltip>
          <template slot="title">
            <div>列的功能：</div>
            <div>1、在透视表中，将列的数据打横放在第一行，从左到右依次排开展示。</div>
            <div>2、在其他图表中，列数据会放在每个图的X坐标。</div>
          </template>
          <a-icon type="question-circle" class="flex-box-col-small" />
        </a-tooltip>
      </div>
    </div>
    <div class="row axis-item flex-box-row-small">
      <div class="axis-label">
        <a-icon type="menu" class="flex-box-col-small" />
        <span class="flex-box-col-small">行</span>
        <a-tooltip>
          <template slot="title">
            <div>行的功能</div>
            <div>1、在透视表中，将行的数据放在第一列，从上到下依次排开展示。</div>
            <div>2、在其他图表中，行数据会吧图拆分多个图。</div>
          </template>
          <a-icon type="question-circle" class="flex-box-col-small" />
        </a-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Axis'
}
</script>

<style lang="less" scoped>
.axis-box {
  display: flex;
  flex-direction: column;
  .axis-item {
    display: flex;
    align-items: center;
    min-height: 40px;
    border: 1px solid #E9E9E9;
    background-color: #fff;
    box-shadow: 0 23px 44px 0 rgb(176 183 195 / 14%);
    .axis-label {
      display: flex;
      align-items: center;
      padding: 0 10px;
      height: 100%;
      border-right: 1px solid #E9E9E9;
      .need-turn {
        transform: rotate(90deg);
      }
    }
  }
}
</style>
