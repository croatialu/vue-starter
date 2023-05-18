import { createContext } from '~/utils/common'

type Clear = () => void
export type Render = (vNode: JSX.Element) => Clear

const [useAppExtraProvide, useAppExtraInject] = createContext<{
  render: Render
}>('AppExtra')

export {
  useAppExtraInject,
  useAppExtraProvide,
}
