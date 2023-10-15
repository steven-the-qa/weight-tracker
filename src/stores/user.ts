import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
        user: null as UserInfo | null
    }
  }
})

interface UserInfo {
    name: string | null,
    email: string | null,
    pfp: string | null
}