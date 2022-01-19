<!--
 * @Description: board
 * @Date: 2022-01-18 15:16:24
 * @LastEditTime: 2022-01-19 13:57:54
-->
<template>
  <div class="board page-container">
    <s-page-handle>
      <div slot="filters">
        <s-page-handle-item>
          <a-input v-model="name" allow-clear placeholder="请输入看板名称" />
        </s-page-handle-item>
        <s-page-handle-item>
          <a-button
            class="search-btn"
            type="primary"
            @click="onGetBoardData()"
          >查询</a-button>
        </s-page-handle-item>
      </div>
      <div slot="actions">
        <s-page-handle-item>
          <a-button
            type="primary"
            ghost
            shape="round"
            @click="onAddBoard"
          >新增</a-button>
        </s-page-handle-item>
      </div>
    </s-page-handle>

    <div class="table-container">
      <HomeList ref="boardList" />
    </div>
  </div>
</template>

<script>
import HomeList from '../home/components/list.vue'

export default {
  name: 'Board',

  components: {
    HomeList
  },

  data() {
    return {
      name: ''
    }
  },

  mounted() {
    this.initPage()
  },

  methods: {
    initPage() {
      this.onGetBoardData()
    },

    onGetBoardData() {
      this.$refs.boardList.getHomeListData(this.name)
    },

    onAddBoard() {}
  }
}
</script>
<style lang="less" scoped>
.board {
  padding: 0;
}
</style>
