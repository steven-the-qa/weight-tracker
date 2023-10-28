<script setup lang="ts">
    import AddWeight from './AddWeight.vue'
    import { ref, reactive } from 'vue';
    import type { Ref } from 'vue'
    import { getAuth } from 'firebase/auth'
    import type { User } from 'firebase/auth'
    import { onSnapshot, doc, getDoc, getDocs, collection, query, orderBy, limit } from "firebase/firestore";
    import type { DocumentReference, CollectionReference, DocumentData, Query } from 'firebase/firestore'
    import { db } from '../firebase'
    const user: User = getAuth().currentUser as User
    const userRef: DocumentReference = doc(db, 'users', user.uid)
    const userData: DocumentData = (await getDoc(userRef)).data() as DocumentData
    let startWeight: number;
    const currentWeight: Ref<number | null> = ref(null)
    const goalWeight: Ref<number | null> = ref(null)
    const weightChange: Ref<number | null> = ref(null)
    const displayedChange: Ref<string> = ref('')
    const changeColor: Ref<string> = ref('')
    const state = reactive({ userData, currentWeight, goalWeight, weightChange, displayedChange, changeColor })

    const weightEntriesRef: CollectionReference = collection(userRef, 'weightEntries')
    const firstWeightEntryQ: Query = query(weightEntriesRef, orderBy('createdDate'), limit(1))
    const firstWeightEntry: DocumentData = (await getDocs(firstWeightEntryQ)).docs[0]
    startWeight = firstWeightEntry.get('weight');

    onSnapshot(userRef, async (userSnapshot) => {
        state.userData = (userSnapshot).data() as DocumentData
        state.currentWeight = state.userData.currentWeight
        state.goalWeight = state.userData.goalWeight
        state.weightChange = state.currentWeight ? (startWeight - state.currentWeight) : 0
        state.displayedChange = state.weightChange > 0 ? `-${state.weightChange.toFixed(1)} lb` : state.weightChange < 0 ? `+${Math.abs(state.weightChange).toFixed(1)} lb` : `${state.weightChange.toFixed(1)} lb`
        state.changeColor = state.weightChange < 0 ? 'text-[#EA4335]' : state.weightChange > 0 ? 'text-[#34A853]' : 'text-[#4B4B4B]'
    })
</script>

<template>
    <div class="flex flex-col items-center h-full">
        <header>
            <h1 data-testid="app-name" class="flex justify-center items-center h-14 bg-[#2E7EFD] text-white text-lg font-bold w-[100vw] lg:justify-start lg:pl-5 lg:text-xl">MyWeightTracker</h1>
        </header>
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
</template>