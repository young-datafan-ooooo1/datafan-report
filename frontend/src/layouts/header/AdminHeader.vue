<template>
  <a-layout-header :class="[headerTheme, 'admin-header']">
    <div
      :class="['admin-header__wide', layout, pageWidth]"
      class="flex items-center justify-between"
    >
      <div class="inline-flex items-center">
        <SNavigation />
        <div class="admin-heaer__logo">
          <router-link to="/home">
            <img :src="ASSETS_URL+ '/common/img/stella-logo.png'" style="height: 2rem;width:100px">
          </router-link>
        </div>

        <div
          class="admin-header__title"
        >
          {{ title }}
        </div>
        <div
          v-if="layout !== 'side' && !isMobile"
          class="admin-header__menu"
          :style="`width: ${menuWidth};`"
        >
          <i-menu
            class="head-menu"
            :theme="headerTheme"
            mode="horizontal"
            :options="menuData"
            @select="onSelect"
          />
        </div>
      </div>

      <div :class="['admin-header__right', headerTheme]">
        <header-avatar class="header-item header-right__avatar" />
        <a-dropdown placement="bottomCenter">
          <div class="header-right__more">
            <a-icon class="header-right__btn" type="more" />
          </div>
          <a-menu slot="overlay">
            <a-menu-item @click="logout">
              <a-icon style="margin-right: 8px;" type="poweroff" />
              <span>退出登录</span>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>
  </a-layout-header>
</template>

<script>
// import HeaderSearch from './HeaderSearch'
// import HeaderNotice from './HeaderNotice'
import HeaderAvatar from './HeaderAvatar'
import IMenu from '@/components/menu/menu'
import { mapState, mapMutations } from 'vuex'
import { logout } from '@sense70/common-component-vue'
import { ASSETS_URL } from '@/services/api'

export default {
  name: 'AdminHeader',
  components: { IMenu, HeaderAvatar },
  props: ['collapsed', 'menuData'],
  data() {
    return {
      ASSETS_URL,
      searchActive: false,
      title: ''
    }
  },
  computed: {
    ...mapState('setting', [
      'theme',
      'isMobile',
      'layout',
      'systemName',
      'lang',
      'pageWidth'
    ]),
    headerTheme() {
      if (
        this.layout === 'side' &&
        this.theme.mode === 'dark' &&
        !this.isMobile
      ) {
        return 'light'
      }
      return this.theme.mode
    },
    menuWidth() {
      const { layout, searchActive } = this
      const headWidth = layout === 'head' ? '100% - 188px' : '100%'
      const extraWidth = searchActive ? '600px' : '400px'
      return `calc(${headWidth} - ${extraWidth})`
    },
    ...mapState('components', ['menuNavigator'])
  },
  created() {
    this.setHtmlTitle()
  },
  methods: {
    setHtmlTitle() {
      this.title =
        this.menuNavigator?.find((i) => i.nodeEnName === 'dashboard')
          ?.nodeName ?? ''
    },
    onSelect(obj) {
      this.$emit('menuSelect', obj)
    },
    logout() {
      this.$store.commit('model/setModel', '')
      logout()
    },
    ...mapMutations('setting', ['setLang'])
  }
}
</script>

<style lang="less" scoped>
@import 'index';
</style>
