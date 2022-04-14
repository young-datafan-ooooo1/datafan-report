<!--
 * @Description: 导入编辑
 * @Date: 2021-08-23 10:38:52
 -->
<template>
  <a-form-model ref="form" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-model-item label="文件格式需按模板编写" style="padding-top: 10px">
      <a-button @click="onDownLoadModal">下载{{ title }}导入模板</a-button>
    </a-form-model-item>
    <a-form-model-item label="是否跟新已有数据" prop="isUpdate">
      <a-space>
        <a-checkbox v-model="form.isUpdate" @change="onChangeUpdate">
          不更新
        </a-checkbox>
        <a-checkbox v-model="form.isNotUpdate" @change="onChangeNotUpdate">
          更新
        </a-checkbox>
      </a-space>
    </a-form-model-item>
    <a-form-model-item :wrapper-col="{span: 14, offset: 5}">
      <a-upload-dragger
        name="file"
        :file-list="form.fileList"
        :before-upload="beforeUpload"
        :remove="handleRemove"
        action=""
        @change="handleChange"
      >
        <p class="ant-upload-drag-icon">
          <a-icon type="inbox" />
        </p>
        <p class="ant-form-item">
          点击或将文件拖拽到这里上传
        </p>
      </a-upload-dragger>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import { downLoadTemplate, postAdThemeImport } from '@/services/excel'

export default {
  props: {
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
      // 表单布局
      labelCol: { span: 7, offset: 3 },
      wrapperCol: { span: 14 },
      // 表单
      form: {
        isUpdate: true,
        isNotUpdate: false,
        // 存储文件列表
        fileList: []
      },
      // 校验规则
      rules: {
        isUpdate: [
          { required: true, message: '是否跟新已有数据', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /**
     * @description：选择更新-不更新的checkbox
     * @param e 函数
     */
    onChangeUpdate(e) {
      const checked = e.target.checked
      this.form.isUpdate = checked
      this.form.isNotUpdate = !checked
    },
    /**
     * @description：选择更新-不更新的checkbox
     * @param e 函数
     */
    onChangeNotUpdate(e) {
      const checked = e.target.checked
      this.form.isNotUpdate = checked
      this.form.isUpdate = !checked
    },
    /**
     * @description：文件上传
     * @param {Object} info 文件信息总揽
     */
    handleChange(info) {
      const fileList = [...info.fileList]
      if (fileList.length > 1) {
        this.$message.warning('只能上传一个文件！', 5)
        this.form.fileList = fileList.slice(-1)
      }
    },
    /**
     * @description 重制表单
     */
    resetFields() {
      this.form = {
        isUpdate: true,
        isNotUpdate: false,
        // 存储文件列表
        fileList: []
      }
    },
    /**
     * @description  文件移除
     */
    handleRemove(file) {
      const index = this.form.fileList.indexOf(file)
      const newFileList = this.form.fileList.slice()
      newFileList.splice(index, 1)
      this.form.fileList = newFileList
    },
    /**
     * @description：下载模板
     */
    onDownLoadModal() {
      downLoadTemplate(this.controllerName).then(() => {
        this.$message.success('下载模板成功', 5)
      })
    },
    /**
     * @description：确定按钮，提交表单
     */
    onSubmit() {
      this.$refs['form'].validate(validate => {
        if (validate) {
          const formData = new FormData()
          // 多个上传
          this.form.fileList.forEach(file => {
            formData.append('files', file)
          })
          // formData.append('file', this.form.fileList[0])
          const params = {
            controllerName: this.controllerName,
            isUpdate: this.form.isUpdate
          }
          postAdThemeImport(params, formData).then(async(res) => {
            this.$message.success(res.data.content)
            this.$emit('onUploadSuccess', true)
          }).catch(() => {
            this.$emit('onUploadSuccess', false)
          })
        } else {
          console.log('error')
        }
      })
    },
    beforeUpload(file) {
      this.form.fileList = [...this.form.fileList, file]
      return false
    }
  }
}
</script>
