<template>
  <a-layout :class="['admin-layout']">
    <a-layout-header>
      <d-header
        :menu-data="headMenuData"
        node-en-name="dashboard"
        node-name="图表看板平台"
        to-path="/home"
        :logo-url="ASSETS_URL + '/common/img/stella-logo.png'"
      />
    </a-layout-header>
    <a-layout>
      <drawer v-if="isMobile" v-model="drawerOpen">
        <d-menu
          :theme="theme.mode"
          :menu-data="menu"
          :collapsed="true"
          :collapsible="true"
          @toggleCollapse="toggleCollapse"
        />
      </drawer>
      <d-menu
        v-else-if="layout === 'side' || layout === 'mix'"
        :class="[fixedSideBar ? 'fixed-side' : '']"
        :theme="theme.mode"
        :menu-data="menuAddMeta(menu)"
        :collapsed="collapsed"
        :all-open-keys="allOpenKeys"
        :collapsible="true"
        @toggleCollapse="toggleCollapse"
      />

      <a-layout-content class="beauty-scroll">
        <div class="h-full">
          <slot />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import Drawer from '../components/tool/Drawer'
import { mapState, mapMutations, mapGetters } from 'vuex'
import { watermark } from '@sense70/common-component-vue'

import { ASSETS_URL } from '@/services/api'
// const minHeight = window.innerHeight - 64 - 122

export default {
  name: 'AdminLayout',
  components: { Drawer },
  data() {
    return {
      minHeight: window.innerHeight - 65,
      collapsed: false,
      showSetting: false,
      drawerOpen: false,
      ASSETS_URL // 静态资源路径
    }
  },

  computed: {
    ...mapState('setting', [
      'isMobile',
      'theme',
      'layout',
      'footerLinks',
      'copyright',
      'fixedHeader',
      'fixedSideBar',
      'fixedTabs',
      'hideSetting',
      'multiPage'
    ]),
    ...mapGetters('setting', ['firstMenu', 'subMenu', 'menuData', 'newMenuData', 'allOpenKeys']),
    ...mapGetters('components', ['menu', 'dict']),
    sideMenuWidth() {
      return this.collapsed ? '0' : '0'
    },
    headerStyle() {
      const width =
        this.fixedHeader && this.layout !== 'head' && !this.isMobile
          ? `calc(100% - ${this.sideMenuWidth})`
          : '100%'
      const position = this.fixedHeader ? 'fixed' : 'static'
      return `width: ${width}; position: ${position};`
    },
    headMenuData() {
      const { layout, menu, firstMenu } = this
      return layout === 'mix' ? firstMenu : menu
    },
    sideMenuData() {
      const { layout, menu, subMenu } = this
      return layout === 'mix' ? subMenu : menu
    }
  },
  watch: {
    $route(val) {
      this.setActivated(val)
    },
    layout() {
      this.setActivated(this.$route)
    },
    isMobile(val) {
      if (!val) {
        this.drawerOpen = false
      }
    }
  },

  mounted() {
    this.dict.watermark &&
      watermark.set(
        localStorage.getItem('userName') + ' ' + localStorage.getItem('account')
      )
  },
  methods: {
    ...mapMutations('setting', ['correctPageMinHeight', 'setActivatedFirst']),
    toggleCollapse() {
      this.collapsed = !this.collapsed
      localStorage.setItem('collapsed', this.collapsed)
    },
    onMenuSelect() {
      this.toggleCollapse()
    },
    setActivated(route) {
      if (this.layout === 'mix') {
        let matched = route.matched
        matched = matched.slice(0, matched.length - 1)
        const { firstMenu } = this
        for (const menu of firstMenu) {
          if (matched.findIndex(item => item.path === menu.fullPath) !== -1) {
            this.setActivatedFirst(menu.fullPath)
            break
          }
        }
      }
    },
    menuAddMeta(menus) {
      // 添加meta属性，去除invisible
      menus.forEach((menu) => {
        menu.meta = {
          icon: menu.icon,
          invisible: menu.invisible
        }
        menu.children && this.menuAddMeta(menu.children)
      })
      return menus
    }
  },
  created() {
    this.correctPageMinHeight(this.minHeight - 24)
    this.setActivated(this.$route)
  },
  beforeDestroy() {
    this.correctPageMinHeight(-this.minHeight + 24)
  }
}
</script>

<style lang="less">
.admin-layout {
  height: 100vh;
  .side-menu {
    &.fixed-side {
      top: 0;
      //position: fixed;
      //height: calc(100% - 64px);
      left: 0;
    }
  }
  .ant-layout-sider-collapsed {
    flex: 0 0 60px !important;
    min-width: 60px !important;
    max-width: 60px !important;
    width: 60px !important;
  }
  .virtual-side {
    transition: all 0.2s;
  }
  .virtual-header {
    opacity: 0;
    transition: all 0.2s;
    &.fixed-tabs.multi-page:not(.fixed-header) {
      height: 0;
    }
  }
  .ant-layout-sider-children {
    height: 100%;
  }
  .admin-layout-main {
    .admin-header {
      top: 0;
      right: 0;
      overflow: hidden;
      transition: all 0.2s;
      &.fixed-tabs.multi-page:not(.fixed-header) {
        height: 0;
      }
    }
  }
  .admin-layout-content {
    height: auto;
  }
  .setting {
    width: 40px;
    height: 40px;
    border-radius: 5px 0 0 5px;
    background-color: @primary-color;
    box-shadow: -2px 0 8px @shadow-color;
    color: @base-bg-color;
    font-size: 22px;
    line-height: 40px;
  }
}
</style>
<style>
.ant-layout-header {
  padding: 0 0 !important;
  height: 60px;
  line-height: 60px;
}
</style>
