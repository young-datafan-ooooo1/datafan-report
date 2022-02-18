<template>
  <div
    v-click-outside="onClose"
    :class="[
      'flex-box',
      `${prefixCls}`,
      `${prefixCls}--${size}`,
      'flex-box--center-items'
    ]"
  >
    <a-input
      v-show="isEdit"
      ref="input"
      v-model="inputVal"
      :placeholder="placeholder"
      :size="size"
      :class="[
        'lc-layout__flex',
        `${prefixCls}__input`,
      ]"
      @keyup.enter.native="onClose"
      @on-blur="onClose"
    />

    <span
      v-show="!isEdit"
      :class="[
        'flex-box',
        'flex-box--center-items',
        'flex-box-col-small',
      ]"
      @click="stopClick"
      @dblclick="showEditInput"
    >
      {{ value || '请输入标题' }}
    </span>
    <div :class="[`${prefixCls}__icon-box`, 'flex-box-col-small']">
      <a-icon
        v-show="!isEdit"
        type="edit"
        size="xsmall"
        :class="[
          `${prefixCls}__edit--icon`,
        ]"
        @click.native="showEditInput"
      />
    </div>
  </div>
</template>

<script>
import ClickOutside from '@/utils/click-outside'

export default {
  name: 'ModifyInput',

  directives: { ClickOutside },

  props: {
    value: {
      type: [String, Number],
      default: ''
    },

    size: {
      type: String,
      default: 'default'
    },

    placeholder: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    validateMethod: {
      type: Function,
      default: null
    },

    halfWidth: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      prefixCls: 'modify-input',
      inputVal: this.value,
      isEdit: false
    }
  },

  methods: {
    stopClick(event) {
      event.stopPropagation()
    },
    showEditInput(event) {
      event.stopPropagation()

      this.inputVal = this.value
      this.isEdit = true
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },

    onClose() {
      /**
       * emit when from show to hidden
       */
      if (this.isEdit) {
        this.$emit('on-close')
        this.isEdit = false

        if (this.required && !String.trim(this.inputVal)) {
          this.inputVal = this.value
          return
        }

        if (this.validateMethod && typeof this.validateMethod === 'function') {
          const { pass, message } = this.validateMethod(this.inputVal)
          if (!pass) {
            this.$Message.warning(message)
            this.inputVal = this.value
            return
          }
        }

        if (this.value !== this.inputVal) {
          this.$emit('on-change', this.inputVal)
        }
      }
    }
  }
}
</script>
<style lang="scss">
.modify-input {
  cursor: pointer;
  &--primary {
    height: 20px;
  }

  &--large {
    height: 20px;
  }

  &__edit--icon {
    display: none;
    cursor: pointer;
  }
  &:hover &__edit--icon {
    display: block;
  }
  &__icon-box {
    width: 20px;
    height: 20px;
  }
}
</style>
