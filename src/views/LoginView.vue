<script setup lang="ts">
  import GoogleLogin from '../components/GoogleLogin.vue';
</script>

<template>
  <main class="bg-white text-black">
    <div class="flex flex-col w-full min-w-[330px] h-screen">
    <header class="flex-shrink-0">
      <h1 data-testid="app-name" class="flex justify-center items-center h-12 bg-[#2E7EFD] text-white text-lg font-bold lg:justify-start lg:pl-10 lg:text-3xl lg:bg-white lg:text-[#2E7EFD] lg:h-16 lg:font-['Kanit'] sm:text-xl">
        MyWeightTracker
      </h1>
    </header>
    <div class="flex flex-col items-top flex-grow lg:flex-row lg:items-start overflow-hidden">
      <div class="hidden lg:block lg:w-1/2 bg-[url('/src/assets/yoga.png')] bg-cover bg-center h-full"></div>
      <section class="w-full lg:w-1/2 flex flex-col h-full justify-between py-4">
        <div class="flex flex-col justify-between">
          <p data-testid="header-text" class="px-5 pb-2 bg-white text-black font-medium text-lg xs:text-xl lg:text-2xl">
            Track your weight loss journey with ease and simplicity
          </p>
          <ul data-testid="goal-list" role="list" class="ml-12 list-disc font-light text-sm xs:text-base lg:text-lg">
            <li>Set a goal</li>
            <li>Track towards the goal</li>
          </ul>
        </div>
        <div class="flex justify-center w-full">
          <img class="w-full max-h-[40vh] object-contain sm:w-[65%] md:w-[50%]" src="/src/assets/splash.png" alt="Athletic man facing the user, smiling with a thumbs-up gesture, standing next to an athletic woman with her body facing away but head turned back to look at the user, with blue splash pattern backdrop"/>
        </div>
        <div class="flex flex-col items-center w-full">
          <p class="flex justify-center items-center h-10 text-lg font-bold xs:text-xl">Let's get started</p>
          <GoogleLogin />
        </div>
      </section>
      </div>
    </div>
  </main>
</template>
