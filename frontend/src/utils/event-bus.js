/* eslint-disable import/prefer-default-export */
import VUE from 'vue';
/**
 * https://alligator.io/vuejs/global-event-bus/
 * eventBus.$emit('event', ...params);  emit an evnet
 * eventBus.$on('event', callback); listen `event` and do callback
 * eventBus.$off('event', callback); unregister callback when recieve `event`
 * eventBus.$off('event');
 * remove `event` listener --- unregister all callback when receive `event`
 * EvnetBus.$off(); remove all `event` register on eventBus
 *
 * NOTE: you'd better off event when you destroy your component
 */
const eventBus = new VUE();

const eventBusType = {
  WORKSPACE_PAYLOAD: 'WORKSPACE_PAYLOAD',
  WORKSPACE_THEME: 'WORKSPACE_THEME',
  WORKSPACE_CHANGE_CHART_TYPE: 'WORKSPACE_CHANGE_CHART_TYPE',
};

export { eventBus, eventBusType };

export default {
  install(Vue) {
    // eslint-disable-next-line
    Vue.prototype.$eventBus = eventBus;
  },
};
