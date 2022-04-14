<!--
 * @Description: 数据为空提示图片/文字组件
 * @Date: 2021-09-01 18:58:43
 -->
<template>
  <div :class="`empty empty--${size}`">
    <img class="empty__img" :src="emptyImg" :alt="text" draggable="false">
    <p class="empty__text">{{ text }}</p>
    <p class="empty__description">{{ description }}</p>
  </div>
</template>

<script>
import { ASSETS_URL } from '@/services/api'

// 提示图片尺码
const SIZE = ['large', 'middle', 'small']

export default {
  props: {
    // 空数据提示
    text: {
      type: String,
      default: '暂无数据'
    },
    // 空数据提示详情
    description: {
      type: String,
      default: ''
    },
    // 提示图片尺码
    size: {
      type: String,
      validator(val) {
        return SIZE.includes(val)
      },
      default: 'large'
    }
  },
  data() {
    return {
      // 空数据提示图片
      emptyImg: `${ASSETS_URL}/common/img/table-empty.png`
    }
  }
}
</script>

<style lang="less" scoped>
.empty {
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 12px;
  &.empty--large {
    font-size: 14px;
    .empty__img {
      width: 11vw;
    }
  }
  &.empty--middle {
    font-size: 13px;
    .empty__img {
      width: 8vw;
    }
  }
  &.empty--small {
    font-size: 12px;
    .empty__img {
      width: 5vw;
    }
  }
  &__text {
    margin: 10px 0 0 0;
  }
  &__description {
    margin: 5px 0 0 0;
  }
  &__text, &__description {
    color: #AAAAAA;
    font-weight: 400;
    line-height: 1;
  }
}
</style>
