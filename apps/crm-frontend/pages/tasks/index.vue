<template>
  <div class="bg-gray-900 text-white min-h-screen font-sans">
    <!-- Header -->
    <header class="bg-gray-800 px-4 py-2 flex justify-between items-center shadow-md">
      <div class="flex items-center space-x-2">
        <span class="text-xl font-bold">TCRM</span>
      </div>
      <nav class="space-x-4">
        <a href="#" class="hover:text-gray-400">Профиль</a>
        <a href="#" class="hover:text-gray-400">Задачи</a>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-6">Задачи</h1>

      <!-- Task Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Overdue Task Card -->
        <div class="bg-red-800 border border-red-500 rounded-lg p-4 shadow-md">
          <h2 class="text-lg font-bold mb-2">ывфвы</h2>
          <p class="text-sm text-red-400">Просрочено</p>
          <p class="text-sm mt-2">вfvfvf</p>
          <p class="text-sm">inProgress</p>
          <div class="flex items-center mt-2">
            <span class="bg-red-500 text-white px-2 py-1 rounded-full mr-2">17</span>
            <span class="text-sm text-gray-400">May 17, 2025</span>
          </div>
          <button class="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg">
            Детали
          </button>
        </div>

        <!-- Pending Task Card -->
        <div class="bg-yellow-800 border border-yellow-500 rounded-lg p-4 shadow-md">
          <h2 class="text-lg font-bold mb-2">пойти куда надо</h2>
          <p class="text-sm text-yellow-400">Осталось: 44ч 15м 36с</p>
          <p class="text-sm mt-2">фывфв</p>
          <p class="text-sm">waiting</p>
          <div class="flex items-center mt-2">
            <span class="bg-yellow-500 text-white px-2 py-1 rounded-full mr-2">17</span>
            <span class="text-sm text-gray-400">May 20, 2025</span>
          </div>
          <button class="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg">
            Детали
          </button>
        </div>

        <!-- Upcoming Task Card -->
        <div class="bg-green-800 border border-green-500 rounded-lg p-4 shadow-md">
          <h2 class="text-lg font-bold mb-2">asdasda</h2>
          <p class="text-sm text-green-400">Ещё есть время</p>
          <p class="text-sm mt-2">sdasdasdasd</p>
          <p class="text-sm">waiting</p>
          <div class="flex items-center mt-2">
            <span class="bg-green-500 text-white px-2 py-1 rounded-full mr-2">17</span>
            <span class="text-sm text-gray-400">May 30, 2025</span>
          </div>
          <button class="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg">
            Детали
          </button>
        </div>
      </div>
    </main>

    <!-- Floating Action Button (FAB) -->
    <div class="fixed bottom-4 right-4 z-50">
      <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>
  </div>
</template>что алчто 

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
  tasksList.value = await tasksStore.load()
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