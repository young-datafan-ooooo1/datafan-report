<template>
  <div
    :class="[
      'detail-list',
      size === 'small' ? 'small' : 'large',
      layout === 'vertical' ? 'vertical' : 'horizontal'
    ]"
  >
    <div v-if="title" class="title">{{ title }}</div>
    <a-row>
      <slot />
    </a-row>
  </div>
</template>

<script>
import ACol from 'ant-design-vue/es/grid/Col'
const Item = {
  name: 'DetailListItem',
  props: {
    term: {
      type: String,
      required: false
    }
  },
  inject: {
    col: {
      type: Number
    }
  },
  methods: {
    renderTerm(h, term) {
      return term
        ? h(
          'div',
          {
            attrs: {
              class: 'term'
            }
          },
          [term]
        )
        : null
    },
    renderContent(h, content) {
      return h(
        'div',
        {
          attrs: {
            class: 'content'
          }
        },
        [content]
      )
    }
  },
  render(h) {
    const term = this.renderTerm(h, this.$props.term)
    const content = this.renderContent(h, this.$slots.default)
    return h(
      ACol,
      {
        props: responsive[this.col]
      },
      [term, content]
    )
  }
}

const responsive = {
  1: { xs: 24 },
  2: { xs: 24, sm: 12 },
  3: { xs: 24, sm: 12, md: 8 },
  4: { xs: 24, sm: 12, md: 6 }
}

export default {
  name: 'DetailList',
  Item: Item,
  provide() {
    return {
      col: this.col > 4 ? 4 : this.col
    }
  },
  props: {
    title: {
      type: String,
      required: false
    },
    col: {
      type: Number,
      required: false,
      default: 3
    },
    size: {
      type: String,
      required: false,
      default: 'large'
    },
    layout: {
      type: String,
      required: false,
      default: 'horizontal'
    }
  }
}
</script>

<style lang="less">
.detail-list {
  .title {
    margin-bottom: 16px;
    color: @title-color;
    font-weight: 500;
    font-size: 16px;
  }

  .term {
    display: table-cell;
    margin-right: 8px;
    padding-bottom: 16px;
    padding-left: 12px;
    height: 38px;
    color: #595959;
    white-space: nowrap;
    font-weight: 400;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    &:after {
      position: relative;
      top: -0.5px;
      margin: 0 8px 0 0px;
      content: ':';
    }
  }
  .content {
    display: table-cell;
    padding-bottom: 16px;
    width: 100%;
    color: #595959;
    font-weight: 400;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    line-height: 22px;
  }
  &.small {
    .title {
      margin-bottom: 12px;
      color: @text-color;
      font-weight: normal;
      font-size: 14px;
    }
    .term,
    .content {
      padding-bottom: 8px;
    }
  }
  &.large {
    .term,
    .content {
      padding-bottom: 16px;
      word-break: break-all;
    }
  }
  &.vertical {
    .term {
      padding-bottom: 8px;
    }
    .term,
    .content {
      display: block;
    }
  }
}
</style>
