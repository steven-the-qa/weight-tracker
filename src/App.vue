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
  <header v-if="$route.name == 'dashboard'" class="flex justify-between bg-[#2E7EFD] h-[10%] font-['Kanit']">
    <h1 data-testid="app-name" class="flex items-center pl-4 text-white text-xl w-[75%]">MyWeightTracker</h1>
    <img class="flex justify-center items-center rounded-full p-4" v-if="pfp" :src="pfp" alt="Profile pic from user's Google account" referrerpolicy="no-referrer" />
  </header>

  <RouterView />
  <button v-if="$route.name != 'login'" class="bg-red-500 w-full flex justify-center items-center h-10 text-white" @click="handleSignout"> Sign out</button>
</template>