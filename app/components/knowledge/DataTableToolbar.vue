<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import type { KnowledgeTableItemSchema } from './schema'
import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'
import { computed } from 'vue'

import DataTableViewOptions from './DataTableViewOptions.vue'

interface DataTableToolbarProps {
  table: Table<KnowledgeListItem>
}

const props = defineProps<DataTableToolbarProps>()
import {Icon} from "@iconify/vue";
import type {KnowledgeListItem} from "~/store/knowledge";
import {useVideoStore} from "~/store/video";
import {useAudioStore} from "~/store/audio";
import {toast} from "vue-sonner";
const isFiltered = computed(() => props.table.getState().columnFilters.length > 0)

const videoStore = useVideoStore();
const audioStore = useAudioStore();

type VideoRequestState = 'none' | 'started' | 'requesting' | 'requested' | 'error';
type AudioRequestState = 'none' | 'started' | 'merging' | 'ready' | 'error';


const videoRequest = ref<VideoRequestState>('none');
const audioRequest = ref<AudioRequestState>('none');

async function requestVideoGeneration() {
  try {
    videoRequest.value = 'started';
    toast('Preparing video segments...');
    const segments = await videoStore.prepareVideoSegments(props.table.getSelectedRowModel().rows.map(row => row.original));
    videoRequest.value = 'requesting';
    toast('Requesting video generation...');
    await videoStore.requestVideoGeneration(segments);
    videoRequest.value = 'requested';
    toast('Video generation requested! You will see it on media page in a few minutes.');
  } catch (error) {
    videoRequest.value = 'error';
    console.error(error);
    toast('Error while generating video!');
  }
  console.log('done')
}

async function requestAudioGeneration() {
  try {
    audioRequest.value = 'started';
    toast('Preparing audio links...');
    const waveUrls = await audioStore.prepareWavUrls(props.table.getSelectedRowModel().rows.map(row => row.original));
    audioRequest.value = 'merging';
    toast('Merging audio files...');
    await audioStore.mergeWavFilesFromUrls(waveUrls);
    audioRequest.value = 'ready';
    toast('Audio files ready!');
  } catch (error) {
    audioRequest.value = 'error';
    console.error(error);
    toast('Error while generating audio files!');
  }
  console.log('done')
}
</script>

<template>
  <div class="flex flex-wrap items-center justify-between">
    <div class="flex flex-1 items-center space-x-2">
      <Input
        placeholder="Filter words..."
        :model-value="(table.getColumn('word')?.getFilterValue() as string) ?? ''"
        class="h-8 w-[150px] lg:w-[250px]"
        @input="table.getColumn('word')?.setFilterValue($event.target.value)"
      />

      <Button
        v-if="isFiltered"
        variant="ghost"
        class="h-8 px-2 lg:px-3"
        @click="table.resetColumnFilters()"
      >
        Reset
        <Icon icon="radix-icons:cross-2" class="ml-2 h-4 w-4" />
      </Button>
    </div>

    <Button
        v-if="table.getFilteredSelectedRowModel().rows.length"
        variant="outline"
        size="sm"
        class="ml-auto h-8 flex mr-2"
        :disabled="audioRequest !== 'none'"
        @click="requestAudioGeneration"
    >
      <Icon icon="radix-icons:speaker-loud" class="mr-2 h-4 w-4" />
      Audio
    </Button>


    <Button
        v-if="table.getFilteredSelectedRowModel().rows.length"
        variant="outline"
        size="sm"
        class="ml-auto h-8 flex mr-2"
        :disabled="videoRequest !== 'none'"
        @click="requestVideoGeneration"
    >
      <Icon icon="radix-icons:video" class="mr-2 h-4 w-4" />
      Video
    </Button>

    <DataTableViewOptions :table="table" />
  </div>
</template>
