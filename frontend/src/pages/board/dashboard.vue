<!--
 * @Description: 新建编辑看板
 * @Date: 2022-01-19 15:21:06
 -->
<template>
  <div class="dashboard-wrapper">
    <DBreadcrumb>
      <template slot="title">
        <DBreadcrumbItem to="/board">看板管理</DBreadcrumbItem>
        <DBreadcrumbItem>{{ title }}</DBreadcrumbItem>
      </template>
    </DBreadcrumb>
    <div class="flex-box flex-box__flex dashboard">
      <div class="dashboard-nav">
        <a-tabs v-model="activeNavTab" :tab-bar-style="{width: '100%'}">
          <a-tab-pane key="layout">
            <span slot="tab"><a-icon type="layout" />布局</span>
            <div class="tab-content">
              <Layout @onChangeColor="onColorChange" />
            </div>
          </a-tab-pane>
          <a-tab-pane key="chart">
            <span slot="tab"><a-icon type="bar-chart" />图表</span>
            <div class="tab-content">
              <Chart />
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
      <Content class="dashboard-content" :theme-colors="themeColors" />
    </div>
  </div>
</template>

<script>
import { Layout, Chart, Content } from './components'

export default {
  name: 'Dashboard',

  components: {
    Layout,
    Chart,
    Content
  },

  provide() {
    return {
      dashboardId: this.$route.query.dashboardId,
      viewType: this.$route.query.viewType,
      themeColors: this.themeColors
    }
  },

  data() {
    return {
      activeNavTab: 'layout',
      themeColors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c3', '#7f7f7f', '#bdbd22', '#17bdcf']
    }
  },

  computed: {
    title() {
      const viewType = this.$route.query.viewType

      return ['edit'].includes(viewType) ? '看板详情' : '新建看板'
    }
  },

  mounted() {
  },

  methods: {
    onColorChange(themeColors) {
      this.themeColors = [...themeColors]
    }
  }
}
</script>

<style lang="less" scoped>
.dashboard-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  .dashboard {
    display: flex;
    height: 0;
    border-radius: 6px;
    &-nav {
      margin-right: 20px;
      width: 350px;
      border: 1px solid #EAEFF0;
      border-radius: 6px;
      background-color: #fff;
      box-shadow: 0 23px 44px 0 rgb(176 183 195 / 14%);
      /deep/ .ant-tabs {
        height: 100%;
        .ant-tabs-nav {
          width: 100%;
          .ant-tabs-tab {
            width: calc(50% - 16px);
            text-align: center;
          }
        }
        .ant-tabs-content {
          height: calc(100% - 60px);
          .tab-content {
            height: 100%;
          }
        }
      }
    }
    &-content {
      flex: 1;
      padding: 0 10px;
      width: 0;
      border: 1px solid #EAEFF0;
      border-radius: 6px;
      background-color: #fff;
      box-shadow: 0 23px 44px 0 rgb(176 183 195 / 14%);
    }
  }
}
</style>
