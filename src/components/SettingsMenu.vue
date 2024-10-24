<script setup lang="ts">
import { ref } from 'vue';
import NumberInput from './NumberInput.vue'; // Import the NumberInput component

const props = defineProps({
  isMenuOpen: Boolean,
  goalWeight: Number,
  unit: String,
});

const emit = defineEmits(['toggleMenu', 'setUnit', 'saveSettings', 'handleSignout']);

const toggleMenu = () => {
  emit('toggleMenu'); // Emit the toggleMenu event
};

const goalWeight = ref<number | null>(props.goalWeight ?? null); // Initialize goalWeight to null if undefined

const handleSignout = () => {
  emit('handleSignout'); // Emit the handleSignout event
};

const setUnit = (newUnit: 'LB' | 'KG') => {
  emit('setUnit', newUnit);
};
</script>

<style scoped>
/* Add any specific styles for your component here */
</style>


<template>
  <div v-if="isMenuOpen" class="absolute top-14 right-0 bg-white shadow-lg p-4 w-64">
    <header class="flex justify-between items-center">
      <h1 class="text-xl">Settings</h1>
      <button @click="toggleMenu" class="text-black">✕</button>
    </header>
    <label for="goal-weight" class="block text-gray-700 mt-4">What’s your goal weight?</label>
    <!-- Use the NumberInput component here -->
    <NumberInput 
      id="goal-weight" 
      v-model="goalWeight" 
      placeholder="130" 
      :min="1" 
      :max="1000"
      class="border rounded w-full py-2 px-3 mb-4"
    />
    <div class="flex mb-4">
      <button @click="setUnit('LB')" :class="{'bg-purple-500 text-white': unit === 'LB', 'bg-gray-200': unit !== 'LB'}" class="flex-1 py-2 rounded-l">LB</button>
      <button @click="setUnit('KG')" :class="{'bg-purple-500 text-white': unit === 'KG', 'bg-gray-200': unit !== 'KG'}" class="flex-1 py-2 rounded-r">KG</button>
    </div>
    <button @click="handleSignout" class="text-blue-500 mt-4">Log out</button>
  </div>
</template>
