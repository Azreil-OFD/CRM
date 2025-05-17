import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { ref, computed } from 'vue'
import { useNuxtApp } from '#app'

export const useAuthStore = defineStore('auth', () => {
  const token = useLocalStorage('auth_token', '')
  const user = ref(null)
  const isAuthenticated = computed(() => !!token.value)

  function setToken(newToken) {
    token.value = newToken
  }

  function clearAuth() {
    token.value = ''
    user.value = null
  }

  async function login({ email, password }) {
    const nuxt = useNuxtApp()
    const response = await nuxt.$fetch('http://localhost:8055/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    user.value = response.user
    return response
  }

  async function logout() {
    clearAuth()
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    clearAuth
  }
})