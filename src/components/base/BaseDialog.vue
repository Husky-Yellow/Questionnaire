<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  confirmText?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  confirmText: '我知道了',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()

const open = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

function onConfirm() {
  emit('confirm')
  open.value = false
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="open=false"></div>
      <div class="relative bg-white w-full sm:w-[420px] rounded-t-2xl sm:rounded-2xl p-5 space-y-3">
        <div class="text-base font-semibold" v-if="title">{{ title }}</div>
        <div class="text-sm text-gray-700"><slot /></div>
        <div class="mt-4">
          <base-button type="primary" block @click="onConfirm">{{ confirmText }}</base-button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- 兼容 iOS 安全区域 -->
</template>

<style scoped></style>


