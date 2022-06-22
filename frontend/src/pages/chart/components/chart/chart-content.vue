<!--
 * @Description: 图表内容
 * @Date: 2022-02-23 14:41:04
-->
<template>
  <div class="chart-content">
    <a-spin :spinning="chartLoading" class="common-loading">
      <div class="chart-handle flex-box flex-box--between-justify flex-box--center-items flex-box-row-small">
        <div class="handle-box">
          <a-button
            class="search-btn flex-box-col"
            type="primary"
            :disabled="isDisabledSearch"
            @click="onSearch"
          >查询</a-button>
          <a-button
            class="search-btn flex-box-col"
            type="primary"
            :disabled="isDisabledSearch"
            @click="onSave"
          >保存</a-button>
          <a-button
            class="search-btn flex-box-col"
            type="primary"
            :disabled="isDisabledSearch"
            @click="onShowSaveAsModal"
          >另存为</a-button>
        </div>
        <ModifyInput
          v-model="reportInfo.reportTittle"
          @on-change="onModifyReportName"
        />
        <div class="down-btn">
          <a-icon
            v-if="isShowDownloadBtn"
            type="download"
            @click="onDownload"
          />
        </div>
      </div>
      <div class="chart-content-chart flex-box-row-small">
        <DTable
          v-if="isTwoDimensionalTable"
          ref="dtable"
          v-bind="{
            ...chartConfig
          }"
          :data="chartData"
          border
          size="small"
          hide-pager
          height="auto"
        />
        <div v-else-if="chartType === 'Multidimensional'" ref="PivotTable" class="chart-view multi-table pivot-table-contain">
          <template v-for="(metrics, metricsIndex) in metricsList">
            <PivotTable
              :key="metricsIndex"
              :data="chartData"
              v-bind="{
                ...chartConfig
              }"
              :reducer="getReducer(metrics)"
            />
          </template>
        </div>
        <div v-else class="chart-view chart">
          <ve-chart
            :colors="colorList"
            :data="veChartData"
            v-bind="{
              ...chartConfig
            }"
            height="100%"
          />
        </div>
      </div>
    </a-spin>
    <a-base-modal
      v-model="isShowSaveAsModal"
      class="save-as-modal"
      title="另存为"
      width="500px"
      @cancel="onSaveAsCancel"
      @ok="onSaveAsOk"
    >
      <a-form-model
        ref="saveAsForm"
        :model="saveAsForm"
        :rules="saveAsRules"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-model-item ref="name" label="图表名称" prop="name">
          <a-input v-model="saveAsForm.name" />
        </a-form-model-item>
      </a-form-model>
    </a-base-modal>
  </div>
</template>

<script>
import { eventBus, eventBusType } from '@/utils/event-bus'
import ChartApiServices from '@/services/chart'
import { PivotTable } from '@click2buy/vue-pivot-table'
import { CHART_OPTION } from '../../workspace.data'
import { ModifyInput } from '@/components/common'

