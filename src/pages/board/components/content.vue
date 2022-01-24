<!--
 * @Description: 内容
 * @Date: 2022-01-21 16:27:42
 * @LastEditTime: 2022-01-24 15:52:34
-->
<template>
  <div class="content-container">
    <div class="title flex-box-row">
      <a-icon type="fullscreen" />
      <span class="msg">{{ dashboardInfo.dashboardName || '请输入看板名称' }}</span>
      <a-icon type="fullscreen" />
    </div>
    <Draggable
      class="container flex-box-row"
      :list="contentData"
      :options="{group:'layout', disabled: disabled}"
    >
      <div
        v-for="(item, index) in contentData"
        :key="index"
        class="container-item flex-box-row"
      >
        <div v-if="item.type === 'grid'" class="grid-box flex-box flex-box--center-items flex-box-row">
          <div class="delete-icon">
            <a-icon type="delete" @click="onDelectContent(index)" />
          </div>
          <a-row class="flex-box__flex flex-box-row common-move">
            <template v-for="(item, itemIndex) in item.items">
              <a-col :key="itemIndex" :span="item.width">
                <Draggable :list="item.content" :options="{ group: 'chart' }" class="dashborad-grid--full" @add="onAddChart(item)">
                  <template v-for="(chartItem, chartIndex) in item.content">
                    <div :key="chartIndex">
                      {{ chartItem.reportTitle }}
                    </div>
                  </template>
                </Draggable>
              </a-col>
            </template>
          </a-row>
        </div>

        <div v-if="item.type === 'border'" class="border-box flex-box flex-box--center-items flex-box-row">
          <div class="delete-icon">
            <a-icon type="delete" @click="onDelectContent(index)" />
          </div>
          <div :class="['border-item', 'common-move', `${item.value}-type`]" />
        </div>

        <div v-if="item.type === 'title'" class="title-box flex-box flex-box--center-items flex-box-row">
          <div class="delete-icon">
            <a-icon type="delete" @click="onDelectContent(index)" />
          </div>
          <div class="title-content">
            <span class="msg flex-box-col-small" :style="getTitleStyle(item)">新标题</span>
            <colorPicker v-model="item.color" class="color flex-box-col-small" />
            <a-input-number v-model="item.fontSize" class="size flex-box-col-small" />
          </div>
        </div>
      </div>
    </Draggable>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import DashboardApiServices from '@/services/dashboard'
import ChartApiServices from '@/services/chart'

export default {
  name: 'Content',

  components: {
    Draggable
  },

  inject: ['dashboardId', 'viewType'],

  data() {
    return {
      loading: false,
      contentData: [],
      dashboardInfo: {},
      disabled: false
    }
  },
  computed: {
    isAddDashboard() {
      return !this.dashboardId
    }
  },

  mounted() {
    this.initPage()
  },

  methods: {
    initPage() {
      this.dashboardId && this.getDashboardDetail()
    },

    getDashboardDetail() {
      const payload = {
        dashboardId: this.dashboardId
      }

      this.loading = true
      DashboardApiServices.getDashboardDetailInfo(payload).then(res => {
        this.dashboardInfo = res.data.content
      }).finally(() => {
        this.loading = false
      })
    },

    onDelectContent(index) {
      this.contentData.splice(index, 1)
    },
    getTitleStyle(title) {
      const { color, fontSize, fontWeight } = title

      return {
        color,
        fontSize: `${fontSize}px`,
        fontWeight
      }
    },
    onAddChart(item) {
      const { content: [chart] } = item
      const { charact: charater, datasourceId, querySql, row: rowList, column } = chart
      const payload = {
        charater,
        datasourceId,
        querySql,
        rowList,
        column
      }

      ChartApiServices.getChartDetailInfo(payload).then(res => {
        // debugger
      })
    }
  }
}
</script>
<style lang="less" scoped>
.content-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
    border-bottom: 1px solid #dcdcdc;
    .msg {
      font-weight: bold;
      font-size: 20px;
    }
  }
  .container {
    overflow: auto;
    flex: 1;
    height: 0;
    .container-item {
      .delete-icon {
        width: 20px;
        color: #869399;
        cursor: pointer;
        & > i {
          display: none;
        }
      }
      &:hover {
        .delete-icon {
          & > i {
            display: flex;
          }
        }
      }
      .grid-box {
        .dashborad-grid--full {
          height: 420px;
          border: dashed #eee;
          border-width: 2px 1px;
        }
      }
      .border-box {
        .border-item {
          margin-top: 10px;
          padding-bottom: 10px;
          width: 100%;
          height: 2px;
          border-width: 2px 0 0;
          border-color: #dcdcdc;
          &.solid-type {
            border-style: solid;
          }
          &.dashed-type {
            border-style: dashed;
          }
          &.dotted-type {
            border-style: dotted;
          }
        }
      }
      .title-box {
        .title-content {
          display: flex;
          align-items: center;
          flex: 1;
          padding: 10px 0;
          border-width: 1px;
          border-style: dashed;
          border-color: transparent;
          .color {
            /deep/.box {
              width: 220px;
              &.open {
                z-index: 1;
              }
            }
          }
          .color,.size {
            display: none;
          }
          &:hover {
            border-color:#dcdcdc;
            .color,.size {
              display: flex;
            }
          }
        }
      }
    }
  }
}
</style>
