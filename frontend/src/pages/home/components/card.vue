<!--
 * @Description: 卡片
 * @Date: 2022-01-19 10:23:14
 -->
<template>
  <div class="home-card">
    <a-spin :spinning="loading" class="common-spin">
      <div class="card-list--box">
        <div class="card-add" @click="onAddDashboard">
          <a-icon class="icon" type="plus" />
          <span>新增看板</span>
        </div>
        <template v-for="card in cardData">
          <div :key="card.dashboardId" class="card-item" @click="onViewBoard(card)">
            <div class="icon flex-box--end-self" />
            <div class="name">{{ card.dashboardName }}</div>
            <div class="time">创建时间：{{ card.createTime }}</div>
          </div>
        </template>
      </div>
    </a-spin>
  </div>
</template>

<script>
import HomeApiServices from '@/services/home'

export default {
  name: 'HomeCard',

  data() {
    return {
      loading: false,
      cardData: []
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
      this.getHomeCardData()
    },

    getHomeCardData() {
      this.loading = true
      HomeApiServices.getHomeListInfo({ rows: 20, pageSize: 1 }).then(res => {
        this.cardData = res.data.content.list || []
      }).finally(() => {
        this.loading = false
      })
    },

    onAddDashboard() {
      this.$router.push({ path: '/board/dashboard' })
    },

    /**
     * @description: 编辑看板
     * @param {Object} row 行信息
     */
    onViewBoard(row) {
      const { dashboardId } = row

      this.$router.push({ path: '/board/dashboard', query: { dashboardId, viewType: 'edit' }})
    }
  }
}
</script>

<style lang="less" scoped>
.home-card {
  margin-left: -10px;
  height: 100%;
  .card-list--box {
    display: flex;
    flex-wrap: wrap;
    .card-add {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      margin-left: 10px;
      width: calc(25% - 10px);
      height: 170px;
      border: 1px solid rgba(243, 111, 78, 0.3);
      border-radius: 7px;
      background: rgba(240, 113, 82, 0.06);
      cursor: pointer;
      .icon {
        margin-bottom: 20px;
        color: #F07152;
        font-size: 20px;
      }
    }
    .card-item {
      display: flex;
      align-items: center;
      flex-direction: column;
      margin-bottom: 10px;
      margin-left: 10px;
      padding: 15px 10px;
      width: calc(25% - 10px);
      height: 170px;
      // border: 1px solid #F2DED0;
      border-radius: 7px;
      background-image: url('~@/assets/images/home/eventCardBg.jpg');
      background-size: 100% 100%;
      cursor: pointer;
      .icon {
        width: 24px;
        height: 16px;
        background-image: url('~@/assets/images/home/inIcon.png');
        background-size: contain;
      }
      .name {
        margin-top: 20px;
        font-weight: 500;
        font-size: 16px;
        line-height: 22px;
      }
      .time {
        margin-top: 10px;
        color: #293C51;
        font-weight: 400;
        font-size: 12px;
        line-height: 14px;
      }
      &:hover {
        background-image: url('~@/assets/images/home/eventCardBgHover.jpg');
        background-size: 100% 100%;
        .name {
          color: #fff;
        }
        .time {
          color: #fff;
        }
        .icon {
          background-image: url('~@/assets/images/home/inIconHover.png');
        }
      }
    }
  }
}
</style>
