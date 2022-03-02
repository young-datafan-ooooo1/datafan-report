<template>
  <page-toggle-transition
    class="blank-view"
    :disabled="animate.disabled"
    :animate="animate.name"
    :direction="animate.direction"
  >
    <router-view />
  </page-toggle-transition>
</template>

<script>
import PageToggleTransition from '../components/transition/PageToggleTransition'
import { mapState } from 'vuex'

export default {
  name: 'BlankView',
  components: { PageToggleTransition },
  computed: {
    ...mapState('setting', ['multiPage', 'animate'])
  }
}
</script>

<style scoped lang="less">
  .blank-view {
    position: relative;
    padding: 20px;
    height: 100% ;
    background-color: #f4f5f7;
    &.head.fixed{
      margin: 0 auto;
      width: 1400px;
    }
  }
  /deep/ .block-title {
    display: flex;
    align-items: center;
    &.border {
      padding-bottom: 5px;
      border-bottom: 1px solid #E9E9E9;
    }
    &::before {
      margin-right: 8px;
      width: 4px;
      height: 18px;
      border-radius: 2px;
      background: #F36F4E;
      content: '';
    }
  }
  // 加载样式
  /deep/.common-spin {
    height: 100%;
    .ant-spin-container {
      width: 100%;
    }
  }
  /deep/.common-move {
    cursor: move;
  }
  /deep/ .ant-tabs-card.common-tabs {
    /* 选项卡区域 */
    .ant-tabs-bar {
      margin-bottom: 0;
      .ant-tabs-tab {
        margin-top: 10px;
        width:120px;
        height: 60px;
        border-radius: 6px;
        background-image: linear-gradient(180deg, #F8F8F8 0%, #F8F8F8 40.25%, #EEEEEE 58.33%);
        box-shadow: 2px -2px 12px 0px rgba(0, 0, 0, 0.06);
        text-align:center;
      }
      .ant-tabs-tab-active {
        margin-top: 10px;
        height: 60px;
        border-color: #fff;
        background: #fff;
        box-shadow: 2px -2px 12px 0px rgba(0, 0, 0, 0.06);
      }
    }
    .ant-tabs-card-bar {
      .ant-tabs-nav-container {
        height: 48px;
      }
    }
    /* 内容区域 */
    .ant-tabs-content {
      .ant-tabs-tabpane {
        background: transparent;
      }
    }
    .ant-tabs-tabpane-active {
      overflow: visible;
      border-radius: 0 6px 6px 6px;
      background: #fff !important;
      box-shadow: 0px 23px 40px 0px rgba(54, 57, 60, 0.1);
    }
    //包群导航、目录导航长度
    .navigation-tabs {
      .ant-tabs-bar {
        overflow: hidden;
        height:38px;
        border-bottom:none;
        .ant-tabs-tab {
          margin-top: 0;
          width: 50%
        }
        .ant-tabs-tab-active {
          width: 50%
        }
      }
    }
  }
  /deep/ .common-loading {
    width: 100%;
    height: 100%;
    .ant-spin-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  }
</style>
