<template>
  <div>
    <button @click="openModal('attended')">Atendido</button>
    <button @click="openModal('missed')">Não Compareceu</button>

    <Modal v-if="modalOpen" @close="modalOpen = false">
      <h2>{{ modalTitle }}</h2>
      <p>Você confirma o atendimento?</p>
      <button @click="confirmAction">Sim</button>
      <button @click="modalOpen = false">Fechar</button>
    </Modal>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useApi } from '@directus/shared/composables';
import Modal from './Modal.vue';

export default {
  components: {
    Modal,
  },
  setup() {
    const { directus } = useApi();
    const modalOpen = ref(false);
    const modalTitle = ref('');

    function openModal(action) {
      modalTitle.value = action === 'attended' ? 'Atendido' : 'Não Compareceu';
      modalOpen.value = true;
    }

    async function confirmAction() {
      await updateRecords();
      modalOpen.value = false;
    }

    async function updateRecords() {
      try {
        const { data: items } = await directus.items('line').readMany({
          sort: 'start_date',
        });

        const updatedItems = items.map((item, index) => {
          return {
            ...item,
            position: index,
          };
        });

        // Atualizar os registros no banco de dados
        for (const updatedItem of updatedItems) {
          await directus.items('line').updateOne(updatedItem.id, {
            position: updatedItem.position,
          });
        }
      } catch (error) {
        console.error('Failed to update records:', error);
      }
    }

    return {
      modalOpen,
      modalTitle,
      openModal,
      confirmAction,
    };
  },
};
</script>