export default {
  name: 'ChartContent',

  components: {
    PivotTable,
    ModifyInput
  },

  inject: ['chartInfo'],

  data() {
    const validateName = (rule, value, callback) => {
      if (value) {
        const payload = {
          reportTittle: value
        }
        ChartApiServices.onCheckReportName(payload).then(res => {
          if (res.data.content) {
            callback(new Error('图表名称已存在'))
          } else {
            callback()
          }
        })
      } else {
        callback()
      }
    }
    return {
      workspacePayload: {},
      chartData: [],
      chartLoading: false,
      // 默认配色
      colorList: ['#A05400', '#CC6B00', '#FF8905', '#FEA23C', '#FFC27E', '#FFDBB3', '#FFE9D0', '#FFF0E0'],
      colorValue: '16',
      chartOption: CHART_OPTION,
      chartConfig: {},
      reportInfo: '',
      querySqlNoLimit: '',
      isShowDownloadBtn: false,
      escatReportId: '',
      stepFields: [],
      isShowSaveAsModal: false,
      saveAsForm: {
        name: ''
      },
      saveAsRules: {
        name: [
          { required: true, message: '请输入图表名称', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ]
      }
    }
  },

  computed: {
    isEdit() {
      return ['edit'].includes(this.$route.query.type)
    },
    // 图表类型
    chartType() {
      return this.chartInfo.type
    },
    // 是不是二维表格
    isTwoDimensionalTable() {
      return ['twoDimensionalTable'].includes(this.chartType)
    },
    // 是不是多维表格
    isMultidimensionalTable() {
      return ['Multidimensional'].includes(this.chartType)
    },
    // vechart图表数据
    veChartData() {
      const { index = [], column = [], row = [] } = this.workspacePayload
      const metrics = index.map(item => item.name)
      const dimension = [...column, ...row].map(item => item.columnChinsesName)

      const isWaterfall = ['waterfall'].includes(this.chartType)
      return {
        columns: isWaterfall ? [...metrics, ...dimension] : [...dimension, ...metrics],
        rows: this.chartData
      }
    },
    // 指标
    metricsList() {
      const { index = [] } = this.workspacePayload

      return index
    },
    // 指标数
    metricsNumber() {
      return this.metricsList.length || 0
    },
    // 维度个数
    dimensionNumber() {
      const { column = [], row = [] } = this.workspacePayload

      return [...column, ...row]?.length || 0
    },
    // 禁用列表
    disabledList() {
      const list = []

      if (this.metricsNumber || this.dimensionNumber) {
        this?.chartOption.forEach(item => {
          if (this?.metricsNumber > item.metrics || this?.dimensionNumber > item.dimension) {
            list.push(item.value)
          }
        })
      }

      return list
    },
    // 是否禁用查询 -- 查询列表中有当前的图表类型
    isDisabledSearch() {
      return this.disabledList.includes(this.chartType)
    }
  },
  watch: {
    'chartInfo.data'(value) {
      this.isShowDownloadBtn = false
      this.reportInfo = value
    }
  },
  mounted() {
    // 挂载eventbus
    eventBus.$on(eventBusType.WORKSPACE_PAYLOAD, this.getWorkSpacePayload)
    eventBus.$on(eventBusType.WORKSPACE_THEME, this.getWorkspaceTheme)
    eventBus.$on(eventBusType.WORKSPACE_CHANGE_CHART_TYPE, this.onSearch)
  },

  beforeDestroy() {
    // 卸载eventbus
    eventBus.$off(eventBusType.WORKSPACE_PAYLOAD, this.getWorkSpacePayload)
    eventBus.$off(eventBusType.WORKSPACE_THEME, this.getWorkspaceTheme)
    eventBus.$off(eventBusType.WORKSPACE_CHANGE_CHART_TYPE, this.onSearch)
  },

  methods: {
    /**
     * @description: 查询表格数据
     */
    onSearch() {
      this.onFormatChartConfig()
      window.dispatchEvent(new Event('resize'))

      const {
        index: characterListVOS = [],
        filter: filterListVOS = [],
        column: columnListVOS = [],
        row: rowListVOS = []
      } = this.workspacePayload
      const { datasourceDTO, reportTable } = this.chartInfo.data
      const payload = {
        limits: 200,
        characterListVOS,
        filterListVOS,
        columnListVOS,
        rowListVOS,
        datasourceVO: {
          ...datasourceDTO,
          tableName: reportTable
        },
        reportId: this.$route.query.id
      }

      this.chartLoading = true
      ChartApiServices.getChartData(payload).then(res => {
        this.chartData = res?.data?.content?.groupByRowNames.map(item => item.list).flat()
        this.querySqlNoLimit = res?.data?.content?.querySqlNoLimit
        this.stepFields = res?.data?.content?.stepFields || []
        this.isShowDownloadBtn = true
      }).finally(() => {
        this.chartLoading = false
      })
    },
    /**
     * @description: 修改配置
     * @param {string} type 类型
     * @param {Object} value 值
     */
    getWorkSpacePayload(type, value) {
      this.isShowDownloadBtn = false
      this.$set(this.workspacePayload, type, value)
    },
    /**
     * @description: 修改颜色列表
     * @param {array} colorList 颜色列表
     */
    getWorkspaceTheme({ colorValue, colorList }) {
      this.colorValue = colorValue
      this.colorList = colorList
    },
    /**
     * @description: 整合不同类型图表的配置
     */
    onFormatChartConfig() {
      if (this.isTwoDimensionalTable) {
        const oneWorldLength = 14
        const gap = 25
        const tableWholeWidth = this.$refs.dtable?.$el?.offsetWidth || 500

        const { index: metrics = [], column = [], row = [] } = this.workspacePayload
        const columnList = [...column, ...row, ...metrics]
        let columns = columnList.map(item => {
          const { name: title, name: field } = item
          const width = title.length * oneWorldLength + gap

          return {
            title,
            field,
            width
          }
        })
        const allWorldLength = columns?.reduce((x, y) => x + y.width, 0)
        if (allWorldLength < tableWholeWidth) {
          columns = columns.map(item => {
            delete item.width
            return item
          })
        }

        this.chartConfig = {
          columns
        }
      } else if (this.isMultidimensionalTable) {
        const { row = [], column = [] } = this.workspacePayload
        const rowFields = row.map(item => {
          const { columnChinsesName: label } = item
          return {
            label,
            getter: item => item[label]
          }
        })
        const colFields = column.map(item => {
          const { columnChinsesName: label } = item
          return {
            label,
            getter: item => item[label]
          }
        })

        this.chartConfig = { rowFields, colFields }
      } else {
        const { chartType } = this
        const { index = [], column = [], row = [] } = this.workspacePayload
        const metrics = index.map(item => item.name)
        const dimension = [...column, ...row].map(item => item.columnChinsesName)

        this.chartConfig = {
          settings: {
            type: chartType,
            metrics: [...metrics],
            dimension: [...dimension],
            useDefaultOrder: chartType === 'funnel' ? true : undefined
          }
        }
      }
    },
    /**
     * @description: 多维表配置
     */
    getReducer(metrics) {
      return (sum, items) => items[metrics.name]
    },

    /**
     * @description: 修改看板名称
     * @param {string} value 值
     */
    onModifyReportName(value) {
      this.reportInfo.reportTittle = value
    },
    /**
     * @description: 保存
     */
    onSave() {
      setTimeout(async() => {
        if (!this.reportInfo.reportTittle) {
          this.$message.warn('请输入名称')

          return
        }

        if (this.reportInfo.reportTittle?.length > 50) {
          this.$message.warn('图表名称不能大于50字符')

          return
        }

        // 校验名称重复
        const { data: { content: isRepeat = true }} = await this.onCheckReportNameReport()
        if (isRepeat) {
          this.$message.warn('图表名称已存在')

          return
        }
        // 探索新建之后会返回报表id，如果再次保存，那么调用更新接口
        if (this.reportInfo.reportId || this.escatReportId) {
          this.$confirm({
            title: '提示',
            content: `是否覆盖之前信息 ?`,
            okText: '确认',
            onOk: () => {
              this.chartLoading = true
              const payload = this.getSavePayload()
              // 探索新建之后会返回报表id，如果再次保存，那么调用更新接口
              payload.reportVO.reportId = payload.reportVO.reportId || this.escatReportId

              return ChartApiServices.saveReports(payload).then(res => {
                this.$message.success('保存成功')
              }).catch(() => {
                this.$message.error('保存失败')
              }).finally(() => {
                this.chartLoading = false
              })
            }
          })
        } else {
          const payload = this.getSavePayload()

          this.chartLoading = true
          ChartApiServices.saveReports(payload).then(res => {
            this.$message.success('保存成功')
            // 探索新建之后会返回报表id，如果再次保存，那么调用更新接口
            this.escatReportId = res.data.content
          }).catch(() => {
            this.$message.error('保存失败')
          }).finally(() => {
            this.chartLoading = false
          })
        }
      }, 0)
    },
    onShowSaveAsModal() {
      if (this.reportInfo.reportTittle) {
        this.saveAsForm.name = `${this.reportInfo.reportTittle}（副本）`
      }
      this.isShowSaveAsModal = true
    },
    onSaveAsCancel() {
      this.$refs.saveAsForm.resetFields()

      this.isShowSaveAsModal = false
    },
    onSaveAsOk() {
      this.$refs.saveAsForm.validate(valid => {
        if (valid) {
          const saveAsName = this.saveAsForm.name
          const payload = this.getSavePayload()
          payload.reportVO.tittle = saveAsName
          payload.reportVO.reportId = undefined

          this.chartLoading = true
          ChartApiServices.saveReports(payload).then(res => {
            const { data: { content: id }} = res
            this.$message.success('另存成功')
            this.onSaveAsCancel()
            if (this.isEdit) {
              this.$router.push({ path: '/chart/workspace', query: { id, type: 'edit' }})
            } else {
              this.escatReportId = id
              this.reportInfo.reportTittle = saveAsName
            }
          }).catch(() => {
            this.$message.error('另存失败')
          }).finally(() => {
            this.chartLoading = false
          })
        }
      })
    },
    /**
     * @description: 获取保存时的参数
     * @return {Object} 参数信息
     */
    getSavePayload() {
      const {
        index: characts = [],
        column: columnListVO = [],
        filter: filterListVO = [],
        row: rowListVO = []
      } = this.workspacePayload
      const {
        datasourceDTO: { datasourceId },
        querySql,
        reportId,
        stepName,
        stepProjectId,
        reportTable: tableName,
        reportTittle: tittle,
        dimensionList,
        mertricList,
        sourcePlatform: sourcePlatform = undefined,
        sourceProjectCreateId: sourceProjectCreateId = undefined
      } = this.reportInfo
      const { colorValue, colorList } = this
      const dataObj = {
        characts,
        columnListVO,
        filterListVO,
        rowListVO,
        setting: {
          colorValue,
          colorList
        }
      }
      const dataJson = JSON.stringify(dataObj)

      return {
        characts,
        columnListVO,
        filterListVO,
        rowListVO,
        dimensionList,
        mertricList,
        reportVO: {
          chartId: this.chartType,
          dataJson,
          datasourceId,
          querySql,
          reportId,
          stepName,
          stepProjectId,
          tableName,
          tittle,
          sourcePlatform,
          sourceProjectCreateId
        }
      }
    },
    /**
     * @description: 下载excel
     */
    onDownload() {
      const { reportTittle } = this.reportInfo
      const payload = this.getDownloadPayload()
      if (this.isMultidimensionalTable) {
        ChartApiServices.onDownloadReportExcelByHtml(payload).then(res => {
          const win = window.URL || window.webkitURL || window.moxURL
          const url = window.URL.createObjectURL(new Blob([res.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', `${reportTittle || '报表数据'}.xlsx`)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          win.revokeObjectURL(url)
        }).catch(res => {
          const win = window.URL || window.webkitURL || window.moxURL
          const url = window.URL.createObjectURL(new Blob([res.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', `${reportTittle || '报表数据'}.xlsx`)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          win.revokeObjectURL(url)
        })
      } else {
        this.chartLoading = true
        var subfrom = document.createElement('form')
        subfrom.style = 'display:none'
        subfrom.method = 'post'
        subfrom.action = ChartApiServices.downloadReportExcelUrl + localStorage.getItem('Authorization').replace('Bearer ', '')

        var paramsJson = document.createElement('input')
        paramsJson.type = 'text'
        paramsJson.name = 'paramsJson'
        paramsJson.value = JSON.stringify(payload)
        subfrom.appendChild(paramsJson)
        document.body.appendChild(subfrom)
        subfrom.submit()
        this.chartLoading = false
      }
    },

    getDownloadPayload() {
      const { reportTittle } = this.reportInfo

      if (this.isMultidimensionalTable) {
        const { index = [] } = this.workspacePayload
        const childNodes = this.$refs.PivotTable.childNodes
        const excelHtmlInfo = index.map((item, index) => {
          return {
            characts: item.showName,
            htmlTable: encodeURI(`${childNodes[index].innerHTML}`)
          }
        })
        return {
          chartName: reportTittle,
          excelHtmlInfo
        }
      } else {
        // 此处原逻辑是前端做的，由于不同数据库，由后端处理逻辑
        const { stepFields = [] } = this

        return {
          datasourceId: this.reportInfo.datasourceDTO.datasourceId,
          dataQuerySql: this.querySqlNoLimit,
          fileName: reportTittle,
          stepFields
        }
      }
    },
    /**
     * @description: 名称验重
     * @return {Promise}
     */
    async onCheckReportNameReport() {
      const { reportTittle, reportId = undefined } = this.reportInfo
      const { escatReportId = undefined } = this
      const payload = {
        reportId: reportId || escatReportId || undefined,
        reportTittle
      }

      return ChartApiServices.onCheckReportName(payload)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../css/bootstrap.css';
  .chart-content {
    padding: 10px;
    height: 100%;
    .chart-content-chart {
      flex: 1;
      height: 0;
      .chart-view {
        height: 100%;
        border: 1px solid #e9e9e9;
        border-radius: 6px;
        &.pivot-table-contain {
          /*overflow-y: scroll;*/
          overflow: auto;
          /*padding: 70px 52px 0px 52px;*/
          font-size: 12px;
          .position-relative + .position-relative {
            margin-top: 10px;
          }
        }
      }
    }
    .down-btn {
      width: 14px;
    }
  }
  .save-as-modal {
    /deep/.ant-modal-body {
      height: 120px;
    }
  }
</style>
