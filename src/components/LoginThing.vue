<script setup lang="ts">
  import GoogleLogin from './GoogleLogin.vue';
</script>

<template>
  <header>
    <h1 data-testid="app-name" class="flex justify-center items-center h-14 bg-[#2E7EFD] text-white text-lg font-bold">MyWeightTracker</h1>
  </header>
  <p data-testid="header-text" class="flex p-5 bg-white text-black font-medium text-xl">
    Track your weight loss journey with ease and simplicity
  </p>
  <ul data-testid="goal-list" role="list" class="ml-12 mb-5 list-disc font-light">
    <li>Set a goal</li>
    <li>Track towards the goal</li>
  </ul>
  <img src="/src/assets/splash.png" alt="Athletic man facing the user, smiling with a thumbs-up gesture, standing next to an athletic woman with her body facing away but head turned back to look at the user, with blue splash pattern backdrop"/>
  <p class="flex justify-center items-center h-14 text-xl font-bold">Let's get started</p>
  <GoogleLogin />
</template>