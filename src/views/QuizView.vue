<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { useQuestionnaireStore } from '@/stores/questionnaire'
import BaseButton from '@/components/base/BaseButton.vue'

const router = useRouter()
const store = useQuestionnaireStore()

const showProgress = ref(false)
const tick = ref<number>(0)
let timer: number | null = null
// 使用 vueuse 的防抖来保护保存与下一题点击

const remainingDisplay = computed(() => {
  const sec = store.remainingSeconds
  if (sec == null) return ''
  const v = typeof sec === 'number' ? sec : 0
  const m = Math.floor(v / 60)
  const s = v % 60
  return `${m}:${s.toString().padStart(2, '0')}`
})

const progressPercent = computed(() => {
  if (!store.total) return 0
  return Math.min(100, Math.round(((store.currentIndex + 1) / store.total) * 100))
})

const isLast = computed(() => store.currentIndex === store.total - 1)
const currentSelected = computed(() => {
  const q = store.currentQuestion
  return q ? store.answers[q.id] : undefined
})

function startTimer() {
  if (timer) window.clearInterval(timer)
  timer = window.setInterval(() => {
    tick.value++
    if (store.remainingSeconds != null) {
      const current = typeof store.remainingSeconds === 'number' ? store.remainingSeconds : 0
      store.remainingSeconds = Math.max(0, current - 1)
      if (store.remainingSeconds === 0) {
        onSubmit()
      }
    }
  }, 1000) as unknown as number
}

onMounted(() => {
  if (!store.sessionId || !store.questionnaire) {
    router.replace({ name: 'passcode' })
    return
  }
  store.restoreLocal()
  startTimer()
})

onUnmounted(() => {
  if (timer) window.clearInterval(timer)
})

watch(
  () => store.answers,
  () => {
    store.saveLocal()
    debouncedSaveRemote()
  },
  { deep: true }
)

const debouncedSaveRemote = useDebounceFn(() => {
  store.saveRemote()
}, 800)

async function onSubmit() {
  const res = await store.submit()
  if (res.success) router.replace({ name: 'result' })
}

function onSelect(optionId: string) {
  store.answerCurrent(optionId)
}

function doNext() {
  if (!currentSelected.value) return
  if (isLast.value) onSubmit()
  else store.goNext()
}

const onNext = useDebounceFn(doNext, 300)

function onPrev() {
  store.goPrev()
}

function openProgress() {
  showProgress.value = true
}

function goTo(index: number) {
  store.goToIndex(index)
  showProgress.value = false
}
</script>

<template>
  <div class="h-[100svh] overflow-hidden grid grid-rows-[auto,1fr] px-4 pt-4 safe-area-top">
    <!-- 顶部：标题 + 计时 + 进度条 -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center">
          <img :src="store.questionnaire?.logoUrl || '/favicon.ico'" alt="logo" class="w-8 h-8 mr-2" />
          <div class="font-semibold">{{ store.questionnaire?.title || '问卷' }}</div>
        </div>
        <div v-if="store.remainingSeconds != null" class="text-sm font-600 text-gray-700">⏱ {{ remainingDisplay }}</div>
      </div>
      <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
        <div class="h-full bg-gradient-to-r from-emerald-400 to-teal-500" :style="{ width: progressPercent + '%' }"></div>
      </div>
    </div>

    <!-- 内容：题干 + 选项 + 底部操作（内部滚动） -->
    <div class="min-h-0 overflow-y-auto pb-24">
      <div v-if="store.currentQuestion" class="card p-4 rounded-xl shadow-sm max-w-560 mx-auto">
        <div class="text-sm text-gray-500 mb-1">第 {{ store.currentIndex + 1 }} / {{ store.total }} 题</div>
        <div class="text-[18px] leading-relaxed font-600 text-gray-900 mb-3">{{ store.currentQuestion.title }}</div>
        <img v-if="store.currentQuestion.imageUrl" :src="store.currentQuestion.imageUrl" class="w-full rounded mb-3" />

        <div class="space-y-3">
          <button
            v-for="opt in store.currentQuestion.options"
            :key="opt.id"
            class="w-full p-3 rounded-xl border text-left active:scale-98 transition"
            :class="store.answers[store.currentQuestion.id] === opt.id
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
              : 'bg-white border-gray-200 text-gray-800 hover:border-emerald-300'"
            @click="onSelect(opt.id)">
            <div class="flex items-center gap-2">
              <span v-if="store.answers[store.currentQuestion.id] === opt.id" class="i-carbon-checkmark text-emerald-600 text-xl"></span>
              <span>{{ opt.text }}</span>
            </div>
          </button>
        </div>

        <div class="flex gap-3 mt-6">
          <base-button type="ghost" class="flex-1 bg-[#EAF3FF] text-[#1E66F5] hover:opacity-90" @click="onPrev">上一题</base-button>
          <base-button
            type="primary"
            class="flex-1 bg-gradient-to-r from-[#4facfe] to-[#00f2fe] hover:shadow-md"
            :disabled="!currentSelected"
            @click="onNext"
          >
            {{ isLast ? '提交' : '下一题' }}
          </base-button>
        </div>
      </div>

      <!-- 悬浮进度入口 -->
      <button class="fixed right-4 bottom-24 z-20 rounded-full shadow-lg bg-emerald-500 text-white w-12 h-12 flex-center active:scale-95" @click="openProgress">
        <span class="text-lg">{{ store.progress.filter(p => p.answered).length }}</span>
      </button>

      <div v-if="showProgress" class="fixed inset-0 bg-black/30 flex items-end" @click.self="showProgress=false">
        <div class="bg-white w-full rounded-t-2xl p-4 max-h-[70vh] overflow-auto">
          <div class="grid grid-cols-5 gap-2">
            <button v-for="(id, idx) in store.orderedQuestionIds" :key="id" @click="goTo(idx)" class="p-2 rounded text-sm"
              :class="store.answers[id] ? 'bg-green-100 border border-green-400' : 'bg-gray-50 border'">
              {{ idx + 1 }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

