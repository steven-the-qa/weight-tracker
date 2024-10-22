<script setup lang="ts">
  import Dashboard from '../components/Dashboard.vue';
  import LoadingThing from '../components/Loading.vue'
</script>

<template>
  <main class="h-[90%] w-full bg-white text-black">
    <Suspense>
      <Dashboard />
      <template #fallback><LoadingThing /></template>
    </Suspense>
  </main>
</template>
