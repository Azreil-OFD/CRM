<template>
    <div class="min-h-screen bg-gray-900 flex flex-col gap-20">
        <nav class="flex items-center justify-between px-6 py-4 bg-gray-800">
            <h1 class="text-2xl font-bold">TCRM</h1>
        </nav>
        <div class="flex items-center justify-center h-full">
            <div class="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-2xl shadow-lg">

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
        if (status) {
            navigateTo('/')
        } else {
            error.value = "Ошибка авторизации"
        }
    } catch (e) {
        error.value = "Ошибка авторизации"
    }
}
</script>