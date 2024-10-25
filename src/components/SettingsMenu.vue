<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import NumberInput from './NumberInput.vue'; // Import the NumberInput component
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

const props = defineProps({
  isMenuOpen: Boolean,
  goalWeight: Number,
  unit: {
    type: String as () => 'lb' | 'kg',
    required: true
  },
});

const emit = defineEmits(['toggleMenu', 'setUnit', 'saveSettings', 'handleSignout']);

const toggleMenu = () => {
  emit('toggleMenu'); // Emit the toggleMenu event
};

const goalWeight = ref<number | null>(props.goalWeight ?? null); // Initialize goalWeight to null if undefined
const tempGoalWeight = ref<number | null>(goalWeight.value);
const startingWeight = ref<number | null>(null);
const tempStartingWeight = ref<number | null>(null);

const currentUnit = ref<'lb' | 'kg'>(props.unit);

watch(() => props.unit, (newUnit) => {
  currentUnit.value = newUnit;
});

onMounted(async () => {
  const user = getAuth().currentUser;
  if (user) {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    if (userData) {
      if (userData.startingWeight) {
        startingWeight.value = userData.startingWeight.weight;
        tempStartingWeight.value = startingWeight.value;
      }
      if (userData.unitOfMeasure) {
        currentUnit.value = userData.unitOfMeasure;
        emit('setUnit', userData.unitOfMeasure); // Emit the updated unit to the parent
      }
    }
  }
});

const handleSignout = () => {
  emit('handleSignout'); // Emit the handleSignout event
};

const setUnit = async (newUnit: 'lb' | 'kg') => {
  currentUnit.value = newUnit;
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
  const user = getAuth().currentUser;
  if (user && tempGoalWeight.value !== null) {
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        goalWeight: { weight: tempGoalWeight.value, unit: currentUnit.value, createdDate: new Date() }
      });
      goalWeight.value = tempGoalWeight.value;
      emit('saveSettings', { goalWeight: goalWeight.value, unit: currentUnit.value });
      console.log('Goal weight updated in Firebase');
    } catch (error) {
      console.error("Error updating goal weight: ", error);
    }
  }
};

const updateStartingWeight = async () => {
  const user = getAuth().currentUser;
  if (user && tempStartingWeight.value !== null) {
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        startingWeight: { weight: tempStartingWeight.value, unit: currentUnit.value, createdDate: new Date() }
      });
      startingWeight.value = tempStartingWeight.value;
      emit('saveSettings', { startingWeight: startingWeight.value, unit: currentUnit.value });
      console.log('Starting weight updated in Firebase');
    } catch (error) {
      console.error("Error updating starting weight: ", error);
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
    <label for="goal-weight" class="block text-gray-700 mt-4">Goal Weight</label>
    <div class="flex items-center">
      <NumberInput
        id="goal-weight"
        v-model="tempGoalWeight"
        :placeholder="`New goal (${currentUnit})`"
        :min="1"
        :max="1000"
        class="border rounded w-full py-2 px-3 mb-4 flex-grow"
      />
      <button @click="updateGoalWeight" class="bg-blue-500 text-white py-2 px-4 rounded ml-2">Update</button>
    </div>
    <label for="starting-weight" class="block text-gray-700 mt-4">Starting Weight</label>
    <div class="flex items-center">
      <NumberInput
        id="starting-weight"
        v-model="tempStartingWeight"
        :placeholder="`New start (${currentUnit})`"
        :min="1"
        :max="1000"
        class="border rounded w-full py-2 px-3 mb-4 flex-grow"
      />
      <button @click="updateStartingWeight" class="bg-blue-500 text-white py-2 px-4 rounded ml-2">Update</button>
    </div>
    <div class="flex mt-4">
      <button 
        @click="setUnit('lb')" 
        :class="{
          'bg-blue-500 text-white': currentUnit === 'lb', 
          'bg-gray-200 text-gray-700': currentUnit !== 'lb'
        }" 
        class="flex-1 py-2 rounded-l"
      >
        lb
      </button>
      <button 
        @click="setUnit('kg')" 
        :class="{
          'bg-blue-500 text-white': currentUnit === 'kg', 
          'bg-gray-200 text-gray-700': currentUnit !== 'kg'
        }" 
        class="flex-1 py-2 rounded-r"
      >
        kg
      </button>
    </div>
    <button @click="handleSignout" class="text-blue-500 mt-4">Log out</button>
  </div>
</template>
