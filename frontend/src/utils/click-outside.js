/* eslint-disable no-param-reassign, consistent-return */
export default {
  bind(el, binding) {
    function documentHandler(e) {
      /**
       * `Node.contains()`: https://developer.mozilla.org/zh-CN/docs/Web/API/Node/contains
       * if `e.target` is a descendant of `el` , do nothing.
       * else, `e.target` is outside of `el`
       */
      if (el.contains(e.target)) {
        return false;
      }

      if (binding.expression) {
        binding.value(e);
      }
    }

    el.__vueClickOutside__ = documentHandler;
    document.addEventListener('click', documentHandler);
  },

  update() {},

  unbind(el) {
    document.removeEventListener('click', el.__vueClickOutside__);
    delete el.__vueClickOutside__;
  },
};
