<!--
 * @Description: 默认弹窗封装
 * @Date: 2021-11-18 14:19:25
 -->
<template>
  <a-modal
    v-model="isModalShow"
    class="base-modal"
    v-bind="{
      maskClosable,
      ...$attrs,
    }"
    v-on="$listeners"
  >
    <div class="base-modal__content">
      <slot />
    </div>
  </a-modal>
</template>

<script>

export default {
  name: 'AbaseModal',
  model: {
    prop: 'visible',
    event: 'change'
  },
  props: {
    // modal显示隐藏
    visible: {
      type: Boolean,
      default: false
    },
    // 点击遮罩层是否可以关闭
    maskClosable: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      // 是否显示modal
      isModalShow: false
    }
  },
  watch: {
    // 监听显示隐藏，控制data数据
    visible(val) {
      this.isModalShow = val
    }
  }
}
</script>
<style lang="less" scoped>
.base-modal {
  &__content {
    overflow: auto;
    // 300是个大概值
    max-height: calc(100vh - 300px);
  }
}
</style>
