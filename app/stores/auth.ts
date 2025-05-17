import { defineStore } from "pinia";
import { ref, computed } from "vue";

interface AuthData {
  email: string;
  password: string;
}

export const useAuthStore = defineStore("auth", () => {
  const { login: DLogin, logout: DLogout, fetchUser:DFetchUser } = useDirectusAuth();
  
  async function login(data: AuthData) {
    try {
      await DLogin(data);
      return true
    } catch (e) {
      return false
    }
  }

  async function logout() {
    await DLogout()
  }
  async function getUser() {
    return await DFetchUser()
  }
  async function getUserId() {
    const user = await DFetchUser()
    return user.value?.id
  }
  return {
    getUserId,
    getUser,
    login,
    logout,
  };
});
