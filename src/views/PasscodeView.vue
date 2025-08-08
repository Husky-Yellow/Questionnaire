<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestionnaireStore } from '@/stores/questionnaire'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseDialog from '@/components/base/BaseDialog.vue'
import { getPasscodes } from '@/api'
import BaseActionSheet from '@/components/base/BaseActionSheet.vue'

const router = useRouter()
const store = useQuestionnaireStore()

const passcode = ref('')
const loading = ref(false)
const error = ref('')
const showDialog = ref(false)

const passcodeOptions = ref<string[]>([])
const loadingPasscodes = ref(true)
const sheetOpen = ref(false)

async function fetchPasscodes() {
  // 后端下发可选口令
  try {
    const { data } = await getPasscodes()
    passcodeOptions.value = data.value ?? []
    if (passcodeOptions.value.length > 0) {
      // 预选第一个，降低首次点击成本
      passcode.value = passcodeOptions.value[0]
    }
  } finally {
    loadingPasscodes.value = false
  }
}

fetchPasscodes()

async function onConfirm() {
  error.value = ''
  if (!passcode.value) {
    error.value = '请选择口令'
    return
  }
  loading.value = true
  const res = await store.validatePasscode(passcode.value)
  loading.value = false
  if (!res.success) {
    error.value = res.message || '问卷未生效或已截止，无法进入下一步。'
    showDialog.value = true
    return
  }
  router.push({ name: 'identity' })
}

// 宫格已移除，保留下拉选择
</script>

<template>
  <div class="h-[100svh] overflow-hidden grid grid-rows-[auto,1fr,auto] px-4 pt-6 safe-area-top bg-gradient-to-b from-[#f8fffd] to-white">
    <!-- 青年感 Hero 区域 -->
    <div class="relative flex flex-col items-center">
      <div class="absolute -z-1 w-64 h-64 rounded-full blur-3xl opacity-35 bg-gradient-to-br from-teal-400 to-emerald-400 translate-y--18"></div>
      <div class="w-16 h-16 rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex-center shadow-md mb-3">
        <div class="i-carbon-key text-2xl" aria-hidden="true"></div>
      </div>
      <div class="text-2xl font-800 tracking-tight text-gray-900">选择口令</div>
      <div class="mt-2 text-sm text-gray-600 flex items-center gap-2">
        <span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">问卷入口</span>
        <span>挑一个，立刻开答</span>
      </div>
    </div>

    <!-- 表单卡片（中部自适应，不产生外层滚动） -->
    <div class="min-h-0 overflow-y-auto py-4">
      <div class="card w-full max-w-560 mx-auto p-5 rounded-xl shadow-sm">
        <label class="block text-sm text-gray-600 mb-2">口令</label>

        <div v-if="loadingPasscodes" class="animate-pulse h-11 rounded-lg bg-gray-100"></div>

        <!-- 改为行动面板样式选择，移动端更友好 -->
        <button
          v-else
          type="button"
          class="w-full h-12 px-3 rounded-xl border bg-white shadow-xs flex items-center justify-between active:bg-gray-50 focus:(outline-none ring-2 ring-emerald-500 ring-offset-1)"
          @click="sheetOpen = true"
        >
          <span class="inline-flex items-center gap-2 truncate text-gray-800">
            <span class="i-carbon-key text-emerald-500 text-xl" aria-hidden="true"></span>
            {{ passcode || '请选择口令' }}
          </span>
          <span class="i-carbon-chevron-down text-emerald-500 text-xl" aria-hidden="true"></span>
        </button>

        <p v-if="error" class="text-red-500 text-sm mt-3">{{ error }}</p>
      </div>
    </div>

    <!-- 底部行动区（占据第三行，不悬浮不挤压） -->
    <div class="safe-area-bottom px-4 pb-4 pt-2 bg-gradient-to-t from-white/90 to-transparent backdrop-blur-sm">
      <div class="max-w-560 mx-auto">
        <base-button
          :loading="loading"
          :disabled="!passcode"
          block
          type="primary"
          size="large"
          @click="onConfirm"
          class="animate-[pulse_1.8s_ease-in-out_1] bg-gradient-to-r from-[#4facfe] to-[#00f2fe] hover:shadow-md hover:opacity-95 transition will-change-transform"
        >
          进入下一步 →
        </base-button>
      </div>
    </div>
  </div>

  <BaseDialog v-model="showDialog" title="提示">
    问卷未生效或已截止，无法进入下一步。
  </BaseDialog>

  <BaseActionSheet
    v-model="sheetOpen"
    title="选择口令"
    :options="passcodeOptions.map(v => ({ label: v, value: v }))"
    :selected="passcode"
    @select="(v:string) => passcode = v"
  />
</template>

<style scoped>
</style>

