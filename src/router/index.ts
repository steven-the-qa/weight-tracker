import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import OnboardingView from '../views/OnboardingView.vue'
import DashboardView from '../views/DashboardView.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { doc, getDoc } from "firebase/firestore";
import type { DocumentReference } from 'firebase/firestore'
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
      component: LoginView,
      beforeEnter: async (to, from, next) => {
        const user = await getCurrentUser()
        if (user) {
          next('/')
        } else {
          next()
        }
      }
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: OnboardingView,
      meta: {
        requiresAuth: true
      },
      beforeEnter: async (to, from, next) => {
        const user = await getCurrentUser()
        if (!user) {
          next('/login')
          return
        }
        const userRef: DocumentReference = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userRef)
        const userData = userDoc.data()
        if (userData && userData.goalWeight && userData.currentWeight) {
          next('/')
        } else {
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
      },
      beforeEnter: async (to, from, next) => {
        const user = await getCurrentUser()
        if (!user) {
          next('/login')
          return
        }
        const userRef: DocumentReference = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userRef)
        const userData = userDoc.data()
        if (!userData || !userData.goalWeight || !userData.currentWeight) {
          next('/onboarding')
        } else {
          next()
        }
      }
    }
  ]
})

const getCurrentUser = () => {
  return new Promise<User | null>((resolve, reject) => {
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
    const user = await getCurrentUser()
    if (!user) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
