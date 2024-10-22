<script setup lang="ts">
import { ref, reactive } from 'vue';
import { getAuth } from 'firebase/auth'
import { doc, serverTimestamp, setDoc, collection, DocumentReference, CollectionReference, addDoc} from "firebase/firestore";
import { db } from '../firebase'
import router from '@/router';

  const user = getAuth().currentUser
  const firstName = user?.displayName?.split(' ')[0]
  const currentWeight = ref(null)
  const goalWeight = ref(null)
  const state = reactive({ currentWeight, goalWeight })
  const handleSubmit = async () => {
    try {
        if (user == null) return

        const userRef: DocumentReference = doc(db, 'users', user.uid)
        await setDoc(userRef, {
          goalWeight: state.goalWeight,
          currentWeight: state.currentWeight
        }, { merge: true })

        const weightEntriesRef: CollectionReference = collection(userRef, 'weightEntries')
        await addDoc(weightEntriesRef, {
          createdDate: serverTimestamp(),
          weight: state.currentWeight
        })

        router.push('/')
    }
    catch (e) {
      console.error("Error adding document: ", e);
    }
  }
</script>

<template>
  <div class="flex flex-col w-full min-w-[330px]">
    <header>
      <h1 data-testid="app-name" class="flex justify-center items-center h-16 bg-[#2E7EFD] text-white text-lg font-bold lg:justify-start lg:pl-10 lg:text-4xl lg:bg-white lg:text-[#2E7EFD] lg:h-20 lg:font-['Kanit'] sm:text-2xl">MyWeightTracker</h1>
    </header>
    <div class="flex flex-col items-top lg:flex-row lg:items-start h-[100vh]">
      <div class="hidden lg:block w-[50%] h-full bg-[url('/src/assets/yoga.png')] bg-cover"></div>
      <section class="w-full lg:w-[50%] flex flex-col h-full justify-start items-start">
        <p data-testid="header-text" v-if="firstName" class="flex justify-center p-5 bg-white text-black font-bold text-2xl w-full lg:text-3xl lg:justify-start">
          Let's get started, {{ firstName }}
        </p>
        <p v-else>Not able to retrieve current user</p>
        <p class="ml-3 mb-20 text-xl tracking-wide lg:text-2xl lg:ml-5 lg:mb-5">Tell us a bit about yourself to set your goal and start tracking.</p>
        <form @submit.prevent="handleSubmit" class="flex flex-col justify-evenly text-[#4B4B4B] text-lg h-[50%] tracking-wide w-full lg:justify-start lg:ml-3">
          <div id="current-weight-group" class="flex flex-col mb-5 mx-3">
            <label class="" for="current-weight">What's your current weight?</label>
            <input v-model="currentWeight" class="placeholder:text-[#BDBDBD] h-14 pl-3 mr-5 rounded-lg bg-white border border-[#BDBDBD] lg:w-[50%]" type="number" id="current-weight" name="current-weight" step="0.1" placeholder="enter current weight" required>
          </div>
          <div id="goal-weight-group" class="flex flex-col mx-3">
            <label for="goal-weight">What's your goal weight?</label>
            <input v-model="goalWeight" class="placeholder:text-[#BDBDBD] h-14 pl-3 mr-5 rounded-lg bg-white border border-[#BDBDBD] lg:w-[75%]" type="number" id="goal-weight" name="goal-weight" step="0.1" placeholder="enter goal weight" required>
          </div>
          <input class="mt-auto bg-[#2058E8] py-4 px-5 mx-3 rounded-xl text-white font-semibold lg:mt-5 lg:w-[20%]" type="submit" value="Continue" onsubmit="">
        </form>
      </section>
    </div>
  </div>
</template>