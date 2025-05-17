<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- Navbar -->
    <nav class="flex items-center justify-between px-6 py-4 bg-gray-800">
      <h1 class="text-2xl font-bold">TCRM</h1>
      <ul class="flex space-x-4">
        <li><NuxtLink to="/" class="hover:underline">Профиль</NuxtLink></li>
        <li><NuxtLink to="/tasks" class="hover:underline">Задачи</NuxtLink></li>
      </ul>
      <NuxtLink to="/settings" class="hover:underline">Настройки</NuxtLink>
    </nav>

    <main class="px-6 py-8">
      <!-- Welcome section -->
      <div class="flex items-center space-x-4">
        <img
          v-if="auth.user?.avatar"
          :src="auth.user.avatar"
          alt="Avatar"
          class="w-12 h-12 rounded-full"
        />
        <div>
          <h2 class="text-3xl font-semibold">
            {{ getHello() }}, {{ fullName }}
          </h2>
          <p class="text-gray-400">Данная версия приложения находиться в режиме разработки! Могут быть баги.</p>
        </div>
      </div>

      <!-- Cards -->
      <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Active Tasks -->
        <div class="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 class="text-xl font-semibold mb-4">Active Tasks</h3>
          <p class="text-4xl font-bold">{{ tasks.activeCount }}</p>
          <p class="text-gray-400 mb-6">tasks assigned to you</p>
          <NuxtLink
            to="/tasks"
            class="inline-block px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition"
          >View All Tasks</NuxtLink>
        </div>

        <!-- Upcoming Deadlines -->
        <div class="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 class="text-xl font-semibold mb-4">Upcoming Deadlines</h3>
          <ul class="space-y-4">
            <li v-for="task in tasks.upcoming" :key="task.id">
              <div class="flex items-center space-x-2">
                <span class="text-gray-400">⏰</span>
                <span class="font-medium">{{ task.title }}</span>
              </div>
              <p class="text-gray-500 text-sm">Due {{ formatDate(task.deadline) }}</p>
              <hr class="border-gray-700 my-2" />
            </li>
          </ul>
          <NuxtLink
            to="/tasks"
            class="inline-block px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 transition"
          >View All Tasks</NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useTasksStore } from '~/stores/tasks'

const auth = useAuthStore()
const tasks = useTasksStore()
const user = ref()

const fullName = computed(() => {
  console.log(user.value)
  const u = user.value
  return u ? `${u.first_name} ${u.last_name}` : ''
})
function getHello() {
  const now = new Date();
  const hours = now.getHours();

  if (hours >= 6 && hours < 12) {
    return "Доброе утро";
  } else if (hours >= 12 && hours < 18) {
    return "Добрый день";
  } else if (hours >= 18 && hours < 24) {
    return "Добрый вечер";
  } else {
    return "Спать надо";
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

onMounted(async () => {
  user.value = (await auth.getUser()).value
  await tasks.loadTasks()
})
</script>
