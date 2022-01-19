<!--
 * @Description: 首页
 * @Date: 2021-08-16 08:59:24
 * @LastEditTime: 2022-01-19 11:22:54
-->
<template>
  <div class="home">
    <div class="home-title flex-box-row">
      <div class="first-word">
        {{ userFirstWord }}
      </div>
      <div class="introduce">
        <div class="user">您好，{{ user }}，欢迎来到报表看板</div>
        <div class="msg">我们是以all in one box的方式提供专业高效、安全可靠的一站式大数据智能云研发平台。同时能满足用户对数据治理的需求，赋予用户对外提供数据服务的能力。</div>
      </div>
    </div>
    <div class="view-type flex-box-row flex-box flex-box--end-justify">
      <a-radio-group v-model="viewType" button-style="solid">
        <a-radio-button value="card">卡片</a-radio-button>
        <a-radio-button value="list">列表</a-radio-button>
      </a-radio-group>
    </div>
    <div class="home-content flex-box-row flex-box flex-box--column">
      <div class="block-title border flex-box-row">看板列表</div>
      <div class="content flex-box-row">
        <HomeList v-if="isListType" />
        <HomeCard v-if="isCardType" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import HomeList from './components/list.vue'
import HomeCard from './components/card.vue'

export default {
  name: 'Home',

  components: {
    HomeList,
    HomeCard
  },

  data() {
    return {
      viewType: 'card'
    }
  },

  computed: {
    ...mapGetters('account', ['user']),
    // 用户名称第一个字
    userFirstWord() {
      const [firstWord] = Array.from(this.user)

      return firstWord
    },
    // 列表模式
    isListType() {
      return this.viewType === 'list'
    },
    // 卡片模式
    isCardType() {
      return this.viewType === 'card'
    }
  },

  mounted() {
    this.initPage()
  },

  methods: {
    /**
     * @description: 初始化页面
     */
    initPage() {
      // this.getOverviewData()
      // this.getEventList()
    },
    /**
     * @description: 获取总览数据
     */
    getOverviewData() {
    },
    /**
     * @description: 获取事件列表
     */
    getEventList() {
    },
    /**
     * @description: 跳转到事件列表
     */
    jumpToEventList() {
      this.$router.push({ path: '/calculate/calculateEvent' })
    },
    /**
     * @description: 新增事件
     */
    onShowAddModal() {
      this.isAddModalShow = true
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  display: flex;
  overflow: auto;
  flex-direction: column;
  height: 100%;
  .home-title {
    display: flex;
    align-items: center;
    padding-left: 20px;
    height: 150px;
    border: 2px solid #fff;
    border-radius: 6px;
    background-color: #f3f3f3;
    background-image: url('~@/assets/images/home/computer.png');
    background-position: center right 20px;
    background-size: contain;
    background-repeat: no-repeat;
    .first-word {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20px;
      width: 72px;
      height: 72px;
      border-radius: 100%;
      background: #d8ebff;
      color: #6486a9;
      font-size: 26px;
    }
    .introduce {
      .user {
        color: rgba(0,0,0,.85);
        font-weight: 500;
        font-size: 20px;
      }
      .msg {
        margin-top: 16px;
        max-width: 780px;
        color: rgba(0,0,0,.65);
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
      }
    }
  }
  .home-content {
    // background-color: #f3f3f3;
    flex: 1;
    padding: 15px 15px 0;
    padding-bottom: 10px;
    height: 0;
    border: 2px solid #fff;
    border-radius: 6px;
    .content {
      overflow: auto;
      flex: 1;
      height: 0;
    }
  }
}
</style>
