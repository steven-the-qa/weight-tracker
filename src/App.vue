<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, ref } from 'vue';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import router from './router';
const isLoggedIn = ref(false)

let auth: any;
let pfp: string | undefined;
onMounted(() => {
  auth = getAuth()
  onAuthStateChanged(auth, user => {
    if (user) {
      isLoggedIn.value = true
      pfp = user.photoURL as string
    }
    else {
      isLoggedIn.value = false
      pfp = undefined
    }
  })
})

const handleSignout = () => {
  signOut(auth).then(() => {
    router.push('/login')
  })
}
</script>

<template>
  <header v-if="$route.name !== 'login' && $route.name !== 'onboarding'">
    <h1 data-testid="app-name" class="flex justify-center items-center h-14 bg-[#2E7EFD] text-white text-lg font-bold">MyWeightTracker</h1>
    <img v-if="pfp" :src="pfp" alt="Profile pic from user's Google account" referrerpolicy="no-referrer" />
  </header>

  <RouterView />
  <button @click="handleSignout" v-if="isLoggedIn"> Sign out</button>
</template>