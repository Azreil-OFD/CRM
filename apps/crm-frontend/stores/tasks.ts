export const useTasksStore = defineStore("tasks", () => {
  const activeCount = ref(0);
  const upcoming = ref<ItemsTask[]>([]);
  const { getItems } = useDirectusItems();

  const auth = useAuthStore();
  function isDeadlineWithinThreeDays(task: ItemsTask): boolean {
    if(typeof task.deadline !== "string") {
      return false
    } 
    const deadlineDate = new Date(task.deadline);
    const now = new Date();
    const differenceInMs = deadlineDate.getTime() - now.getTime();
    const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);
    return differenceInDays >= 0 && differenceInDays <= 3;
  }
  
  async function getTasks() {
    activeCount.value = 0
    upcoming.value = []
    const userId = await auth.getUserId()
    let tasks:any;
    try {
      const filters = { executor: userId };
      tasks = await getItems<ItemsTask[]>({
        collection: "tasks",
        params: {
          filter: filters,
          sort: ['deadline']
        },
      });


      tasks.forEach((e: ItemsTask) => {
        if(e.status === 'inProgress') {
          activeCount.value = activeCount.value+1
          
        }
        if(isDeadlineWithinThreeDays(e)) {
          upcoming.value.push(e)
        }
      });

      return tasks
    } catch (e) {
      return null
    } 
  }
  return {
    activeCount,
    upcoming,
    getTasks,
  };
});
