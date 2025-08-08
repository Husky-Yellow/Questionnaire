<script setup lang="ts">
import { computed } from 'vue'

interface OptionItem {
  label: string
  value: string
}

interface Props {
  modelValue: boolean
  title?: string
  options: OptionItem[]
  selected?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '请选择',
  options: () => [],
  selected: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  select: [value: string]
}>()

const open = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

function onSelect(value: string) {
  emit('select', value)
  open.value = false
}
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
    <div class="absolute inset-0 bg-black/40" @click="open=false"></div>
    <div class="relative w-full sm:w-[420px] max-h-[75vh] overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white">
      <header class="px-4 pt-4 pb-2 text-base font-600 border-b border-gray-100">{{ title }}</header>
      <div class="px-2 py-2 overflow-auto max-h-[60vh]">
        <button
          v-for="opt in options"
          :key="opt.value"
          class="w-full text-left px-3 py-3 rounded-lg flex items-center justify-between active:scale-98 transition border mb-2"
          :class="opt.value === selected ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 bg-white'"
          @click="onSelect(opt.value)"
        >
          <span>{{ opt.label }}</span>
          <span v-if="opt.value === selected" class="i-carbon-checkmark text-emerald-600 text-xl"></span>
        </button>
      </div>
      <div class="px-4 py-3 safe-area-bottom">
        <button class="w-full px-4 py-3 rounded-lg border bg-white active:bg-gray-50" @click="open=false">取消</button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>


