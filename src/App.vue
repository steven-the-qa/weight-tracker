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
  <header v-if="$route.name == 'dashboard'" class="flex justify-between bg-[#2E7EFD] h-14 font-['Kanit'] min-w-[300px]">
    <h1 data-testid="app-name" class="flex items-center ml-3 text-white text-xl w-[75%] font-bold lg:font-semibold lg:text-2xl">MyWeightTracker</h1>
    <div class="flex justify-end items-center w-[25%] mr-3">
      <img class="rounded-full w-10 h-10" v-if="pfp" :src="pfp" alt="Profile pic from user's Google account" referrerpolicy="no-referrer" />
    </div>
  </header>

  <RouterView class="min-w-[300px]"/>
  <button v-if="$route.name == 'dashboard' && isLoggedIn" class="bg-red-500 w-full flex justify-center items-center h-10 text-white min-w-[300px]" @click="handleSignout">Sign out</button>
</template>