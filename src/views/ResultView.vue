<script setup lang="ts">
import { useQuestionnaireStore } from '@/stores/questionnaire'
const store = useQuestionnaireStore()
</script>

<template>
  <div class="min-h-screen px-4 py-16 safe-area-top safe-area-bottom flex flex-col items-center justify-center text-center">
    <img :src="store.questionnaire?.logoUrl || '/favicon.ico'" alt="logo" class="w-16 h-16 mb-6" />
    <div class="text-2xl font-bold mb-2">已答完</div>
    <div class="text-gray-600">感谢您的参与！</div>
  </div>
</template>

<style scoped>
</style>

