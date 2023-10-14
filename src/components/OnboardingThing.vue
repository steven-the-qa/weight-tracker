<script setup lang="ts">
  import { useUserStore } from '../stores/users'
  const userStore = useUserStore()
  const currentUser = userStore.user
</script>

<template>
    <p data-testid="header-text" v-if="currentUser" class="flex p-5 bg-white text-black font-medium text-xl">
      Let's get started, {{ currentUser.displayName }}
    </p>
    <p v-else>Not able to retrieve current user</p>
    <p>Tell us a bit about yourself to set your goal and start tracking.</p>
</template>