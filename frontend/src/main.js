/*
 * @Description: 主配置
 * @Date: 2022-01-21 14:48:10
  */
import Vue from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import store from './store'
import Plugins from '@/plugins'
import { initI18n } from '@/utils/i18n'
import 'moment/locale/zh-cn'
import { loginIgnore } from '@/router/index'
import Cookie from 'js-cookie'
import SSComponent from '@sense70/common-component-vue'
import { bootstrap, initialRouter, patchComponent } from '@sense70/common-component-vue'
const router = initialRouter(require('@/router/config').default)
import '@sense70/common-sysmanage-vue/fonts/iconfont.css'
import './static/css/utilities.min.css'
import './theme/index.less'
import './theme/common.less'
import './components/menu/index.less'
import 'xe-utils'
import VXETable from 'vxe-table'
import '@sense70/common-component-vue/assets/commonCss.less'
import '@sense70/common-component-vue/assets/page-table.scss'
// 引入flex布局
import '@/assets/css/flex-layout.css'
import { ABaseModal } from './components/common'
Vue.component('ABaseModal', ABaseModal)
// Vue.component('SenseTable', SenseTable)
const i18n = initI18n('CN', 'US')
Vue.use(Antd)
import vcolorpicker from 'vcolorpicker'
Vue.use(vcolorpicker)
import VCharts from 'v-charts'
Vue.use(VCharts)

import Empty from '@/components/common/empty'
// 设置VXETable空内容模板
VXETable.renderer.add('no-data', {
  renderEmpty(h, params) {
    return [
      <Empty text={params.text} size={params.size} description={params.description}/>
    ]
  }
})
Vue.use(VXETable)

Vue.config.productionTip = false
Vue.use(Viser)
Vue.use(Plugins)
Vue.use(SSComponent)

bootstrap({
  router,
  store,
  i18n,
  message: Vue.prototype.$message,
  notification: Vue.prototype.$notification,
  name: 'dashboard'
})

const VueInstance = new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
patchComponent(VueInstance)

router.beforeEach((to, from, next) => {
  const auth = Cookie.get('Authorization')
  if (auth) {
    next()
  } else {
    if (loginIgnore.includes(to)) {
      next()
    } else {
      router.push('/login')
    }
  }
})

