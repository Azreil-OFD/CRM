<template>
  <private-view navigation="asd" title="My Custom Module"
    >Content goes here...</private-view
  >
</template>

<script setup lang="ts">
import { useStores } from "@directus/extensions-sdk";
import { onMounted } from "vue";

onMounted(() => {
  const stores = useStores();
  const userStore = stores.useUserStore();
  console.log(userStore.currentUser);
});
</script>
