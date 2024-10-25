<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { getAuth, signOut } from 'firebase/auth'
  import { doc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
  import { db } from '../firebase'
  import { useRouter } from 'vue-router'
  import NumberInput from "../components/NumberInput.vue";

  const router = useRouter()

  interface WeightEntry {
    unit: 'lb' | 'kg';
    weight: number;
    createdDate: Date;
  }

  const currentWeight = ref<number | null>(null)
  const goalWeight = ref<number | null>(null)
  const weightUnit = ref<'lb' | 'kg'>('lb')
  const state = reactive({ currentWeight, goalWeight, weightUnit })

  const toggleUnit = () => {
    state.weightUnit = state.weightUnit === 'lb' ? 'kg' : 'lb'
  }

  const handleSubmit = async () => {
    try {
      const user = getAuth().currentUser
      if (!user) throw new Error('No user logged in')
      if (currentWeight.value === null || goalWeight.value === null) return

      const userRef = doc(db, 'users', user.uid)
      const weightEntriesRef = collection(userRef, 'weightEntries')

      const currentWeightEntry: WeightEntry = {
        weight: currentWeight.value,
        unit: state.weightUnit,
        createdDate: new Date()
      }

      const goalWeightEntry: WeightEntry = {
        weight: goalWeight.value,
        unit: state.weightUnit,
        createdDate: new Date()
      }

      // Save current weight to weightEntries collection
      await addDoc(weightEntriesRef, {
        ...currentWeightEntry,
        createdDate: serverTimestamp()
      })

      // Save goal weight to user document
      await setDoc(userRef, {
        goalWeight: goalWeightEntry
      }, { merge: true })

      // Change this line to redirect to the dashboard
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
  <main class="h-screen w-full bg-white text-black flex flex-col items-center justify-center relative">
    <button 
      @click="handleLogout"
      class="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
    >
      Logout
    </button>
    <h1 class="text-2xl font-bold mb-8">Welcome! Let's set up your profile</h1>
    <form @submit.prevent="handleSubmit" class="w-full max-w-md">
      <div class="mb-6">
        <label for="current-weight" class="block mb-2 text-lg font-medium">
          What's your current weight?
        </label>
        <div class="flex items-center">
          <NumberInput
            v-model="currentWeight"
            id="current-weight"
            name="current-weight"
            :placeholder="`Enter current weight (${state.weightUnit})`"
            :min="0.1"
            :max="1000"
            class="flex-grow"
          />
          <button 
            type="button" 
            @click="toggleUnit" 
            class="ml-2 px-3 py-2 bg-gray-200 rounded"
          >
            {{ state.weightUnit }}
          </button>
        </div>
      </div>
      <div class="mb-6">
        <label for="goal-weight" class="block mb-2 text-lg font-medium">
          What's your goal weight?
        </label>
        <div class="flex items-center">
          <NumberInput
            v-model="goalWeight"
            id="goal-weight"
            name="goal-weight"
            :placeholder="`Enter goal weight (${state.weightUnit})`"
            :min="0.1"
            :max="1000"
            class="flex-grow"
          />
          <button 
            type="button" 
            @click="toggleUnit" 
            class="ml-2 px-3 py-2 bg-gray-200 rounded"
          >
            {{ state.weightUnit }}
          </button>
        </div>
      </div>
      <button 
        type="submit" 
        class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
      >
        Save and Continue
      </button>
    </form>
  </main>
</template>
