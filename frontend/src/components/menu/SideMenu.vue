<template>
  <!-- eslint-disable vue/no-mutating-props  -->
  <a-layout-sider
    v-model="collapsed"
    :theme="sideTheme"
    :class="['side-menu', 'beauty-scroll', isMobile ? null : 'shadow']"
    width="200px"
    :collapsible="collapsible"
    :trigger="null"
  >
    <i-menu
      v-if="menuData.length!==0"
      :theme="theme"
      :collapsed="false"
      :options="menuData"
      :all-open-keys="allOpenKeys"
      class="menu"
      @select="onSelect"
    />
    <a-icon v-else class="menu-loading" type="loading" />
    <div v-if="menuData.length!==0" class="menu-collapse" @click="toggleCollapse">
      <img :src="assetsUrl+ '/common/img/menu-collapse.png'" alt="menu-collapsed" :class="['menu-collapse__img', collapsed? 'collapsed': '']">
    </div>
  </a-layout-sider>
</template>

<script>
import IMenu from './menu'
import { mapState } from 'vuex'
import { ASSETS_URL } from '@/services/api'

export default {
  name: 'SideMenu',
  components: { IMenu },
  props: {
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: true
    },
    menuData: {
      type: Array,
      required: true
    },
    allOpenKeys: {
      type: Array,
      default: () => []
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    }
  },
  data() {
    return {
      assetsUrl: ASSETS_URL
    }
  },
  computed: {
    sideTheme() {
      return this.theme == 'light' ? this.theme : 'dark'
    },
    ...mapState('setting', ['isMobile', 'systemName'])
  },
  methods: {
    toggleCollapse() {
      this.$emit('toggleCollapse')
    },
    onSelect(obj) {
      this.$emit('menuSelect', obj)
    }
  }
}
</script>
