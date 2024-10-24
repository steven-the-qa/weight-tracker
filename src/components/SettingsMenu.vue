<script setup lang="ts">
import { ref } from 'vue';
import NumberInput from './NumberInput.vue'; // Import the NumberInput component
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

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
const tempGoalWeight = ref<number | null>(goalWeight.value);

const handleSignout = () => {
  emit('handleSignout'); // Emit the handleSignout event
};

const setUnit = async (newUnit: 'LB' | 'KG') => {
  emit('setUnit', newUnit);

  // Get the current user
  const user = getAuth().currentUser;
  if (user) {
    try {
      // Reference to the user's document in Firestore
      const userRef = doc(db, 'users', user.uid);

      // Update the unit of measure in the user's document
      await updateDoc(userRef, {
        unitOfMeasure: newUnit
      });
    } catch (error) {
      console.error("Error updating unit of measure: ", error);
    }
  }
};

const updateGoalWeight = async () => {
  console.log('Updating goal weight:', tempGoalWeight.value);
  goalWeight.value = tempGoalWeight.value;
  emit('saveSettings', { goalWeight: goalWeight.value, unit: props.unit });

  const user = getAuth().currentUser;
  if (user) {
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        goalWeight: goalWeight.value
      });
      console.log('Goal weight updated in Firebase');
    } catch (error) {
      console.error("Error updating goal weight: ", error);
    }
  }
};
</script>

<template>
  <div v-if="isMenuOpen" class="absolute top-14 right-0 bg-white shadow-lg p-4 w-64">
    <header class="flex justify-between items-center">
      <h1 class="text-xl">Settings</h1>
      <button @click="toggleMenu" class="text-black">✕</button>
    </header>
    <label for="goal-weight" class="block text-gray-700 mt-4">What’s your goal weight?</label>
    <NumberInput
      id="goal-weight"
      v-model="tempGoalWeight"
      placeholder="150"
      :min="1"
      :max="1000"
      class="border rounded w-full py-2 px-3 mb-4"
    />
    <button @click="updateGoalWeight" class="bg-blue-500 text-white py-2 px-4 rounded">Update Goal</button>
    <div class="flex mb-4">
      <button @click="setUnit('LB')" :class="{'bg-purple-500 text-white': unit === 'LB', 'bg-gray-200': unit !== 'LB'}" class="flex-1 py-2 rounded-l">LB</button>
      <button @click="setUnit('KG')" :class="{'bg-purple-500 text-white': unit === 'KG', 'bg-gray-200': unit !== 'KG'}" class="flex-1 py-2 rounded-r">KG</button>
    </div>
    <button @click="handleSignout" class="text-blue-500 mt-4">Log out</button>
  </div>
</template>
