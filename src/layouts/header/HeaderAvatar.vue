<template>
  <!-- <a-dropdown> -->
  <div class="header-avatar" style="cursor: pointer">
    <img class="avatar" :src="ASSETS_URL+ '/common/img/header-user.png'" alt="">
    <span class="name">{{ user }}</span>
  </div>
  <!-- <a-menu slot="overlay" :class="['avatar-menu']">
      <a-menu-item @click="logout">
        <a-icon style="margin-right: 8px;" type="poweroff" />
        <span>退出登录</span>
      </a-menu-item>
    </a-menu> -->
  <!-- </a-dropdown> -->
</template>

<script>
import { mapGetters } from 'vuex'
// import { logout } from '@/services/user'
import { logout } from '@sense70/common-component-vue'
import { ASSETS_URL } from '@/services/api'

export default {
  name: 'HeaderAvatar',
  data() {
    return {
      ASSETS_URL
    }
  },
  computed: {
    ...mapGetters('account', ['user'])
  },
  methods: {
    logout() {
      logout()
    }
  }
}
</script>

<style lang="less">
.header-avatar {
  display: inline-flex;
  .avatar,
  .name {
    align-self: center;
  }
  .avatar {
    margin-right: 10px;
    width: 1rem;
    height: 1rem;
    border-radius: 0.5rem;
  }
  .name {
    font-weight: 500;
  }
}
.avatar-menu {
  width: 150px;
}
</style>
