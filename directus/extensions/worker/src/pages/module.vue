<template>
  <private-view title="Задачи">
    <template #headline> Beta </template>
    Content goes here...
    <template #navigation>
      <page-navigation :pages="all_pages" />
    </template>
    <template #title-outer:prepend>
      <v-icon name="access_time" />
    ></template>
  </private-view>
</template>

<script setup lang="ts">
import { useStores } from "@directus/extensions-sdk";
import { onMounted, ref } from "vue";
import PageNavigation from "../components/navigation.vue";
const all_pages = ref([
  {
    label: "Home",
    uri: "/worker/home",
    to: "/worker/home",
    icon: "home",
    color: "",
  },
]);

onMounted(() => {
  const stores = useStores();
  const userStore = stores.useUserStore();
  console.log(userStore.currentUser);
});
</script>
