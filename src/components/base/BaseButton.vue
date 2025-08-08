<template>
  <button :class="buttonClass" :disabled="disabled || loading" @click="handleClick">
    <div
      v-if="loading"
      class="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
    ></div>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  size: 'medium',
  disabled: false,
  loading: false,
  block: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClass = computed(() => {
  const baseClass =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 touch-action active:scale-95'

  const typeClass = {
    primary: 'bg-blue-500 text-white active:bg-blue-600 disabled:bg-gray-300',
    secondary: 'bg-gray-200 text-gray-800 active:bg-gray-300 disabled:bg-gray-100',
    danger: 'bg-red-500 text-white active:bg-red-600 disabled:bg-gray-300',
    ghost:
      'bg-transparent border border-gray-300 text-gray-700 active:bg-gray-50 disabled:text-gray-400',
  }[props.type]

  const sizeClass = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  }[props.size]

  const blockClass = props.block ? 'w-full' : ''
  const disabledClass =
    props.disabled || props.loading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'

  return `${baseClass} ${typeClass} ${sizeClass} ${blockClass} ${disabledClass}`
})

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>
