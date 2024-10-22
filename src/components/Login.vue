<script setup lang="ts">
  import GoogleLogin from './GoogleLogin.vue';
</script>

<template>
  <div class="flex flex-col w-full min-w-[330px]">
    <header>
      <h1 data-testid="app-name" class="flex justify-center items-center h-16 bg-[#2E7EFD] text-white text-lg font-bold lg:justify-start lg:pl-10 lg:text-4xl lg:bg-white lg:text-[#2E7EFD] lg:h-20 lg:font-['Kanit'] sm:text-2xl">
        MyWeightTracker
      </h1>
    </header>
    <div class="flex flex-col items-top lg:flex-row lg:items-start h-[100vh]">
      <div class="hidden lg:block w-[50%] h-full bg-[url('/src/assets/yoga.png')] bg-cover"></div>
      <section class="w-full lg:w-[50%] flex flex-col h-full justify-evenly">
        <div class="flex flex-col justify-between">
          <p data-testid="header-text" class="flex px-5 pb-3 bg-white text-black font-medium text-xl xs:text-2xl lg:text-3xl">
            Track your weight loss journey with ease and simplicity
          </p>
          <ul data-testid="goal-list" role="list" class="ml-12 list-disc font-light xs:text-xl lg:text-2xl">
            <li>Set a goal</li>
            <li>Track towards the goal</li>
          </ul>
        </div>
        <div class="flex justify-center w-full">
          <img class="w-full sm:w-[65%] md:w-[50%]" src="/src/assets/splash.png" alt="Athletic man facing the user, smiling with a thumbs-up gesture, standing next to an athletic woman with her body facing away but head turned back to look at the user, with blue splash pattern backdrop"/>
        </div>
        <div class="flex flex-col items-center w-full justify-end">
          <p class="flex justify-center items-center h-14 text-xl font-bold xs:text-2xl">Let's get started</p>
          <GoogleLogin />
        </div>
      </section>
    </div>
  </div>
</template>