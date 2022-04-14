<!--
 * @Description: 导入弹框引用事例
 * @Date: 2021-08-23 10:38:08
 -->

<template>
  <a-modal
    v-model="isModalShow"
    class="base-modal"
    v-bind="{
      maskClosable,
      ...$attrs,
    }"
    :title="'导入'+ title"
    :destroy-on-close="true"
    width="60vw"
    :confirm-loading="isConfirmLoading"
    v-on="$listeners"
  >
    <div class="base-modal__content">
      <a-tabs v-model="key">
        <a-tab-pane
          v-for="(pane, index) in panes"
          :key="index"
          :tab="pane.title"
        >
          <div v-if="pane.enTitle.indexOf('Edit') >= 0" class="tab-content">
            <import-edit-model ref="impEditModel" :title="title" :controller-name="controllerName" @onUploadSuccess="onUploadSuccess" />
          </div>
          <div v-if="pane.enTitle.indexOf('History') >= 0" class="tab-content">
            <import-history-model ref="impHistoryModel" :title="title" :tab-key="key" />
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <template slot="footer">
      <a-button v-if="key === 0" key="cancle" @click="cancel">
        取消
      </a-button>
      <a-button v-if="key === 0" key="onsubmit" :loading="isConfirmLoading" type="primary" @click="ok">
        上传
      </a-button>
      <div v-else key="else" />
    </template>
  </a-modal>
</template>
<script>
import ImportEditModel from './components/import-edit-modal.vue'
import ImportHistoryModel from './components/import-history-modal.vue'
export default {
  components: {
    ImportEditModel,
    ImportHistoryModel },
  model: {
    prop: 'visible',
    event: 'change'
  },
  props: {
    // modal显示隐藏
    visible: {
      type: Boolean,
      default: false
    },
    // 点击遮罩层是否可以关闭
    maskClosable: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: () => {
        return ''
      }
    },
    controllerName: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data() {
    return {
      // tab绑定的key
      key: 0,
      // 是否确认新增任务弹框loading
      isConfirmLoading: false,
      // 是否显示modal
      isModalShow: false,
      // tabs标题
      panes: this.initPanes()
    }
  },
  watch: {
    // 监听显示隐藏，控制data数据
    visible(val) {
      this.isModalShow = val
    }
  },
  created() {
    this.initPanes()
  },
  beforeUpdate() {
    if (!this.isModalShow) {
      this.key = 0
    }
  },
  methods: {
    /**
     * @description: 点击确定按钮
     */
    ok() {
      this.isConfirmLoading = true
      this.$refs['impEditModel'][0].onSubmit()
    },
    cancel() {
      this.onClose()
    },
    /**
     * @description: 关闭弹窗
     */
    onClose() {
      this.$emit('change')
      this.isModalShow = false
      this.isConfirmLoading = false
      this.$refs.impEditModel[0].resetFields()
    },
    onUploadSuccess(isUpLoadSucess) {
      if (isUpLoadSucess) {
        this.key = 1
      }
      this.isConfirmLoading = false
    },
    /**
     * @description: 设置导入弹出框的值
     */
    initPanes() {
      const panes = [
        {
          title: '导入配置',
          // enTitle: 'reverseEdit'
          enTitle: 'importEdit'
        },
        {
          title: '导入历史',
          enTitle: 'importHistory'
        }
      ]
      return panes
    }
  }
}
</script>

<style lang="less" scoped>
.base-modal {
  /deep/ .ant-modal-body {
    padding: 0;
    word-wrap: break-word;
    font-size: 14px;
    line-height: 1.5;
  }
  /deep/ .ant-tabs-bar{
      margin: 0;
      outline: none;
      border-bottom: 1px solid #f0f0f0;
      transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }

    &__content {
    overflow: hidden;
    padding: 0 8px;
    max-height: 70vh;
  }

  .tab-content {
    overflow: auto;
    margin-left: 0%;
    max-height: calc(70vh - 153px);
  }
}
</style>
