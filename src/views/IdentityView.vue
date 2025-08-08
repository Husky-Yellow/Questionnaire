<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestionnaireStore } from '@/stores/questionnaire'
import BaseButton from '@/components/base/BaseButton.vue'

const router = useRouter()
const store = useQuestionnaireStore()

const phone = ref('')
const name = ref('')
const idCard = ref('')
const error = ref('')
const loading = ref(false)

function isValidPhone(value: string) {
  return /^1\d{10}$/.test(value)
}

function isValidIdCard(value: string) {
  // 简化校验：18 位，最后一位可为数字或 X
  return /^(\d{17}[\dXx])$/.test(value)
}

async function onNext() {
  error.value = ''
  if (!isValidPhone(phone.value)) {
    error.value = '手机号格式不正确'
    return
  }
  if (!name.value.trim()) {
    error.value = '姓名为必填项'
    return
  }
  if (!isValidIdCard(idCard.value)) {
    error.value = '身份证号不合法'
    return
  }

  loading.value = true
  const res = await store.startSession({ phone: phone.value, name: name.value.trim(), idCard: idCard.value.toUpperCase() })
  loading.value = false
  if (!res.success) {
    error.value = res.message || '校验失败'
    return
  }
  router.push({ name: 'quiz' })
}
</script>

<template>
  <div class="h-[100svh] overflow-hidden grid grid-rows-[auto,1fr,auto] px-4 pt-6 safe-area-top bg-gradient-to-b from-[#f8fffd] to-white">
    <!-- 顶部品牌与标题 -->
    <div class="relative flex flex-col items-center mb-2">
      <div class="absolute -z-1 w-56 h-56 rounded-full blur-3xl opacity-35 bg-gradient-to-br from-teal-400 to-emerald-400 translate-y--18"></div>
      <div class="w-14 h-14 rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex-center shadow-md mb-3">
        <div class="i-carbon-user-avatar text-2xl" aria-hidden="true"></div>
      </div>
      <div class="text-xl font-800 tracking-tight text-gray-900">{{ store.questionnaire?.title || '身份验证' }}</div>
      <div class="mt-2 text-sm text-gray-600">请填写以下信息以进入答题</div>
    </div>

    <!-- 表单区（中部可滚动） -->
    <div class="min-h-0 overflow-y-auto py-4">
      <div class="card p-5 rounded-xl shadow-sm space-y-5 max-w-560 mx-auto">
        <!-- 手机号 -->
        <div>
          <label class="block text-sm text-gray-600 mb-2">手机号</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 i-carbon-phone text-lg" aria-hidden="true"></span>
            <input
              v-model="phone"
              type="tel"
              inputmode="numeric"
              maxlength="11"
              class="w-full h-12 pl-9 pr-3 rounded-xl border bg-white placeholder:text-gray-400 focus:(outline-none ring-2 ring-emerald-500 ring-offset-1)"
              placeholder="请输入手机号"
            />
          </div>
        </div>

        <!-- 姓名 -->
        <div>
          <label class="block text-sm text-gray-600 mb-2">姓名</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 i-carbon-user text-lg" aria-hidden="true"></span>
            <input
              v-model="name"
              type="text"
              class="w-full h-12 pl-9 pr-3 rounded-xl border bg-white placeholder:text-gray-400 focus:(outline-none ring-2 ring-emerald-500 ring-offset-1)"
              placeholder="请输入姓名"
            />
          </div>
        </div>

        <!-- 身份证号 -->
        <div>
          <label class="block text-sm text-gray-600 mb-2">身份证号</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 i-carbon-id text-lg" aria-hidden="true"></span>
            <input
              v-model="idCard"
              type="text"
              class="w-full h-12 pl-9 pr-3 rounded-xl border bg-white placeholder:text-gray-400 focus:(outline-none ring-2 ring-emerald-500 ring-offset-1)"
              placeholder="请输入身份证号"
            />
          </div>
        </div>

        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
      </div>
    </div>

    <!-- 底部操作 -->
    <div class="safe-area-bottom px-4 pb-4 pt-2 bg-gradient-to-t from-white/90 to-transparent backdrop-blur-sm">
      <div class="max-w-560 mx-auto">
        <base-button
          :loading="loading"
          block
          type="primary"
          size="large"
          @click="onNext"
          class="bg-gradient-to-r from-[#4facfe] to-[#00f2fe] hover:shadow-md hover:opacity-95 transition"
        >
          下一步
        </base-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

