<!--
 * @Description: 首页
 * @Date: 2021-08-16 08:59:24
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
    <div class="home-content flex-box-row flex-box flex-box--column">
      <DPageHandle>
        <div slot="filters" class="page-handle">
          <DPageHandleItem>
            <a-input-search
              v-model="dashboardName"
              class="home-card-search flex-box-row"
              placeholder="看板名称"
              @search="onSearch"
            />
          </DPageHandleItem>
        </div>
        <div slot="actions">
          <DPageHandleItem>
            <a-radio-group v-model="reportType" button-style="solid"  @change="onReportTypeChange">
              <a-radio-button value="myself">
                我的报表
              </a-radio-button>
              <a-radio-button value="shared">
                他人报表
              </a-radio-button>
            </a-radio-group>
          </DPageHandleItem>
          <DPageHandleItem>
            <a-radio-group v-model="viewType" button-style="solid" @change="onChangeType">
              <a-radio-button value="card">卡片</a-radio-button>
              <a-radio-button value="list">列表</a-radio-button>
            </a-radio-group>
          </DPageHandleItem>
        </div>
      </DPageHandle>
      <div class="content flex-box-row">
        <HomeList v-if="isListType" ref="homeList" :dashboard-name="dashboardName" :report-type="reportType"/>
        <HomeCard v-if="isCardType" ref="homeCard" :dashboard-name="dashboardName" :report-type="reportType"/>
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
      viewType: 'card',
      dashboardName: '',
      reportType: 'myself'
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

  methods: {
    /**
     * @description: 修改展示类型 搜索名字重置
     */
    onChangeType() {
      this.dashboardName = ''
    },
    /**
     * @description: 修改报表展示类型 搜索名字重置
     */
    onReportTypeChange(e) {
      this.reportType = e.target.value
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
    },
    /**
     * @description: 搜索触发
     */
    onSearch() {
      if (this.isListType) {
        this.$refs.homeList.getHomeListData(this.dashboardName)
      } else if (this.isCardType) {
        this.$refs.homeCard.getHomeCardData(this.dashboardName)
      }
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
    padding: 0 15px;
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
