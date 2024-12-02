<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, ref, watch } from 'vue';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import router from './router';
import SettingsMenu from './components/SettingsMenu.vue'; // Import the SettingsMenu component
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

const isLoggedIn = ref(false);
const isMenuOpen = ref(false); // State to track menu visibility
let auth: any;
let pfp: string | undefined;
const goalWeight = ref<number | undefined>(undefined); // State for goal weight
const unit = ref<'lb' | 'kg'>('lb'); // Default to 'lb'

const fetchUserSettings = async () => {
  const user = getAuth().currentUser;
  if (user) {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    if (userData && userData.unitOfMeasure) {
      unit.value = userData.unitOfMeasure;
    }
  }
};

onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      isLoggedIn.value = true;
      pfp = user.photoURL as string;
      await fetchUserSettings();
    } else {
      isLoggedIn.value = false;
      pfp = undefined;
    }
  });
});

const handleSignout = () => {
  signOut(auth).then(() => {
    isMenuOpen.value = false; // Close the menu on sign out
    router.push('/login');
  });
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value; // Toggle menu visibility
};

const setUnit = (newUnit: 'lb' | 'kg') => {
  unit.value = newUnit; // Update the unit state
};

const saveSettings = (settings: { goalWeight: number | undefined; unit: 'lb' | 'kg' }) => {
  goalWeight.value = settings.goalWeight; // Update goal weight
  unit.value = settings.unit; // Update unit
  console.log(`Goal Weight: ${goalWeight.value}, Unit: ${unit.value}`);
};

watch(isLoggedIn, async (newValue) => {
  if (newValue) {
    await fetchUserSettings();
  }
});
</script>

<template>
  <header v-if="$route.name == 'dashboard'" class="flex justify-between bg-[#2E7EFD] h-14 font-['Kanit'] min-w-[300px]">
  <h1 data-testid="app-name" class="flex items-center ml-3 text-white text-xl w-[75%] font-bold lg:font-semibold lg:text-2xl">MyWeightTracker</h1>
  <div class="flex justify-end items-center w-[25%] mr-3">
    <img class="rounded-full w-10 h-10 cursor-pointer" v-if="pfp" :src="pfp" alt="Profile pic from user's Google account" referrerpolicy="no-referrer" @click="toggleMenu" />
    </div>
  </header>

  <SettingsMenu
    :isMenuOpen="isMenuOpen"
    :goalWeight="goalWeight"
    :unit="unit"
    @toggleMenu="toggleMenu"
    @setUnit="setUnit"
    @saveSettings="saveSettings"
    @handleSignout="handleSignout"
  />

  <RouterView class="min-w-[300px] h-[calc(100vh-8rem)] overflow-hidden"/>
</template>
