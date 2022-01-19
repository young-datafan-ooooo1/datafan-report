<!--
 * @Description: 新建编辑看板
 * @Date: 2022-01-19 15:21:06
 * @LastEditTime: 2022-01-19 15:56:55
-->
<template>
  <div class="dashboard">{{ isAddDashboard ? '新增' : '编辑' }}</div>
</template>

<script>
export default {
  name: 'Dashboard',

  data() {
    return {
      dashboardId: '',
      viewType: ''
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

}
</style>
