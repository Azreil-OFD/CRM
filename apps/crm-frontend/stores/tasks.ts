export const useTasksStore = defineStore("tasks", () => {
  const activeCount = ref(0);
  const upcoming = ref([]);
  const { getItems } = useDirectusItems();

  const nuxt = useNuxtApp();
  const auth = useAuthStore();

  async function loadTasks() {
    const userId = await auth.getUserId()
    let tasks:any;
    try {
      const filters = { executor: userId };
      tasks = await getItems<ItemsTasks>({
        collection: "tasks",
        params: {
          filter: filters,
        },
      });
      return tasks
    } catch (e) {
      return null
    }

    
  }

  return {
    activeCount,
    upcoming,
    loadTasks,
  };
});
