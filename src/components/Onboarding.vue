<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive } from 'vue';
import { getAuth, signOut } from 'firebase/auth'
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

const handleLogout = () => {
  const auth = getAuth();
  signOut(auth).then(() => {
    router.push('/login')
  }).catch((error) => {
    console.error("Error signing out: ", error);
  });
}

const filterInput = (event: KeyboardEvent) => {
  const input = event.target as HTMLInputElement;
  const currentValue = input.value;
  const key = event.key;

  // Allow backspace and arrow keys
  if (key === 'Backspace' || key === 'ArrowLeft' || key === 'ArrowRight') {
    return;
  }

  // Allow numbers
  if (/^[0-9]$/.test(key)) {
    const newValue = currentValue + key;
    if (parseFloat(newValue) > 1000) {
      event.preventDefault();
    }
    return;
  }

  // Allow decimal point only if it doesn't exist and there's a number before it
  if (key === '.' && !currentValue.includes('.') && currentValue.length > 0) {
    return;
  }

  // Prevent default for any other key
  event.preventDefault();
}

const formatInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value;
  const parts = value.split('.');
  if (parts.length > 1) {
    parts[1] = parts[1].slice(0, 1);
    value = parts.join('.');
  }
  const numValue = parseFloat(value);
  if (numValue > 1000) {
    value = '1000';
  }
  input.value = value;
}
</script>

<template>
  <div class="flex flex-col w-full min-w-[330px] h-screen">
    <header class="flex-shrink-0">
      <h1 data-testid="app-name" class="flex justify-center items-center h-16 bg-[#2E7EFD] text-white text-lg font-bold lg:justify-start lg:pl-10 lg:text-4xl lg:bg-white lg:text-[#2E7EFD] lg:h-20 lg:font-['Kanit'] sm:text-2xl">MyWeightTracker</h1>
    </header>
    <div class="flex flex-col items-top flex-grow lg:flex-row lg:items-start overflow-hidden">
      <div class="hidden lg:block lg:w-1/2 bg-[url('/src/assets/yoga.png')] bg-cover bg-center h-full"></div>
      <section class="w-full lg:w-1/2 flex flex-col h-full justify-start py-4 relative">
        <button @click="handleLogout" class="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors">
          Logout
        </button>
        <div class="flex flex-col justify-start flex-grow">
          <div>
            <p data-testid="header-text" v-if="firstName" class="flex justify-center p-5 bg-white text-black font-bold text-2xl w-full lg:text-3xl lg:justify-start">
              Let's get started, {{ firstName }}
            </p>
            <p v-else>Not able to retrieve current user</p>
            <p class="ml-3 mb-5 text-xl tracking-wide lg:text-2xl lg:ml-5">Tell us a bit about yourself to set your goal and start tracking.</p>
          </div>
          <form @submit.prevent="handleSubmit" class="flex flex-col justify-evenly text-[#4B4B4B] text-lg tracking-wide w-full lg:justify-start lg:ml-3">
            <div id="current-weight-group" class="flex flex-col mb-5 mx-3">
              <label class="" for="current-weight">What's your current weight?</label>
              <input
                v-model="currentWeight"
                @keydown="filterInput"
                @input="formatInput"
                class="no-spinner placeholder:text-[#BDBDBD] h-14 pl-3 mr-5 rounded-lg bg-white border border-[#BDBDBD] lg:w-[50%]"
                type="text"
                id="current-weight"
                name="current-weight"
                min="0.1"
                step="0.1"
                pattern="^\d+(\.\d{0,1})?$"
                placeholder="enter current weight"
                required
              >
            </div>
            <div id="goal-weight-group" class="flex flex-col mx-3">
              <label for="goal-weight">What's your goal weight?</label>
              <input
                v-model="goalWeight"
                @keydown="filterInput"
                @input="formatInput"
                class="no-spinner placeholder:text-[#BDBDBD] h-14 pl-3 mr-5 rounded-lg bg-white border border-[#BDBDBD] lg:w-[75%]"
                type="text"
                id="goal-weight"
                name="goal-weight"
                min="0.1"
                step="0.1"
                pattern="^\d+(\.\d{0,1})?$"
                placeholder="enter goal weight"
                required
              >
            </div>
            <input class="mt-5 bg-[#2058E8] py-4 px-5 mx-3 rounded-xl text-white font-semibold lg:w-[20%]" type="submit" value="Continue">
          </form>
        </div>
      </section>
    </div>
  </div>
</template>
