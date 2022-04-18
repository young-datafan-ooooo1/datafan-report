<!--
 * @Description:页面面包屑组件
 * @Date: 2021-11-17 11:10:35
 -->
<template>
  <div class="page-title-container">
    <div class="page-title">
      <a-breadcrumb>
        <span slot="separator"> > </span>
        <a-breadcrumb-item v-for="(item, index) in titleList" :key="index">
          {{ item.name }}
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <!--新建按钮插槽-->
    <div class="page-operation">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  name: 'PageBreadcrumb',
  props: {
    // 面包屑数组
    titleList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {

    }
  }
}
</script>
<style lang="less" scoped>
.page-title-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 22px;
  font-weight: 400;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  .page-title{
    display: flex;
    align-items: center;
    /deep/  .ant-breadcrumb > span:last-child {
              color: #F36F4E
            }
    /deep/  .ant-breadcrumb {
              color: black;
              font-size: 16px;
            }
    /deep/  .ant-breadcrumb-separator {
              margin: 0 5px;
              color: #F36F4E;
            }
    &::before {
      margin-right: 12px;
      width: 3px;
      height: 16px;
      border-radius: 1px;
      background-color: #F36F4E;
      content:''
    }
  }
}
</style>
