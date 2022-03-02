<!--
 * @Description: 公共字典选择框组件
 * @Date: 2021-06-17 10:17:44
 * @LastEditTime: 2021-09-10 11:25:18
-->
<template>
  <a-select v-model="itemData" class="dict-select" allow-clear :placeholder="placeholder" :loading="isLoading" @select="onSelect">
    <a-select-option
      v-for="item in codes"
      :key="item.dictCode"
      :value="item.dictCode"
    >
      {{ item.dictValue }}
    </a-select-option>
  </a-select>
</template>

<script>
import { getDictByType } from '@/services/dict'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'DictSelect',
  props: {
    // 选中项
    itemModel: {
      type: String,
      default: ''
    },
    // 字典类型
    dictType: {
      type: String,
      default: ''
    },
    // 选择提示
    placeholder: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      codes: [],
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('dict', ['dictObj']),
    // 选择框数据
    itemData: {
      set(val) {
        this.$emit('update:itemModel', val || undefined)
      },
      get() {
        return this.itemModel || undefined
      }
    }
  },
  watch: {
    // 监听字典类型，更新获取
    dictType() {
      this.getData()
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    ...mapMutations('dict', ['setDictItem']),
    /**
     * @description: 获取字典数据
     */
    getData() {
      // 字典键名参数是否存在
      if (!this.dictType) {
        return
      }
      // 获取store中当前字典是否存在
      const dictInStore = this.dictObj && this.dictObj[this.dictType]
      if (dictInStore) {
        this.codes = dictInStore
        return
      }
      this.isLoading = true
      getDictByType({ dictType: this.dictType }).then(res => {
        const { data } = res
        this.codes = data.data || []
        // 设置字典键名的store数据
        this.setDictItem({ key: this.dictType, value: data.data })
      }).finally(() => {
        this.isLoading = false
      })
    },
    /**
     * @description: 选择框改变事件
     * @param {string} value 选中项value值
     */
    onSelect(value) {
      this.$emit('update:itemModel', value)
      this.$emit('change', value)
    }
  }
}
</script>
