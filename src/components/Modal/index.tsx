import { VBtn, VCard, VCardActions, VCardItem, VCardTitle, VDialog, VSpacer } from 'vuetify/components'

export interface ModalProps {
  title?: string
  width?: string | number
  minWidth?: string | number
  maxWidth?: string | number
  contentClass?: string
  closeIcon?: boolean
  modelValue?: boolean
  'onUpdate:modelValue'?: (value: boolean) => void
  okText?: string
  onOk?: () => void
  okColorType?: 'primary' | 'error'
  isOkLoading?: boolean
  cancelText?: string
  onCancel?: () => void
}

export const modalProps = {
  'title': {
    type: String,
    default: 'Dialog',
  },
  'closeIcon': {
    type: Boolean,
    default: true,
  },
  'modelValue': {
    type: Boolean,
    default: false,
  },
  'onUpdate:modelValue': {
    type: Function as PropType<(value: boolean) => void>,
    default: () => { },
  },
  'okText': {
    type: String,
    default: '确定',
  },
  'okColorType': {
    type: String as PropType<ModalProps['okColorType']>,
    default: 'primary',
  },
  'onOk': {
    type: Function as PropType<() => void>,
    default: () => { },
  },
  'isOkLoading': {
    type: Boolean,
    default: false,
  },
  'cancelText': {
    type: String,
    default: '取消',
  },
  'onCancel': {
    type: Function as PropType<() => void>,
    default: undefined,
  },
  'width': {
    type: [String, Number],
  },
  'minWidth': {
    type: [String, Number],
  },
  'maxWidth': {
    type: [String, Number],
  },
  'contentClass': {
    type: String,
  },
}
export const Modal = defineComponent({
  name: 'Modal',
  props: {
    ...modalProps,
  },
  emits: {
    'update:modelValue': (_value: boolean) => true,
  },
  setup(props, { emit, slots, attrs }) {
    const { maxWidth, minWidth, width, modelValue } = toRefs(props)

    let marker = false

    const hide = () => {
      emit('update:modelValue', false)
    }

    const handleOk = () => {
      marker = true

      if (props.onOk)
        props.onOk?.()
      else
        hide()
    }

    watch(() => modelValue.value, (value) => {
      if (value)
        return

      if (marker)
        marker = false
      else
        props.onCancel?.()
    })

    return () => {
      return (
        <VDialog
          modelValue={props.modelValue}
          onUpdate:modelValue={props['onUpdate:modelValue']}
          {...attrs}
          width={width.value}
          minWidth={minWidth.value}
          maxWidth={maxWidth.value}
        >
          <VCard class="p-24px">
            <VCardTitle class="relative mb-8px p-0 text-18px font-bold text-[#101828]">
              {props.title}

              {
                props.closeIcon
                  ? (
                    <VBtn
                      icon="i-mdi-close text-24px text-[#667085]"
                      class="absolute right-0 top-0"
                      variant="text"
                      density="compact"
                      onClick={hide} />
                    )
                  : false
              }
            </VCardTitle>
            <VCardItem class={props.contentClass}>
              {slots.default?.()}
            </VCardItem>
            <VCardActions>
              <VSpacer />
              <VBtn
                variant="elevated"
                onClick={hide}
              >
                {props.cancelText}
              </VBtn>
              <VBtn
                color={props.okColorType}
                variant="elevated"
                onClick={handleOk}
                loading={props.isOkLoading}
              >
                {props.okText}
              </VBtn>
            </VCardActions>
          </VCard >
        </VDialog >
      )
    }
  },
})
