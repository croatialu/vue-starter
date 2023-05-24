import { createContext } from './../../utils/common'

type Clear = () => void
export type Render = (vNode: JSX.Element) => Clear

const { useInject, useProvide } = createContext<{
  render: Render
}>('GlobalProvider')

export {
  useInject as useGlobalInject,
  useProvide as useGlobalProvide,
}
