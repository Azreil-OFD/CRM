<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-900">
        <div class="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-2xl shadow-lg">
            <div class="text-center">
                <!-- Здесь можно добавить логотип -->
                <h1 class="text-3xl font-bold text-white">Тиражи</h1>
            </div>
            <form @submit.prevent="onSubmit" class="space-y-5">
                <h2 class="text-xl font-semibold text-white text-center">Авторизация</h2>
                <div>
                    <label for="email" class="block text-gray-300 mb-1">Email</label>
                    <input v-model="email" id="email" type="email" required
                        class="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label for="password" class="block text-gray-300 mb-1">Пароль</label>
                    <input v-model="password" id="password" type="password" required
                        class="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button type="submit"
                    class="w-full py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition">
                    Войти
                </button>
                <p v-if="error" class="text-center text-red-400 mt-2">{{ error }}</p>
            </form>
        </div>
    </div>
</template>

<script setup>
const email = ref('')
const password = ref('')
const error = ref('')
const auth = useAuthStore()

async function onSubmit() {
    error.value = ''
    try {
        const status = await auth.login({ email: email.value, password: password.value })
        console.log(status)
    if(status) {
        navigateTo('/')
    } else {
        error.value = "Ошибка авторизации"
    }
    } catch (e) {
        error.value = "Ошибка авторизации"
    }
}
</script>