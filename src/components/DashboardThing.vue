<script setup lang="ts">
import { getAuth } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import type { DocumentReference, CollectionReference, DocumentSnapshot, DocumentData, QuerySnapshot } from 'firebase/firestore'
import { db } from '../firebase'

const user: User = getAuth().currentUser as User
const userRef: DocumentReference = doc(db, 'users', user.uid)
const userSnapshot: DocumentSnapshot = await getDoc(userRef)
const userData: DocumentData = userSnapshot.data() as DocumentData;
const weightEntriesRef: CollectionReference = collection(userRef, 'weightEntries')
const weightEntries: QuerySnapshot = await getDocs(weightEntriesRef)
const firstWeightEntry: number = weightEntries.docs[0].get('weight');

const startWeight: number = firstWeightEntry
const currentWeight: number = userData.currentWeight
const goalWeight: number = userData.goalWeight
const weightChange: number = startWeight - currentWeight
const displayedChange: string = weightChange > 0 ? `+ ${weightChange}` : weightChange < 0 ? `- ${weightChange}` : `${weightChange}`
</script>

<template>
    <div class="flex justify-between p-5 text-xl">
        <section class="flex flex-col justify-between">
        <div data-testid="start-weight" class="flex flex-col items-center">
            <p class="font-extrabold">Start</p>
            <p>{{ startWeight }}</p>
        </div>
        <div data-testid="weight-change" class="flex flex-col items-center">
            <p class="font-extrabold">Change</p>
            <p>{{ displayedChange }}</p>
        </div>
        </section>
        <section>
            <div data-testid="current-weight" class="flex flex-col items-center">
                <p class="font-extrabold">Current</p>
                <p>{{ currentWeight }}</p>
            </div>
        </section>
        <section>
            <div data-testid="goal-weight" class="flex flex-col items-center">
                <p class="font-extrabold">Goal</p>
                <p>{{ goalWeight }}</p>
            </div>
        </section>
    </div>
</template>