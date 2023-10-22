<script setup lang="ts">
    import AddWeight from './AddWeight.vue'
    import { ref, reactive } from 'vue';
    import type { Ref } from 'vue'
    import { getAuth } from 'firebase/auth'
    import type { User } from 'firebase/auth'
    import { doc, getDoc, getDocs, collection, query, orderBy, limit } from "firebase/firestore";
    import type { DocumentReference, CollectionReference, DocumentSnapshot, DocumentData, Query } from 'firebase/firestore'
    import { db } from '../firebase'
    const user: User = getAuth().currentUser as User

    const currentWeight: Ref<number | null> = ref(null)
    const goalWeight: Ref<number | null> = ref(null)
    const state = reactive({ currentWeight, goalWeight })

    const userRef: DocumentReference = doc(db, 'users', user.uid)
    const userData: DocumentData = (await getDoc(userRef)).data() as DocumentData
    const weightEntriesRef: CollectionReference = collection(userRef, 'weightEntries')
    const firstWeightEntryQ: Query = query(weightEntriesRef, orderBy('createdDate'), limit(1))
    const firstWeightEntry: DocumentData = (await getDocs(firstWeightEntryQ)).docs[0]

    const startWeight: number = firstWeightEntry.get('weight');
    state.currentWeight = userData.currentWeight
    state.goalWeight = userData.goalWeight
    const weightChange: number = state.currentWeight ? (startWeight - state.currentWeight) : 0
    const displayedChange: string = weightChange > 0 ? `-${weightChange.toFixed(1)} lb` : weightChange < 0 ? `+${Math.abs(weightChange).toFixed(1)} lb` : `${weightChange.toFixed(1)} lb`
    const changeColor: string = weightChange > 0 ? 'text-[#EA4335]' : weightChange < 0 ? 'text-[#34A853]' : 'text-[#4B4B4B]'
</script>

<template>
    <div class="h-[90%] grid grid-cols-auto grid-rows-6 p-5 text-xl font-bold text-black">
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
        <section class="flex justify-center items-center row-span-3">
            <!-- <div class="flex justify-center items-center h-44 w-72 bg-[#D9D9D9]">
                TBD - Graph
            </div> -->
        </section>
        <section class="flex justify-between items-end row-span-auto">
            <div data-testid="weight-change" class="flex flex-col justify-center items-center">
                <p>Change</p>
                <p :class="changeColor">{{ displayedChange }}</p>
            </div>
            <AddWeight />
        </section>
    </div>
</template>