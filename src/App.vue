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
      <nav>
        <RouterLink to="/"> Home</RouterLink>
        <RouterLink to="/onboarding"> Onboarding</RouterLink>
        <button @click="handleSignout" v-if="isLoggedIn"> Sign out</button>
      </nav>
    </div>
  </header>

  <RouterView />
</template>