<script setup lang="ts">
import { useRouter } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
const router = useRouter()

function enter() {
  router.push({ name: 'passcode' })
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4">
    <img src="/favicon.ico" class="w-16 h-16 mb-4" alt="logo" />
    <h1 class="text-xl font-bold mb-6">问卷</h1>
    <base-button type="primary" size="large" @click="enter">开始</base-button>
  </div>
</template>
