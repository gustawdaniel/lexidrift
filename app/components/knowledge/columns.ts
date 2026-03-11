import type { ColumnDef } from '@tanstack/vue-table'

import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { h } from 'vue'
import { labels, priorities, statuses } from './data'
import DataTableColumnHeader from './DataTableColumnHeader.vue'
import DataTableRowActions from './DataTableRowActions.vue'
import type {KnowledgeListItem} from "~/store/knowledge";
import {useUserStore} from "~/store/user";
import type {Language} from "~/types/authTypes";

function round(value: number, decimals: number) {
  const power = Math.pow(10, decimals);
  return Math.round(value * power) / power;
}

function isoDateToMs(isoString: string): number {
  if (!isoString) return 0;
  const target = new Date(isoString);
  return target.getTime();
}

function timeUntilMs(targetMs: number): string {
  if (!targetMs) return "";
  const now = new Date();
  const diffMs = targetMs - now.getTime();
  if (diffMs <= 0) return "Now";

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  return days > 0 ? `${days}d ${remainingHours}h` : `${remainingHours}h`;
}

interface KnowledgeColumnsProps {
  learningLanguage: Language
  nativeLanguage: Language
}

export function columns(props: KnowledgeColumnsProps): ColumnDef<KnowledgeListItem>[] {
  return [
    {
      id: 'select',
      header: ({table}) => h(Checkbox, {
        'modelValue': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
        'onUpdate:modelValue': value => table.toggleAllPageRowsSelected(!!value),
        'ariaLabel': 'Select all',
        'class': 'translate-y-0.5',
      }),
      cell: ({row}) => h(Checkbox, {
        'modelValue': row.getIsSelected(),
        'onUpdate:modelValue': value => row.toggleSelected(!!value),
        'ariaLabel': 'Select row',
        'class': 'translate-y-0.5'
      }),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'rank',
      accessorFn: row => row.rank,
      header: ({column}) => h(DataTableColumnHeader, {column, title: 'Rank'}),
      cell: ({row}) => {
        return h('span', row.getValue('rank'))
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: 'word',
      accessorFn: row => row.definition?.word ?? 'No definition',
      header: ({column}) => h(DataTableColumnHeader, {column, title: 'Word'}),
      cell: ({row}) => {
        return h(Badge, {
          variant: 'outline',
          title: row.original.definition?.translation[props.nativeLanguage]
        }, () => row.getValue('word'))
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: 'sentence',
      header: ({column}) => h(DataTableColumnHeader, {column, title: 'Sentence'}),
      accessorFn: row => row.definition?.examples?.[0][props.learningLanguage] ?? 'No definition',
      cell: ({row}) => {
        return h('div', {class: 'flex space-x-2'}, [
          h('span', {
            class: 'max-w-[500px] truncate font-medium',
            title: row.original.definition?.examples?.[0][props.nativeLanguage]
          }, row.getValue('sentence')),
        ])
      },
    },
    {
      accessorKey: 'stability',
      header: ({column}) => h(DataTableColumnHeader, {column, title: 'Stability'}),
      accessorFn: row => round(row.fsrs?.stability ?? 0, 2),
      cell: ({row}) => {
        return h('span', row.getValue('stability'))
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'difficulty',
      header: ({column}) => h(DataTableColumnHeader, {column, title: 'Difficulty'}),
      accessorFn: row => round(row.fsrs?.difficulty ?? 0, 2),
      cell: ({row}) => {
        return h('span', row.getValue('difficulty'))
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },

    {
      accessorKey: 'nexReviewMs',
      header: ({column}) => h(DataTableColumnHeader, {column, title: 'Review'}),
      accessorFn: row => row.fsrs ? isoDateToMs(row.fsrs.nextQuestionAt) : 0,
      cell: ({row}) => {
        return h('span', {title: row.original.fsrs ? row.original.fsrs.nextQuestionAt : ''}, timeUntilMs(row.getValue('nexReviewMs')))
        // return  h('span', {title: "Test"}, () => timeUntilMs(row.getValue('nexReviewMs')))
      },
      // filterFn: (row, id, value) => {
      //   return value.includes(row.getValue(id))
      // },
    },
    // {
    //   id: 'actions',
    //   cell: ({ row }) => h(DataTableRowActions, { row }),
    // },
  ]
}