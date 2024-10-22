<script setup lang="ts">
    import Dialog from './Dialog.vue'
    import { ref } from 'vue'
    const triggerState = ref(false)
    const handleDialog: VoidFunction = async () => {
        const dialog: HTMLElement = document.getElementById('dialog-container') as HTMLElement
        triggerState.value = !triggerState.value
        if (triggerState.value) {
            dialog.classList.replace('hidden', 'block')
        }
        else {
            dialog.classList.replace('block', 'hidden')
        }
    }
</script>

<template>
    <Dialog :handleDialog="handleDialog" message="Add your current weight" />
    <div class="flex justify-center items-center p-2 bg-[#6D1D7C] rounded-full cursor-pointer">
        <div :onclick="handleDialog" data-testid="add-weight-btn" class="bg-[url('/src/assets/plus.png')] bg-no-repeat bg-contain h-8 w-8"></div>
    </div>
</template>
