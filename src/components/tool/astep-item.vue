<template>
  <div :class="['step-item', link ? 'linkable' : null]">
    <span :style="titleStyle">
      <a-tag
        v-if="processState === 'successful' || processState === 'waiting'"
        color="orange"
        style="margin-left: 8px;margin-top: 3px"
      >
        {{ title }}
      </a-tag>
      <a-tag
        v-if="processState === 'running'"
        color="#ff794a"
        style="cursor: pointer;margin-left: 8px;margin-top: 3px"
        @click="goNext"
      >
        {{ title }}
      </a-tag>
      <a-tag
        v-if="processState === 'runningThenVisiable'"
        color="#ff794a"
        style="cursor: pointer;margin-left: 8px;margin-top: 3px"
        @click="actionClick"
      >
        {{ state }}
      </a-tag>
      <a-tag
        v-if="processState === 'notBegin'"
        color="#CECECE"
        style="margin-left: 8px;margin-top: 3px"
      >
        {{ title }}
      </a-tag>
      <a-tag
        v-if="processState === 'notClose'"
        color="#00000073"
        style="cursor: pointer;margin-left: 8px;margin-top: 3px"
      >
        <a-popconfirm
          placement="bottom"
          ok-text="确定"
          cancel-text="取消"
          @confirm="confirm"
        >
          <template slot="title">
            <p>确定要关闭此流程吗？</p>
          </template>
          关闭
        </a-popconfirm>
      </a-tag>
      <!--      <span v-else>{{title}}</span>-->
    </span>

    <slot />
  </div>
</template>

<script>
const Group = {
  name: 'AStepItemGroup',
  props: {
    align: {
      type: String,
      default: 'center',
      validator(value) {
        return ['left', 'center', 'right'].indexOf(value) != -1
      }
    }
  },
  render(h) {
    return h(
      'div',
      { attrs: { style: `text-align: center; margin-top: 8px` }},
      [
        h(
          'div',
          {
            attrs: {
              style: 'text-align: center; display: inline-block;backgroud:#red'
            }
          },
          [this.$slots.default]
        )
      ]
    )
  }
}

export default {
  name: 'AStepItem',
  Group: Group,
  props: [
    'title',
    'icon',
    'link',
    'titleStyle',
    'iconStyle',
    'processState',
    'state'
  ],
  methods: {
    go() {
      const link = this.link
      if (link) {
        this.$router.push(link)
      }
    },

    goNext() {
      this.$emit('goNext', this.state)
    },

    actionClick() {
      console.log('this.state', this.state)
      this.$emit('actionClick', this.state)
    },

    confirm() {
      this.$emit('confirm', '已关闭')
    }
  }
}
</script>

<style lang="less" scoped>
.step-item {
}
:global {
  .ant-steps-item-process {
    .linkable {
      color: @primary-color;
    }
  }
}
</style>
