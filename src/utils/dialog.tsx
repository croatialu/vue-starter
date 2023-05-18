import type { DefineComponent } from 'vue'
import { VBtn, VCardActions, VCardTitle, VDialog } from 'vuetify/components'
import { createContext } from './common'

const [useDialogProvide, userDialogInject] = createContext<{
  onOk: (callback: Callback) => void
  cancel: () => void
  isOkLoading: Ref<boolean>
}>('createDialog')

type NextCallback = (value: unknown) => void
type Callback = (next: NextCallback, isOkLoading: Ref<boolean>) => void

export function useDialogOk(callback: Callback) {
  try {
    const { onOk } = userDialogInject()

    onOk(callback)
  }
  catch {}
}
export {
  useDialogProvide,
  userDialogInject,
}
export function createDialog<T extends DefineComponent<{}, {}, any>>(Comp: T) {
  return function (props: { title?: string; onOk?: (value: unknown) => void } = {}) {
    const visible = ref(false)

    const show = () => {
      visible.value = true
    }

    const hide = () => {
      visible.value = false
    }

    const isOkLoading = ref(false)

    const Dialog = defineComponent({
      setup() {
        let okCb: Callback = () => { }
        const handleOk = () => {
          okCb((value) => {
            props.onOk?.(value)
          }, isOkLoading)
        }

        const handleOnOk = (callback: Callback) => {
          okCb = callback
        }

        useDialogProvide({
          isOkLoading,
          onOk: handleOnOk,
          cancel: hide,
        })
        return () => {
          return (
            <VDialog {...props} contentClass="bg-white p-24px rounded-12px" v-model={visible.value}>
              <VCardTitle>{ props.title || '标题' }</VCardTitle>
              <Comp />
              <VCardActions >
                <VBtn class="ml-auto" onClick={hide}>取消</VBtn>
                <VBtn color="primary" loading={isOkLoading.value} variant="elevated" onClick={handleOk}>确认</VBtn>
              </VCardActions>
            </VDialog>
          )
        }
      },
    })

    return {
      show,
      hide,
      Dialog,
    }
  }
}
