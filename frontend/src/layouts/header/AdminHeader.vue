<template>
  <a-layout-header :class="[headerTheme, 'admin-header']">
    <div
      :class="['admin-header__wide', layout, pageWidth]"
      class="flex items-center justify-between"
    >
      <div class="inline-flex items-center">
        <DNavigationComp />
        <div class="admin-heaer__logo">
          <router-link to="/homePage">
            <img
              :src="assetsUrl + '/common/img/datamp-logo.png'"
              style="height: 2rem"
            >
          </router-link>
        </div>

        <div class="admin-header__title">图表看板平台</div>
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
        <div class="header-right__info">
          <a-tooltip title="帮助" placement="bottom">
            <a-icon type="question-circle-o" @click="open_help" />
          </a-tooltip>
        </div>
        <header-avatar class="header-item header-right__avatar" />
        <a-dropdown placement="bottomCenter">
          <div class="header-right__more">
            <a-icon class="header-right__btn" type="more" />
          </div>
          <a-menu slot="overlay">
            <a-menu-item @click="logout">
              <a-icon style="margin-right: 8px" type="poweroff" />
              <span>退出登录</span>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>
  </a-layout-header>
</template>

<script>
import HeaderAvatar from './HeaderAvatar'
import IMenu from '@/components/menu/menu'
import { mapState, mapMutations } from 'vuex'
// import { logout, ROUTE_URL } from '@datamp/common-component'
// import { ROUTE_URL } from '@datamp/common-component'
import { ASSETS_URL } from '@/services/api'
import { sgmLoginOut } from '@/services/user'

export default {
  name: 'AdminHeader',
  components: { IMenu, HeaderAvatar },
  props: ['collapsed', 'menuData'],
  data() {
    return {
      langList: [
        { key: 'CN', name: '简体中文', alias: '简体' },
        { key: 'HK', name: '繁體中文', alias: '繁體' },
        { key: 'US', name: 'English', alias: 'English' }
      ],
      searchActive: false,
      assetsUrl: ASSETS_URL
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
    langAlias() {
      const lang = this.langList.find((item) => item.key === this.lang)
      return lang.alias
    },
    menuWidth() {
      const { layout, searchActive } = this
      const headWidth = layout === 'head' ? '100% - 188px' : '100%'
      const extraWidth = searchActive ? '600px' : '400px'
      return `calc(${headWidth} - ${extraWidth})`
    }
  },
  methods: {
    onSelect(obj) {
      this.$emit('menuSelect', obj)
    },
    logout() {
      // logout()
      // 请求统一认证退出登录接口
      sgmLoginOut().then(res => {
        // 请求成功后用户缓存
        localStorage.clear()
        // 获取接口返回data值，重定向到新地址
        const url = res.data.data
        window.location.href = url
      })
    },
    open_help() {
      // const BASE =
      //   process.env.NODE_ENV === 'development'
      //     ? process.env.VUE_APP_API_BASE_URL.substring(
      //       0,
      //       (process.env.VUE_APP_API_BASE_URL?.length ?? 0) - 4
      //     )
      //     : ROUTE_URL
      // window.open(BASE + '/product-help-center/docs-assets/')
      window.open('http://10.203.88.48/help/使用手册.docx')
    },
    ...mapMutations('setting', ['setLang'])
  }
}
</script>

<style lang="less" scoped>
@import 'index';
</style>
