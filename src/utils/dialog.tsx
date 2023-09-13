import type { VDialog } from 'vuetify/components'
import { useGlobalInject } from '../components/GlobalProvider/context'
import type { ValueGetter } from './common'
import { createContext, getValue } from './common'
import { Modal } from '~/components/Modal'

export interface DialogActions<T> {
  /**
   * 触发 ok 回调， 会走到 useDialogOk 中
   */
  ok: () => void
  /**
   * 关闭 dialog
   */
  cancel: () => void
  /**
   * 设置 ok 按钮 loading 状态
   */
  setLoading: (value: boolean) => void

  /**
   * 对外直接导出数据， 不走 ok 回调
   * */
  expose: (value: T) => void
}

const { useProvide: useDialogProvide, useInject: userDialogInject } = createContext<{
  onOk: (callback: Callback) => void
  cancel: () => void
  isOkLoading: Ref<boolean>
  action: DialogActions<unknown>
}>('createDialog')

type NextCallback<T> = (value: T) => void
type Callback<T = unknown> = (next: NextCallback<T>, isOkLoading: Ref<boolean>) => void

export function useDialogOk<T>(callback: Callback<T>) {
  try {
    const { onOk } = userDialogInject()

    onOk(callback)
  }
  catch { }
}

export function useDialogAction() {
  try {
    const { action } = userDialogInject()

    return action
  }
  catch (err) {
    console.error(err, 'useDialogAction')
    return {
      ok: () => {},
      cancel: () => { },
      setLoading: () => { },
      expose: () => { },
    }
  }
}

type DialogOptions = Omit<InstanceType<typeof VDialog>['$props'] & {}, 'modelValue'>

type Resolve<T> = (value: T | PromiseLike<T>) => void
type Reject = (reason?: any) => void

function createPromise<T>() {
  let resolve: Resolve<T> = () => { }
  let reject: Reject = () => { }
  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })

  return { resolve, reject, promise }
}

export function createDialog<Input, Output = any>(ComponentFactory: (options: Input) => JSX.Element | string | number | null, dialogOptions?: ValueGetter<Partial<DialogOptions>, Input>) {
  interface ShowDialogOptions<T> {
    title?: string
    options?: T
  }

  return function<DV>() {
    type DialogValue = DV extends {} ? DV : Output
    const visible = ref(false)
    type ShowDialogReturnValue = { isOk: true; value: DialogValue | null } | { isOk: false }

    let dialogResolve: Resolve<ShowDialogReturnValue> = () => { }

    const isOkLoading = ref(false)
    let okCb: Callback<DialogValue> | undefined

    const handleOk = () => {
      if (!okCb) {
        hide()
        dialogResolve({ isOk: true, value: null as DialogValue })
        isOkLoading.value = false
        return
      }

      okCb((value: DialogValue) => {
        hide()
        dialogResolve({
          isOk: true,
          value,
        })
        isOkLoading.value = false
      }, isOkLoading)
    }

    const handleCancel = () => {
      hide()
      dialogResolve({
        isOk: false,
      })
      isOkLoading.value = false
    }

    const Dialog = defineComponent({
      inheritAttrs: false,
      setup(_, { attrs }) {
        const { options: compProps = {}, ...otherAttrs } = attrs

        const handleOnOk = (callback: Callback<DialogValue>) => {
          okCb = callback
        }

        const handleActionExpose = (value: unknown) => {
          hide()
          isOkLoading.value = false
          dialogResolve({
            isOk: true,
            value: value as DialogValue,
          })
        }

        const handleSetLoading = (value: boolean) => {
          isOkLoading.value = value
        }

        useDialogProvide({
          isOkLoading,
          onOk: handleOnOk as any,
          cancel: handleCancel,
          action: {
            expose: handleActionExpose,
            ok: handleOk,
            cancel: handleCancel,
            setLoading: handleSetLoading,
          },
        })

        return () => {
          const componentElement = ComponentFactory(compProps as Input)
          const realDialogOptions = getValue(dialogOptions as any, compProps as any)
          return (
            <Modal
              {...realDialogOptions}
              {...otherAttrs}
              isOkLoading={isOkLoading.value}
              v-model={visible.value}
              onCancel={handleCancel}
              onOk={handleOk}
              v-slots={{ default: () => componentElement }}
            />
          )
        }
      },
    })

    const { render } = useGlobalInject()

    async function show(
      options: ShowDialogOptions<Input> = {},
    ) {
      visible.value = true
      const { resolve, promise } = createPromise<ShowDialogReturnValue>()
      dialogResolve = resolve
      const clear = render(<Dialog {...options as any} />)

      const result = await promise
      setTimeout(() => {
        clear()
      }, 500)
      return result
    }

    function hide() {
      visible.value = false
    }

    return {
      show,
      hide: handleCancel,
    }
  }
}
