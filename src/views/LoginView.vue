<script setup lang="ts">
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { doc, setDoc, getDoc } from 'firebase/firestore';
  import { db } from '../firebase';
  import { useRouter } from 'vue-router';
  import GoogleLogin from '../components/GoogleLogin.vue';

  const router = useRouter();

  onAuthStateChanged(getAuth(), async (user) => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      const userData = {
        email: user.email,
        name: user.displayName,
        pfp: user.photoURL,
        lastLogin: new Date()
      };

      if (!userSnap.exists()) {
        // Create new user document
        await setDoc(userRef, {
          ...userData,
          createdAt: new Date()
        });
      } else {
        // Update existing user document
        await setDoc(userRef, userData, { merge: true });
      }

      // Redirect to dashboard or onboarding
      router.push('/');
    }
  });
</script>

<template>
  <main class="h-screen w-full bg-white text-black overflow-hidden">
    <div class="flex flex-col w-full h-full">
      <header class="flex-shrink-0">
        <h1 data-testid="app-name" class="flex justify-center items-center h-12 bg-[#2E7EFD] text-white text-lg font-bold lg:justify-start lg:pl-10 lg:text-3xl lg:bg-white lg:text-[#2E7EFD] lg:h-16 lg:font-['Kanit'] sm:text-xl">
          MyWeightTracker
        </h1>
      </header>
      <div class="flex flex-col items-top flex-1 lg:flex-row lg:items-start">
        <div class="hidden lg:block lg:w-1/2 bg-[url('/src/assets/yoga.png')] bg-cover bg-center h-full"></div>
        <section class="w-full lg:w-1/2 flex flex-col h-full justify-between p-4">
          <div class="flex flex-col">
            <p data-testid="header-text" class="px-5 pb-2 text-black font-medium text-lg xs:text-xl lg:text-2xl">
              Track your weight loss journey with ease and simplicity
            </p>
            <ul data-testid="goal-list" role="list" class="ml-12 list-disc font-light text-sm xs:text-base lg:text-lg">
              <li>Set a goal</li>
              <li>Track towards the goal</li>
            </ul>
          </div>
          <div class="flex justify-center w-full flex-1 py-4">
            <img
              class="w-full max-h-[35vh] object-contain sm:w-[65%] md:w-[50%]"
              src="/src/assets/splash.png"
              alt="Athletic man facing the user, smiling with a thumbs-up gesture, standing next to an athletic woman with her body facing away but head turned back to look at the user, with blue splash pattern backdrop"
            />
          </div>
          <div class="flex flex-col items-center w-full">
            <p class="flex justify-center items-center h-10 text-lg font-bold xs:text-xl">Let's get started</p>
            <GoogleLogin />
          </div>
        </section>
      </div>
    </div>
  </main>
</template>
