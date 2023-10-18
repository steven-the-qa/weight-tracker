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
    <p>Start: {{ startWeight }}</p>
    <p>Current: {{ currentWeight }}</p>
    <p>Goal: {{ goalWeight }}</p>
    <p>Change: {{ displayedChange }}</p>
</template>