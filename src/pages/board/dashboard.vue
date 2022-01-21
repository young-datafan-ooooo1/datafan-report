<!--
 * @Description: 新建编辑看板
 * @Date: 2022-01-19 15:21:06
 * @LastEditTime: 2022-01-21 15:15:17
-->
<template>
  <div class="dashboard">
    <div class="dashboard-nav">
      <a-tabs v-model="activeNavTab" :tab-bar-style="{width: '100%'}">
        <a-tab-pane key="layout">
          <span slot="tab"><a-icon type="layout" />布局</span>
          <div class="tab-content">
            <Layout />
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
    <div class="dashboard-content">content</div>
  </div>
</template>

<script>
import { Layout, Chart } from './components'

export default {
  name: 'Dashboard',

  components: {
    Layout,
    Chart
  },

  data() {
    return {
      dashboardId: '',
      viewType: '',
      activeNavTab: 'layout'
    }
  },

  computed: {
    isAddDashboard() {
      return !this.dashboardId
    }
  },

  mounted() {
    const { dashboardId, viewType } = this.$route.query

    this.dashboardId = dashboardId
    this.viewType = viewType
  }
}
</script>

<style lang="less" scoped>
.dashboard {
  display: flex;
  height: 100%;
  background-color: #fff;
  border-radius: 6px;
  &-nav {
    border-right: 1px solid #dcdcdc;
    width: 350px;
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
    padding: 10px;
  }
}
</style>
