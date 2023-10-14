import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
        user: null as UserInfo | null
    }
  }
})

interface UserInfo {
    displayName: string,
    email: string,
    photoUrl: string
}