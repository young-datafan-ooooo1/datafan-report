<!--
 * @Description: board
 * @Date: 2022-01-18 15:16:24
 -->
<template>
  <div class="board page-container">
    <DPageHandle>
      <div slot="filters">
        <DPageHandleItem>
          <a-input v-model="name" allow-clear placeholder="请输入看板名称" />
        </DPageHandleItem>
        <DPageHandleItem>
          <a-button
            class="search-btn"
            type="primary"
            @click="onGetBoardData()"
          >查询</a-button>
        </DPageHandleItem>
      </div>
      <div slot="actions">
        <DPageHandleItem>
          <a-button
            type="primary"
            ghost
            shape="round"
            @click="onAddBoard"
          >新增</a-button>
        </DPageHandleItem>
      </div>
    </DPageHandle>

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

    onAddBoard() {
      this.$router.push({ path: '/board/dashboard' })
    }
  }
}
</script>
<style lang="less" scoped>
.board {
  padding: 0;
}
</style>
