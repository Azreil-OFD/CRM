<template>
  <div class="modal">
    <div class="modal-content">
      <slot></slot>
      <button @click="$emit('close')">Fechar</button>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['close'],
};
</script>
