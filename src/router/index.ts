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

// Add this to track the previous route
let previousRoute = ''

router.beforeEach(async (to, from, next) => {
  const auth = getAuth()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  // Store the previous route
  previousRoute = from.path

  if (requiresAuth && !auth.currentUser) {
    next('/login')
  } else {
    // Check if we're navigating to dashboard from onboarding
    if (to.path === '/' && previousRoute === '/onboarding') {
      next()
      // Use setTimeout to ensure navigation completes before reload
      setTimeout(() => {
        window.location.reload()
      }, 100)
    } else {
      next()
    }
  }
})

export default router
