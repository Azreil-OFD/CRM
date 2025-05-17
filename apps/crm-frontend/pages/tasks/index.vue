<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- Navbar -->
    <nav class="flex items-center justify-between px-6 py-4 bg-gray-800">
      <h1 class="text-2xl font-bold">TCRM</h1>
      <ul class="flex space-x-4">
        <li><NuxtLink to="/" class="hover:underline">Профиль</NuxtLink></li>
        <li><NuxtLink to="/tasks" class="hover:underline font-semibold">Задачи</NuxtLink></li>
      </ul>
    </nav>

    <main class="px-6 py-8">
      <h2 class="text-3xl font-semibold mb-6">Задачи</h2>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="task in sortedTasks"
          :key="task.id"
          :class="['border rounded-lg p-6 space-y-3', borderColor(task.deadline)]"
        >
          <div class="flex justify-between items-start">
            <h3 class="text-xl font-semibold">{{ task.title }}</h3>
            <span class="text-sm font-medium" :class="statusColor(task.deadline)">
              {{ statusLabel(task.deadline) }}
            </span>
          </div>

          <p class="text-gray-300 text-sm">{{ task.description }}</p>

          <div class="flex items-center text-gray-400 text-sm">
            <span class="mr-2">📅</span>
            <span>{{ formatDate(task.deadline) }}</span>
          </div>

          <NuxtLink
            :to="`/tasks/${task.id}`"
            class="inline-block px-4 py-2 border border-gray-600 text-gray-200 rounded-lg hover:bg-gray-700 transition"
          >Детали</NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useTasksStore } from '~/stores/tasks'

const tasksStore = useTasksStore()
const tasksList = ref([])
const now = ref(new Date())

let intervalId = null

const sortedTasks = computed(() => {
  return [...tasksList.value].sort((a, b) => {
    const timeLeftA = new Date(a.deadline).getTime() - now.value.getTime()
    const timeLeftB = new Date(b.deadline).getTime() - now.value.getTime()
    
    return timeLeftA - timeLeftB
  })
})


onMounted(async () => {
  tasksList.value = await tasksStore.getTasks()
  intervalId = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})

function statusLabel(deadline) {
  const deadlineDate = new Date(deadline)
  const diffMs = deadlineDate.getTime() - now.value.getTime()

  if (diffMs < 0) return 'Просрочено'
  if (diffMs === 0) return 'Прямо сейчас'
  if (diffMs <= 1000 * 60 * 60 * 24 * 3) {
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)
    return `Осталось: ${hours}ч ${minutes}м ${seconds}с`
  }
  return 'Ещё есть время'
}

function statusColor(deadline) {
  const deadlineDate = new Date(deadline)
  const diffMs = deadlineDate.getTime() - now.value.getTime()

  if (diffMs < 0) return 'text-red-500'
  if (diffMs < 1000 * 60 * 60) return 'text-orange-500'
  if (diffMs < 1000 * 60 * 60 * 24) return 'text-yellow-500'
  if (diffMs < 1000 * 60 * 60 * 24 * 3) return 'text-amber-500'
  return 'text-green-500'
}

function borderColor(deadline) {
  const deadlineDate = new Date(deadline)
  const diffMs = deadlineDate.getTime() - now.value.getTime()

  if (diffMs < 0) return 'border-red-500'
  if (diffMs < 1000 * 60 * 60) return 'border-orange-500'
  if (diffMs < 1000 * 60 * 60 * 24) return 'border-yellow-500'
  if (diffMs < 1000 * 60 * 60 * 24 * 3) return 'border-amber-500'
  return 'border-green-500'
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })
}
</script>