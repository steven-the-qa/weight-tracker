import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import OnboardingView from '../views/OnboardingView.vue'
import DashboardView from '../views/DashboardView.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { doc, getDocs, collection } from "firebase/firestore";
import type { DocumentReference, CollectionReference } from 'firebase/firestore'
import { db } from '../firebase'

const router = createRouter({
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: OnboardingView,
      meta: {
        requiresAuth: true
      },
      beforeEnter: async (to, from, next) => {
        const user: User = getAuth().currentUser as User
        const userRef: DocumentReference = doc(db, 'users', user.uid)
        const weightEntriesRef: CollectionReference = collection(userRef, 'weightEntries')

        if ((await getDocs(weightEntriesRef)).docs.length > 0) {
          next('/')
        }
        else {
          next()
        }
      }
    },
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

const getCurrentUser = async () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener()
        resolve(user)
      },
      reject
    )
  })
}

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    await getCurrentUser() ? next() : next('/login')
  }
  else {
    next()
  }
})

export default router