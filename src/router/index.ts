import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import OnboardingView from '../views/OnboardingView.vue'
import DashboardView from '../views/DashboardView.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import type { DocumentReference } from 'firebase/firestore'
import { db } from '../firebase'

const router = createRouter({
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
        
        // Check if user has a goal weight and at least one weight entry
        if (userData && userData.goalWeight) {
          const weightEntriesRef = collection(userRef, 'weightEntries')
          const q = query(weightEntriesRef, orderBy('createdDate', 'desc'), limit(1))
          const querySnapshot = await getDocs(q)
          if (!querySnapshot.empty) {
            next()
          } else {
            next('/onboarding')
          }
        } else {
          next('/onboarding')
        }
      }
    },
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
        
        // Check if user has a goal weight and at least one weight entry
        if (userData && userData.goalWeight) {
          const weightEntriesRef = collection(userRef, 'weightEntries')
          const q = query(weightEntriesRef, orderBy('createdDate', 'desc'), limit(1))
          const querySnapshot = await getDocs(q)
          if (!querySnapshot.empty) {
            next('/')
          } else {
            next()
          }
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
