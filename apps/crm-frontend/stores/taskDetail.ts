import { defineStore } from 'pinia';


export const useTaskDetailStore = defineStore('taskDetail', {
  state: () => ({
    task: null as any,                 // current task data
    order: null as any,                // related order data
    orderFiles: [] as DirectusFile[],  // files attached to the order
    comments: {
      task: [] as Comment[],          // comments on the task
      order: [] as Comment[]          // comments on the order
    },
    previousReports: [] as Report[]    // reports for previous tasks in the order
  }),
  actions: {
    /** Load the task and related data by task ID */
    async fetchTaskDetails(taskId: string | number) {
      const { getItemById, getItems } = useDirectusItems();
      try {
        // 1. Fetch the task by ID (including its order relation if possible)
        const task = await getItemById({ collection: 'tasks', id: taskId });
        this.task = task;

        // 2. Fetch the related order by ID (if task has an order field)
        if (task.order) {
          const order = await getItemById({ collection: 'orders', id: task.order });
          this.order = order;
          // 3. Load files attached to the order (if any).
          // Assume 'orders_files' is a relational field (e.g., many-to-many linking to directus_files).
          if (order.orders_files) {
            // If Directus returns an array of file objects or ids:
            this.orderFiles = Array.isArray(order.orders_files) ? order.orders_files : [];
            // (If they are just IDs, we could use useDirectusFiles or getItems to fetch each file's details.)
          }
        }

        // 4. Fetch comments for this task and its order from Directus comments collection.
        const taskComments = await getItems({
          collection: 'directus_comments',
          params: { filter: { collection: 'tasks', item: taskId } }
        });
        const orderComments = this.order ? await getItems({
          collection: 'directus_comments',
          params: { filter: { collection: 'orders', item: this.order.id } }
        }) : [];
        this.comments.task = taskComments;
        this.comments.order = orderComments;

        // 5. Fetch all reports for previous tasks in the same order (tasks with id < current task's id).
        if (this.order) {
          const prevReports = await getItems({
            collection: 'report',
            params: {
              filter: {
                // Filter reports by related task:
                // The task relation should have the same order and an ID less than current task.
                task: { 
                  order: { _eq: this.order.id },
                  id:    { _lt: taskId }
                }
              },
              fields: ['*', 'report_files.*']  // include report_files relationship (if it exists)
            }
          });
          this.previousReports = prevReports;
        }
      } catch (error) {
        console.error('Failed to load task details:', error);
      }
    },

    /** Submit a new report for the current task (with text and optional files) */
    async submitReport(reportText: string, files: File[]) {
      const { createItems, updateItem } = useDirectusItems();
      const { uploadFiles } = useDirectusFiles();  // hypothetical method for file upload
      try {
        // 1. Upload files to Directus (if any files are selected) to get their IDs.
        const fileIds: string[] = [];
        if (files && files.length > 0) {
          for (const file of files) {
            // Use Directus SDK or API to upload the file and get a file ID
            const uploaded = await uploadFiles(file);  
            // ^ (Note: In reality, you might use directus.files.createOne or an upload endpoint. 
            // The Nuxt SDK may provide a method to upload; here we assume uploadFiles returns file metadata including id.)
            fileIds.push(uploaded.id);
          }
        }

        // 2. Create a new report item linked to the current task.
        const newReportData: any = {
          description: reportText,
          task: this.task.id
        };
        // Attach file references if any (assuming 'report_files' is a M2M relation to files).
        if (fileIds.length) {
          // Directus many-to-many relation can be set by providing an array of link objects or file IDs.
          // Here, assume we provide an array of objects with the file ID.
          newReportData.report_files = fileIds.map(fileId => ({ directus_files_id: fileId }));
        }
        await createItems({ collection: 'report', items: [ newReportData ] });

        // 3. Mark the current task as completed.
        await updateItem({ collection: 'tasks', id: this.task.id, item: { status: 'completed' } });

        // 4. Find the next task in the same order and mark it as inProgress.
        if (this.order) {
          const { getItems } = useDirectusItems();
          const nextTasks = await getItems({
            collection: 'tasks',
            params: {
              filter: { order: this.order.id, id: { _gt: this.task.id } },
              sort: ['id'],
              limit: 1
            }
          });
          if (nextTasks.length > 0) {
            const nextTaskId = nextTasks[0].id;
            await updateItem({ collection: 'tasks', id: nextTaskId, item: { status: 'inProgress' } });
          }
        }

        // 5. Refresh the task details (to include the new report and updated statuses).
        await this.fetchTaskDetails(this.task.id);
      } catch (error) {
        console.error('Failed to submit report:', error);
      }
    }
  }
});
