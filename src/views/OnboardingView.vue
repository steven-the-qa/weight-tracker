<script setup lang="ts">
  import { ref } from 'vue';
  import { getAuth, signOut } from 'firebase/auth'
  import { doc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
  import { db } from '../firebase'
  import { useRouter } from 'vue-router'
  import NumberInput from "../components/NumberInput.vue";
  import ThemeToggle from "../components/ThemeToggle.vue";

  const router = useRouter()

  interface WeightEntry {
    unit: 'lb' | 'kg';
    weight: number;
    createdDate: Date;
  }

  const currentWeight = ref<number | null>(null)
  const goalWeight = ref<number | null>(null)
  const weightUnit = ref<'lb' | 'kg'>('lb')

  const toggleUnit = () => {
    weightUnit.value = weightUnit.value === 'lb' ? 'kg' : 'lb'
  }

  const handleSubmit = async () => {
    try {
      const user = getAuth().currentUser
      if (!user) throw new Error('No user logged in')
      if (currentWeight.value === null || goalWeight.value === null) return

      const userRef = doc(db, 'users', user.uid)
      const weightEntriesRef = collection(userRef, 'weightEntries')

      const createWeightEntry = (weight: number): WeightEntry => ({
        weight,
        unit: weightUnit.value,
        createdDate: new Date()
      })

      // Save current weight to weightEntries collection
      await addDoc(weightEntriesRef, {
        ...createWeightEntry(currentWeight.value),
        createdDate: serverTimestamp()
      })

      // Save goal weight and unit of measure to user document
      await setDoc(userRef, {
        goalWeight: createWeightEntry(goalWeight.value),
        unitOfMeasure: weightUnit.value
      }, { merge: true })

      router.push('/')
    } catch (error) {
      console.error('Error saving user data:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(getAuth())
      router.push('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }
</script>

<template>
  <main class="h-screen w-full dark:bg-gray-900 bg-white dark:text-white text-black flex flex-col items-center justify-center relative">
    <div class="absolute top-4 right-4 flex items-center gap-4">
      <ThemeToggle />
      <button 
        @click="handleLogout"
        class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
      >
        Logout
      </button>
    </div>
    <h1 class="text-2xl font-bold mb-8 px-4 text-center">Welcome! Let's set up your profile</h1>
    <div class="w-full px-6 sm:px-8 md:px-0">
      <form @submit.prevent="handleSubmit" class="w-full max-w-md mx-auto">
        <div class="mb-6">
          <label for="current-weight" class="block mb-2 text-lg font-medium dark:text-gray-200">
            What's your current weight?
          </label>
          <NumberInput
            v-model="currentWeight"
            id="current-weight"
            name="current-weight"
            :placeholder="`Enter current weight (${weightUnit})`"
            :min="0.1"
            :max="1000"
            class="w-full"
          />
        </div>
        <div class="mb-6">
          <label for="goal-weight" class="block mb-2 text-lg font-medium dark:text-gray-200">
            What's your goal weight?
          </label>
          <NumberInput
            v-model="goalWeight"
            id="goal-weight"
            name="goal-weight"
            :placeholder="`Enter goal weight (${weightUnit})`"
            :min="0.1"
            :max="1000"
            class="w-full"
          />
        </div>
        <div class="mb-6">
          <label class="block mb-2 text-lg font-medium dark:text-gray-200">Preferred unit of measure</label>
          <div class="flex">
            <button
              type="button"
              @click="toggleUnit"
              :class="{
                'bg-blue-600 text-white': weightUnit === 'lb',
                'dark:bg-gray-700 dark:text-gray-300 bg-gray-200 text-gray-700': weightUnit === 'kg'
              }"
              class="flex-1 py-2 px-4 rounded-l focus:outline-none transition-colors duration-200 hover:opacity-90"
            >
              lb
            </button>
            <button
              type="button"
              @click="toggleUnit"
              :class="{
                'bg-blue-600 text-white': weightUnit === 'kg',
                'dark:bg-gray-700 dark:text-gray-300 bg-gray-200 text-gray-700': weightUnit === 'lb'
              }"
              class="flex-1 py-2 px-4 rounded-r focus:outline-none transition-colors duration-200 hover:opacity-90"
            >
              kg
            </button>
          </div>
        </div>
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
        >
          Save and Continue
        </button>
      </form>
    </div>
  </main>
</template>
