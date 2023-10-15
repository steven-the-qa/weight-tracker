<script setup lang="ts">
    // import { getAuth } from 'firebase/auth'
    // Get doc for getAuth().currentUser?.uid
    const startWeight: number = 255.0
    const currentWeight: number = 220.0
    const goalWeight: number = 199.0
    const weightChange: number = Math.abs(startWeight - currentWeight)
</script>

<template>
    <p>Start: {{ startWeight }}</p>
    <p>Current: {{ currentWeight }}</p>
    <p>Goal: {{ goalWeight }}</p>
    <p>Change: {{ weightChange }}</p>
</template>