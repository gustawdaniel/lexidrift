import type { ComponentOptionsMixin, ComputedOptions, Component,ComponentPropsOptions, MethodOptions } from "vue";

interface ModalState {
  component: Component | undefined
  context: any
  settings: { fullWidth: boolean }
  resolve?: (value: any) => void
}

export const useModal = () => {
  return useState<ModalState>('modal', () => ({
    component: undefined,
    context: undefined,
    settings: { fullWidth: false },
    resolve: undefined,
  }))
}


export function closeModal(result?: any) {
  const modal = useModal()
  modal.value.component = undefined
  modal.value.context = undefined
  modal.value.settings = { fullWidth: false }

  // resolve the modal promise if exists
  if (modal.value.resolve) {
    modal.value.resolve(result)
    modal.value.resolve = undefined // cleanup
  }
}

export function openModal<C extends Component>(
    component: C,
    context: C extends new () => { $props: infer P } ? P : never
): Promise<any> {
  const modal = useModal()
  return new Promise((resolve) => {
    modal.value.component = component
    modal.value.context = context
    modal.value.settings = { fullWidth: false }
    modal.value.resolve = resolve
  })
}