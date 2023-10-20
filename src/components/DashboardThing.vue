<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { Ref } from 'vue'
import { getAuth } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { doc, getDoc, getDocs, collection, setDoc, addDoc, serverTimestamp } from "firebase/firestore";
import type { DocumentReference, CollectionReference, DocumentSnapshot, DocumentData, QuerySnapshot } from 'firebase/firestore'
import { db } from '../firebase'
const currentWeight: Ref<number | null> = ref(null)
const goalWeight: Ref<number | null> = ref(null)
const state = reactive({ currentWeight, goalWeight })

const user: User = getAuth().currentUser as User
const userRef: DocumentReference = doc(db, 'users', user.uid)
const userSnapshot: DocumentSnapshot = await getDoc(userRef)
const userData: DocumentData = userSnapshot.data() as DocumentData;
const weightEntriesRef: CollectionReference = collection(userRef, 'weightEntries')
const weightEntries: QuerySnapshot = await getDocs(weightEntriesRef)
const firstWeightEntry: number = weightEntries.docs[0].get('weight');

const startWeight: number = firstWeightEntry
state.currentWeight = userData.currentWeight
state.goalWeight = userData.goalWeight
const weightChange: number = state.currentWeight ? (startWeight - state.currentWeight) : 0
const displayedChange: string = weightChange > 0 ? `+${weightChange.toFixed(1)} lb` : weightChange < 0 ? `-${Math.abs(weightChange).toFixed(1)} lb` : `${weightChange.toFixed(1)} lb`
const changeColor: string = weightChange > 0 ? 'text-[#EA4335]' : weightChange < 0 ? 'text-[#34A853]' : 'text-[#4B4B4B]'

const addWeight = async () => {
    try {
        if (user == null) return
        await setDoc(userRef, {
          currentWeight: state.currentWeight,
        }, { merge: true })

        await addDoc(weightEntriesRef, {
          createdDate: serverTimestamp(),
          weight: state.currentWeight
        })
    }
    catch (e) {
      console.error("Error adding document: ", e);
    }
}
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
            <div class="flex justify-center items-center p-2 bg-[#6D1D7C] rounded-full">
                <div data-testid="add-weight-btn" class="bg-[url('/src/assets/plus.png')] bg-no-repeat bg-contain h-8 w-8" />
            </div>
        </section>
    </div>
</template>