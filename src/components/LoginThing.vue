<script setup lang="ts">
  import GoogleLogin from './GoogleLogin.vue';
</script>

<template>
  <div class="flex flex-col w-full">
    <header>
      <h1 data-testid="app-name" class="flex justify-center items-center h-14 bg-[#2E7EFD] text-white text-lg font-bold md:justify-start md:pl-10 md:text-4xl md:bg-white md:text-[#2E7EFD] md:h-20 md:font-['Kanit']">MyWeightTracker</h1>
    </header>
    <div class="flex flex-col items-center md:flex-row md:items-start">
      <img class="hidden md:block h-auto w-[60%] hidden-sm-and-down" src="/src/assets/yoga.png" alt="outdoor yoga class leaning forward to touch their toes" />
      <section class="w-[50%]">
        <p data-testid="header-text" class="flex p-5 bg-white text-black font-medium text-xl md:text-2xl">
          Track your weight loss journey with ease and simplicity
        </p>
        <ul data-testid="goal-list" role="list" class="ml-12 list-disc font-light md:text-xl">
          <li>Set a goal</li>
          <li>Track towards the goal</li>
        </ul>
        <div class="flex flex-col items-center h-[50%] justify-end">
          <img class="md:w-[40%]" src="/src/assets/splash.png" alt="Athletic man facing the user, smiling with a thumbs-up gesture, standing next to an athletic woman with her body facing away but head turned back to look at the user, with blue splash pattern backdrop"/>
          <p class="flex justify-center items-center h-14 text-xl font-bold">Let's get started</p>
        <GoogleLogin />
        </div>
      </section>
    </div>
  </div>
</template>