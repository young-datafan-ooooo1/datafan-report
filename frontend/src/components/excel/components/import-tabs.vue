<!--
 * @Description: 导入模板事例
 * @Date: 2021-08-23 10:39:36
 -->

<template>
  <a-tabs v-model="key">
    <a-tab-pane
      v-for="(pane, index) in panes"
      :key="index"
      :tab="pane.title"
    >
      <div v-if="pane.enTitle.indexOf('Edit') >= 0" class="tab-content">
        <import-edit-model ref="impEditModel" />
      </div>
      <div v-if="pane.enTitle.indexOf('History') >= 0" class="tab-content">
        <import-history-model ref="impHistoryModel" />
      </div>
    </a-tab-pane>
  </a-tabs>
</template>
<script>
import importEditModel from './import-edit-modal.vue'
import ImportHistoryModel from './import-history-modal.vue'

export default {
  components: {
    importEditModel,
    ImportHistoryModel
  },
  inject: ['panes'],
  data() {
    return {
      // tab绑定的key
      key: 0
    }
  },
  methods: {}
}
</script>
<style lang="less" scoped>
.tab-content {
    overflow: auto;
    max-height: 50vh;
}
</style>
