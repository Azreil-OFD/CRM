<script setup lang="ts">
import { useTaskDetailStore } from '~/stores/taskDetail';

// Access route param and store
const route = useRoute();
const taskDetailStore = useTaskDetailStore();

// Fetch task details on component setup (async setup is supported in Nuxt 3)
await taskDetailStore.fetchTaskDetails(route.params.id as string);

// Reactive state for the new report form
const reportText = ref<string>('');
const selectedFiles = ref<File[]>([]);

// Handle file input change
function handleFileChange(event: Event) {
  const files = (event.target as HTMLInputElement).files;
  if (files) {
    selectedFiles.value = Array.from(files);
  }
}

// Submit new report
async function submitReport() {
  // Call the Pinia store action to handle report submission
  await taskDetailStore.submitReport(reportText.value, selectedFiles.value);
  // Clear the form inputs
  reportText.value = '';
  selectedFiles.value = [];
}
</script>

<template>
  <div class="container mx-auto p-4">
    <section class="mb-6 p-4 bg-gray-800 text-gray-100 rounded">
      <h1 class="text-2xl font-bold mb-2">{{ taskDetailStore.task.title }}</h1>
      <p class="mb-2">{{ taskDetailStore.task.description }}</p>
      <p class="text-sm text-gray-400">
        Deadline: {{ taskDetailStore.task.deadline }}
      </p>
    </section>

    <section class="mb-6 p-4 bg-gray-800 text-gray-100 rounded">
      <h2 class="text-xl font-semibold mb-2">
        Order: {{ taskDetailStore.order.title }}
      </h2>
      <p class="mb-2">{{ taskDetailStore.order.description }}</p>
      <p class="text-sm text-gray-400">
        Order Deadline: {{ taskDetailStore.order.deadline }}
      </p>
      <div v-if="taskDetailStore.orderFiles.length" class="mt-3">
        <h3 class="font-medium mb-1">Order Files:</h3>
        <ul class="list-disc list-inside">
          <li v-for="file in taskDetailStore.orderFiles" :key="file.id">
            <a 
              :href="file.url || file.directus_files_id?.downloadUrl" 
              target="_blank" 
              class="text-blue-400 hover:underline"
            >
              {{ file.filename_download || file.directus_files_id?.filename_download || 'Download file' }}
            </a>
          </li>
        </ul>
      </div>
    </section>

    <section class="mb-6 p-4 bg-gray-800 text-gray-100 rounded">
      <h3 class="text-lg font-semibold mb-3">Comments</h3>
      <div class="mb-4">
        <h4 class="font-medium">Order Comments:</h4>
        <ul class="pl-4">
          <li 
            v-for="comment in taskDetailStore.comments.order" 
            :key="comment.id" 
            class="text-sm text-gray-300 mb-1"
          >
            {{ comment.comment }}
          </li>
          <li v-if="taskDetailStore.comments.order.length === 0" class="text-sm text-gray-400">
            No comments for this order.
          </li>
        </ul>
      </div>
      <div>
        <h4 class="font-medium">Task Comments:</h4>
        <ul class="pl-4">
          <li 
            v-for="comment in taskDetailStore.comments.task" 
            :key="comment.id" 
            class="text-sm text-gray-300 mb-1"
          >
            {{ comment.comment }}
          </li>
          <li v-if="taskDetailStore.comments.task.length === 0" class="text-sm text-gray-400">
            No comments for this task.
          </li>
        </ul>
      </div>
    </section>

    <!-- Previous Reports Section -->
    <section class="mb-6 p-4 bg-gray-800 text-gray-100 rounded">
      <h3 class="text-lg font-semibold mb-3">Previous Reports</h3>
      <div v-if="taskDetailStore.previousReports.length">
        <!-- List each report -->
        <div 
          v-for="report in taskDetailStore.previousReports" 
          :key="report.id" 
          class="mb-4 pb-3 border-b border-gray-700 last:border-b-0"
        >
          <p class="mb-1">{{ report.description }}</p>
          <!-- Report attached files -->
          <div v-if="report.report_files && report.report_files.length" class="ml-4">
            <span class="text-sm text-gray-400">Files:</span>
            <ul class="list-disc list-inside">
              <li 
                v-for="fileLink in report.report_files" 
                :key="fileLink.id" 
                class="text-sm"
              >
                <a 
                  :href="fileLink.directus_files_id?.url || fileLink.directus_files_id?.downloadUrl" 
                  target="_blank" 
                  class="text-blue-400 hover:underline"
                >
                  {{ fileLink.directus_files_id?.filename_download || 'View file' }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p v-else class="text-gray-400">No previous reports for this order.</p>
    </section>

    <!-- New Report Submission Form -->
    <section class="p-4 bg-gray-800 text-gray-100 rounded">
      <h3 class="text-lg font-semibold mb-3">Submit New Report</h3>
      <form @submit.prevent="submitReport">
        <!-- Report text input -->
        <textarea 
          v-model="reportText" 
          placeholder="Report details..." 
          class="w-full mb-3 p-2 bg-gray-700 text-gray-100 rounded" 
          rows="4"
        ></textarea>
        <!-- File upload input -->
        <input 
          type="file" 
          multiple 
          @change="handleFileChange" 
          class="mb-3 text-gray-100 file:mr-4 file:py-2 file:px-4 
                 file:rounded file:border-0 file:text-sm file:bg-gray-600 file:text-gray-200"
        />
        <!-- Submit button -->
        <button 
          type="submit" 
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded"
        >
          Submit Task
        </button>
      </form>
    </section>
  </div>
</template>
