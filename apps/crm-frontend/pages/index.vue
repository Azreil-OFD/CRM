<template>
  <div class="bg-gradient-to-br from-gray-900 to-black text-white min-h-screen font-sans">
    <!-- Header -->
    <header
      class="bg-opacity-80 backdrop-filter backdrop-blur-lg bg-gray-800/70 px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-10 border-b border-gray-700">
      <div class="flex items-center space-x-3 group">
        <img src="https://placehold.co/40x40 " alt="Profile"
          class="w-10 h-10 rounded-full ring-2 ring-purple-500 transition-transform duration-300 group-hover:scale-110" />
        <div>
          <h1
            class="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            {{ getHello() }}, {{ fullName }}</h1>
        </div>
      </div>
      <nav class="space-x-4 hidden md:flex">
        <a href="#" class="relative group">
          <span class="font-medium transition-all duration-300 hover:text-purple-400">Профиль</span>
          <span
            class="absolute left-0 bottom-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300"></span>
        </a>
        <a href="#" class="relative group">
          <span class="font-medium transition-all duration-300 hover:text-purple-400">Задачи</span>
          <span
            class="absolute left-0 bottom-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300"></span>
        </a>
      </nav>
      <button class="md:hidden text-gray-400 hover:text-white focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </header>

    <main class="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        class="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 shadow-lg hover:shadow-purple-500/20 transition-shadow duration-300 border border-gray-700">
        <h2 class="text-lg font-bold mb-4 flex items-center">
          <span class="inline-block w-1 h-6 bg-gradient-to-r from-purple-500 to-pink-500 mr-2 rounded-full"></span>
          Активные задачи
        </h2>
        <div class="space-y-3 mt-4">
          <div v-for="(task, index) in taskStore.active" :key="index"
            class="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors duration-200">
            <span class="font-medium truncate">{{ task.title }}</span>
            <span class="text-xs text-gray-400">{{ formatDate(task.deadline) }}</span>
          </div>
        </div>
        <button
          class="mt-4 px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
          Перейти
        </button>
      </div>

      <!-- Upcoming Deadlines Card -->
      <div
        class="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 shadow-lg hover:shadow-purple-500/20 transition-shadow duration-300 border border-gray-700">
        <h2 class="text-lg font-bold mb-4 flex items-center">
          <span class="inline-block w-1 h-6 bg-gradient-to-r from-blue-500 to-teal-400 mr-2 rounded-full"></span>
          Ближайшие дедлайны
        </h2>
        <ul class="space-y-3">
          <li v-for="(deadline, index) in taskStore.upcoming" :key="index"
            class="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors duration-200 group">
            <div class="flex flex-col">
              <span class="font-medium">{{ deadline.title }}</span>
              <span class="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">{{ deadline.deadline }}</span>
            </div>
            <span class="text-gray-400 group-hover:text-green-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </span>
          </li>
        </ul>
        <button
          class="mt-4 px-5 py-2 bg-gradient-to-r from-blue-600 to-teal-400 hover:from-blue-500 hover:to-teal-300 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
          Перейти
        </button>
      </div>
    </main>

    <section class="container mx-auto px-4 pb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        class="bg-gray-800/50 backdrop-blur-md rounded-xl p-5 shadow-lg hover:shadow-purple-500/20 transition-all duration-300 border border-gray-700 transform hover:-translate-y-1">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-500/20 text-purple-400 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold">Выполненные</h3>
            <p class="text-2xl font-bold text-purple-400">{{ taskStore.stats.completed }}</p>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-400">Задачи которые были выполнены</div>
      </div>

      <div
        class="bg-gray-800/50 backdrop-blur-md rounded-xl p-5 shadow-lg hover:shadow-blue-500/20 transition-all duration-300 border border-gray-700 transform hover:-translate-y-1">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-500/20 text-blue-400 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold">В ожидании</h3>
            <p class="text-2xl font-bold text-blue-400">{{ taskStore.stats.upcoming }}</p>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-400">Задачи которые еще не выполнены или в ожидании</div>
      </div>

      <div
        class="bg-gray-800/50 backdrop-blur-md rounded-xl p-5 shadow-lg hover:shadow-pink-500/20 transition-all duration-300 border border-gray-700 transform hover:-translate-y-1">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-pink-500/20 text-pink-400 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold">Просрочено</h3>
            <p class="text-2xl font-bold text-pink-400">{{ taskStore.stats.deadline }}</p>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-400">Задачи которые были просрочены</div>
      </div>
    </section>
  </div>
</template>

<script setup>
const user = ref()
const authStore = useAuthStore()
const taskStore = useTasksStore()

const fullName = computed(() => {
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
  user.value = (await authStore.getUser()).value
  await taskStore.load()
})
</script>