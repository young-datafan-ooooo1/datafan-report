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
              <Layout :color-list="colorList" :color-value="colorValue" @onChangeColor="onColorChange" />
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
      <Content class="dashboard-content" :color-list="colorList" :color-value="colorValue" />
    </div>
  </div>
</template>

<script>
import {
  GET_COLOR_LIST
} from '@/components/common/chart-theme/color.data'
import DashboardApiServices from '@/services/dashboard'
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
      viewType: this.$route.query.viewType
    }
  },

  data() {
    return {
      colorValue: '16',
      activeNavTab: 'layout',
      colorList: ['#A05400', '#CC6B00', '#FF8905', '#FEA23C', '#FFC27E', '#FFDBB3', '#FFE9D0', '#FFF0E0']
    }
  },

  computed: {
    title() {
      const viewType = this.$route.query.viewType

      return ['edit'].includes(viewType) ? '看板详情' : '新建看板'
    }
  },

  mounted() {
    this.getDashboardDetail()
  },

  methods: {
    onColorChange({ colorValue, colorList }) {
      this.colorValue = colorValue
      this.colorList = [...colorList]
    },
    getDashboardDetail() {
      const payload = {
        dashboardId: this.$route.query.dashboardId
      }

      DashboardApiServices.getDashboardDetailInfo(payload).then(res => {
        const { setting } = res.data.content
        if (setting) {
          const settingObj = JSON.parse(setting)
          this.colorValue = settingObj?.colorValue || '16'
          this.colorList = GET_COLOR_LIST(this.colorValue)
        }
        this.contentData = JSON.parse(res.data.content.queryData)

        this.$nextTick(() => {
          if (this.contentData.length) {
            this.contentData.forEach(item => {
              if (item.type === 'grid') {
                item.items.forEach(gridItem => {
                  if (gridItem.chartContent.length) {
                    this.drawChart(gridItem)
                  }
                })
              }
            })
          }
        })
      })
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
