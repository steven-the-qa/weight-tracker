<script setup lang="ts">
import GoogleSSO from './GoogleSSO.vue'
const callback = (response: any) => {
  // This callback will be triggered when user click on the One Tap prompt
  // This callback will be also triggered when user click on login button 
  // and selects or login to his Google account from the popup
  console.log("Handle the response", response)
}
</script>

<template>
  <GoogleLogin :callback="callback" prompt auto-login>
    <GoogleSSO />
  </GoogleLogin>
</template>