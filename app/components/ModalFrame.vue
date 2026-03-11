<script setup lang="ts">
import { closeModal } from "~/composables/modal";
import {Dialog} from "~/components/ui/dialog";

const modal = useModal();

function handleUpdateOpen(v: boolean) {
  console.log('handleUpdateOpen', v);

  if (!v) {
    closeModal();
  }
}
</script>

<template>
  <Dialog :open="Boolean(modal.component)" @update:open="handleUpdateOpen">
    <component :is="modal.component" v-bind="modal.context"/>
  </Dialog>

</template>

<style scoped>

</style>