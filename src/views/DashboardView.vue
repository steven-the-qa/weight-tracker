<script setup lang="ts">
  import LoadingView from './LoadingView.vue'
  import AddWeight from '../components/AddWeight.vue'
  import { ref, onMounted } from 'vue';
  import type { Ref } from 'vue'
  import { getAuth } from 'firebase/auth'
  import type { User } from 'firebase/auth'
  import { onSnapshot, doc, getDocs, collection, query, orderBy, limit } from "firebase/firestore";
  import type { DocumentReference, CollectionReference, DocumentData, Query } from 'firebase/firestore'
  import { db } from '../firebase'
  const user: Ref<User | null> = ref(null)
  const startWeight: Ref<number | null> = ref(null)
  const currentWeight: Ref<number | null> = ref(null)
  const goalWeight: Ref<number | null> = ref(null)
  const weightChange: Ref<number | null> = ref(null)
  const displayedChange: Ref<string> = ref('')
  const changeColor: Ref<string> = ref('')
  const isLoading: Ref<boolean> = ref(true)

  onMounted(async () => {
    try {
      user.value = getAuth().currentUser
      if (!user.value) throw new Error('No user logged in')

      const userRef: DocumentReference = doc(db, 'users', user.value.uid)

      const weightEntriesRef: CollectionReference = collection(userRef, 'weightEntries')
      const firstWeightEntryQ: Query = query(weightEntriesRef, orderBy('createdDate'), limit(1))
      const firstWeightEntry: DocumentData = (await getDocs(firstWeightEntryQ)).docs[0]
      startWeight.value = firstWeightEntry.get('weight');

      onSnapshot(userRef, (userSnapshot) => {
        const data = userSnapshot.data() as DocumentData
        currentWeight.value = data.currentWeight
        goalWeight.value = data.goalWeight
        updateWeightChange()
      })

      isLoading.value = false
    } catch (error) {
      console.error('Error loading dashboard:', error)
      isLoading.value = false
    }
  })

  function updateWeightChange() {
    if (startWeight.value !== null && currentWeight.value !== null) {
      weightChange.value = startWeight.value - currentWeight.value
      displayedChange.value = weightChange.value > 0 
        ? `-${weightChange.value.toFixed(1)} lb` 
        : weightChange.value < 0 
          ? `+${Math.abs(weightChange.value).toFixed(1)} lb` 
          : `${weightChange.value.toFixed(1)} lb`
      changeColor.value = weightChange.value < 0 
        ? 'text-[#EA4335]' 
        : weightChange.value > 0 
          ? 'text-[#34A853]' 
          : 'text-[#4B4B4B]'
    }
  }
</script>

<template>
  <main class="h-[90%] w-full bg-white text-black">
    <Suspense>
      <div class="flex flex-col items-center h-full">
        <h1 class="hidden lg:block text-2xl font-bold text-left w-[50%] ml-10 mt-5">Good morning, Steven!</h1>
        <div class="w-full h-full lg:flex lg:flex-col lg:justify-center lg:items-center">
            <div class="h-full grid grid-cols-auto grid-rows-6 p-5 text-xl font-bold text-black lg:w-[50%]">
                <section class="flex justify-between items-start row-span-auto">
                    <div data-testid="start-weight" class="flex flex-col items-center">
                        <p>Start</p>
                        <p class="text-[#4B4B4B]">{{ startWeight }}</p>
                    </div>
                    <div data-testid="current-weight" class="flex flex-col items-center">
                        <p>Current</p>
                        <p class="text-[#2E7EFD]">{{ currentWeight }}</p>
                    </div>
                    <div data-testid="goal-weight" class="flex flex-col items-center">
                        <p>Goal</p>
                        <p class="text-[#4B4B4B]">{{ goalWeight }}</p>
                    </div>
                </section>
                <section class="flex justify-center items-center row-span-2">
                    <!-- <div class="flex justify-center items-center h-44 w-72 bg-[#D9D9D9]">
                        TBD - Graph
                    </div> -->
                </section>
                <section class="flex justify-between items-end row-span-2">
                    <div data-testid="weight-change" class="flex flex-col justify-center items-center">
                        <p>Change</p>
                        <p :class="changeColor">{{ displayedChange }}</p>
                    </div>
                    <AddWeight />
                </section>
              </div>
          </div>
      </div>
      <template #fallback><LoadingView /></template>
    </Suspense>
  </main>
</template>
