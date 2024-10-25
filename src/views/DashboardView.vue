<script setup lang="ts">
  import Dashboard from '../components/Dashboard.vue';
  import LoadingView from './LoadingView.vue'
</script>

<template>
  <main class="h-[90%] w-full bg-white text-black">
    <Suspense>
      <Dashboard />
      <template #fallback><LoadingView /></template>
    </Suspense>
  </main>
</template>
