<script setup lang="ts">
import DataTable from '../components/debug-table/DataTable.vue'
import { columns } from '~/components/debug-table/columns'
import tasks from '../components/debug-table/tasks.json'
</script>

<template>
    <DataTable :data="tasks" :columns="columns" />
</template>