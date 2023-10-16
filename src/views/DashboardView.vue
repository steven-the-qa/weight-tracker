<script setup lang="ts">
  import DashboardThing from '../components/DashboardThing.vue';
</script>

<template>
  <main class="h-[100vh] bg-white text-black">
    <Suspense>
      <DashboardThing />
    </Suspense>
  </main>
</template>
