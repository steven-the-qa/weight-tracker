<script setup lang="ts">
  import DashboardThing from '../components/DashboardThing.vue';
  import LoadingThing from '../components/LoadingThing.vue'
</script>

<template>
  <main class="h-[90%] w-full bg-white text-black">
    <Suspense>
      <DashboardThing />
      <template #fallback><LoadingThing /></template>
    </Suspense>
  </main>
</template>
