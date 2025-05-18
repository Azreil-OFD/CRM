<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <nav class="flex items-center justify-between px-6 py-4 bg-gray-800">
      <h1 class="text-2xl font-bold">TCRM</h1>
      <ul class="flex space-x-4">
        <li>
          <NuxtLink to="/" class="hover:underline">Профиль</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/tasks" class="hover:underline font-semibold">Задачи</NuxtLink>
        </li>
      </ul>
    </nav>

    <main class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6" v-if="correctTask">
      <div class="bg-gray-800 border md:col-span-2 border-gray-700 rounded-lg p-6">
        <h3 class="text-xl font-semibold mb-4">Проект</h3>
        <p class="text-gray-400 mb-6">Задачи в работе</p>
        <hr>
        <h3 class="text-xl font-semibold mb-4">Задача</h3>
        <p class="text-gray-400 mb-6">Задачи в работе</p>
      </div>
      <div class="bg-gray-800 border border-gray-700 rounded-lg p-6">

      </div>
    </main>
    <main class="mt-8 grid grid-cols-1 md:grid-cols-1 gap-6" v-else>
      <div class="bg-gray-800 border col-span-2 border-gray-700 rounded-lg ml-4 mr-4 p-6 text-center">
        Нет доступа
      </div>
    </main>
  </div>

</template>

<script setup lang="tsx">
const taskStore = useTasksStore()
const correctTask: Ref<ItemsTask | null> = ref(null)
const route = useRoute()
const id = route.params.id;
onMounted(async () => {
  const _tasks: ItemsTask[] | null = await taskStore.getTasks()
  if (_tasks === null) {
    return
  }
  if (typeof id !== 'string') {
    return
  }

  _tasks.find((e: ItemsTask) => {
    if (e.id === Number.parseInt(id)) {
      correctTask.value = e
    }
  })
})

</script>
