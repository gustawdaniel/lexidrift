import { h } from 'vue'
import { Icon } from "@iconify/vue";

export const labels = [
  {
    value: 'bug',
    label: 'Bug',
  },
  {
    value: 'feature',
    label: 'Feature',
  },
  {
    value: 'documentation',
    label: 'Documentation',
  },
]

export const statuses = [
  {
    value: 'backlog',
    label: 'Backlog',
    icon: h(Icon, {icon: 'radix-icons:question-mark-circled'}),
  },
  {
    value: 'todo',
    label: 'Todo',
    icon: h(Icon, {icon: 'radix-icons:circle'}),
  },
  {
    value: 'in progress',
    label: 'In Progress',
    icon: h(Icon, {icon: 'radix-icons:stopwatch'}),
  },
  {
    value: 'done',
    label: 'Done',
    icon: h(Icon, {icon: 'radix-icons:check-circled'}), // radix-icons/check-circled
  },
  {
    value: 'canceled',
    label: 'Canceled',
    icon: h(Icon, {icon: 'radix-icons:cross-circled'}), // radix-icons/cross-circled
  },
]

export const priorities = [
  {
    value: 'low',
    label: 'Low',
    icon: h(Icon, {icon: 'radix-icons:arrow-down'}), // radix-icons/arrow-down
  },
  {
    value: 'medium',
    label: 'Medium',
    icon: h(Icon, {icon: 'radix-icons:arrow-right'}), // radix-icons/arrow-right
  },
  {
    value: 'high',
    label: 'High',
    icon: h(Icon, {icon: 'radix-icons:arrow-up'}), // radix-icons/arrow-up
  },
]
