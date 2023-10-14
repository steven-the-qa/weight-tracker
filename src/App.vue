<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, ref } from 'vue';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import router from './router';
const isLoggedIn = ref(false)

let auth: any;
onMounted(() => {
  auth = getAuth()
  onAuthStateChanged(auth, user => {
    if (user) {
      isLoggedIn.value = true
    }
    else {
      isLoggedIn.value = false
    }
  })
})

const handleSignout = () => {
  signOut(auth).then(() => {
    router.push('/')
  })
}
</script>

<template>
  <header>
    <div>
      <h1 data-testid="app-name" class="flex justify-center items-center h-14 bg-[#2E7EFD] text-white text-lg font-bold">MyWeightTracker</h1>
      <nav>
        <button @click="handleSignout" v-if="isLoggedIn"> Sign out</button>
      </nav>
    </div>
  </header>

  <RouterView />
</template>