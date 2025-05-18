export const useTasksStore = defineStore("tasks", () => {
  const active = ref<ItemsTask[]>([]);
  const upcoming = ref<ItemsTask[]>([]);
  const stats = ref({
    upcoming: 0,
    deadline: 0,
    completed: 0
  })
  const tasksAll = ref<ItemsTask[]>([]);
  const { getItems } = useDirectusItems();

  const auth = useAuthStore();
  function isDeadlineWithinThreeDays(task: ItemsTask): boolean {
    if (typeof task.deadline !== "string") {
      return false
    }
    const deadlineDate = new Date(task.deadline);
    const now = new Date();
    const differenceInMs = deadlineDate.getTime() - now.getTime();
    const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);
    return differenceInDays >= 0 && differenceInDays <= 3;
  }

  async function load(): Promise<ItemsTask[] | null> {
    upcoming.value = []
    active.value = []
    const userId = await auth.getUserId()
    let tasks: ItemsTask[] | null;
    try {
      const filters = { executor: userId };
      tasks = await getItems<ItemsTask>({
        collection: "tasks",
        params: {
          filter: filters,
          sort: ['deadline']
        },
      });


      tasks.forEach((e: ItemsTask) => {
        switch (e.status) {
          case 'completed':
            stats.value.completed += 1
          case 'preparation':
            return;
            break
          case 'inProgress':
            active.value.push(e)
            stats.value.upcoming += 1
            break;
          default:
            if (isDeadlineWithinThreeDays(e)) {
              upcoming.value.push(e)
            }
        }
      });
      tasksAll.value = tasks.filter((e: ItemsTask) => {
        if (e.status === 'preparation') {
          return false
        }
        return true
      })
      return tasksAll.value
    } catch (e) {
      return null
    }
  }
  return {
    active,
    upcoming,
    load,
    stats
  };
});
