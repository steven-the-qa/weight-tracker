<script setup lang="ts">
  import { getAuth } from 'firebase/auth'
  const firstName = getAuth().currentUser?.displayName?.split(' ')[0]
</script>

<template>
  <header>
    <h1 data-testid="app-name" class="flex justify-center items-center h-14 bg-[#2E7EFD] text-white text-lg font-bold">MyWeightTracker</h1>
  </header>
  <p data-testid="header-text" v-if="firstName" class="flex p-5 bg-white text-black font-medium text-xl">
    Let's get started, {{ firstName }}
  </p>
  <p v-else>Not able to retrieve current user</p>
  <p class="ml-3">Tell us a bit about yourself to set your goal and start tracking.</p>
</template>