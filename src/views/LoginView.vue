<script setup lang="ts">
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { doc, setDoc, getDoc } from 'firebase/firestore';
  import { db } from '../firebase';
  import { useRouter } from 'vue-router';
  import GoogleLogin from '@/components/GoogleLogin.vue';
  import ThemeToggle from '@/components/ThemeToggle.vue';
  import yogaImage from '/assets/yoga.png'
  import splashImage from '/assets/splash.png'

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
  <main class="w-full h-screen dark:bg-gray-900 bg-white dark:text-white text-black overflow-hidden">
    <div class="flex flex-col h-full">
      <header class="flex-shrink-0 relative">
        <div class="absolute right-4 top-1/2 -translate-y-1/2 z-10">
          <ThemeToggle />
        </div>
        <h1 data-testid="app-name" class="flex justify-center items-center h-12 bg-blue-600 text-white text-lg font-bold lg:justify-start lg:pl-10 lg:text-3xl lg:dark:bg-gray-900 lg:bg-white lg:text-blue-500 lg:h-16 lg:font-['Kanit'] sm:text-xl">
          MyWeightTracker
        </h1>
      </header>
      <div class="flex flex-col flex-1 lg:flex-row">
        <div class="hidden lg:block lg:w-1/2 bg-cover bg-center bg-no-repeat opacity-90 dark:opacity-75" 
             :style="{
               backgroundImage: `url(${yogaImage})`,
               minHeight: 'calc(100vh - 4rem)'
             }">
        </div>
        <section class="w-full lg:w-1/2 flex flex-col">
          <div class="flex flex-col space-y-4 p-4">
            <div>
              <p data-testid="header-text" class="px-5 pb-2 dark:text-white text-black font-medium text-lg xs:text-xl lg:text-2xl">
                Track your weight loss journey with ease and simplicity
              </p>
              <ul data-testid="goal-list" role="list" class="ml-12 list-disc font-light text-sm dark:text-gray-300 xs:text-base lg:text-lg">
                <li>Set a goal</li>
                <li>Track towards the goal</li>
              </ul>
            </div>
            <div class="hidden md:block flex-1">
              <img
                class="w-[300px] mx-auto object-contain rounded-2xl"
                :src="splashImage"
                alt="Athletic man facing the user, smiling with a thumbs-up gesture, standing next to an athletic woman with her body facing away but head turned back to look at the user, with blue splash pattern backdrop"
              />
            </div>
            <div class="flex flex-col items-center">
              <p class="flex justify-center items-center h-8 text-lg font-bold dark:text-white xs:text-xl mb-2">Let's get started</p>
              <GoogleLogin />
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>
