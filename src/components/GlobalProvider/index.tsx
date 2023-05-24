import type { Render } from './context'
import { useGlobalProvide } from './context'

let renderId = 0

export const GlobalProvider = defineComponent({
  setup(_, { slots }) {
    const nodes = ref<{ node: JSX.Element; id: number }[]>([])

    const clear = (id: number) => {
      nodes.value = nodes.value.filter(v => v.id !== id)
    }

    const render: Render = (vNode) => {
      const localId = ++renderId
      nodes.value.push(
        {
          node: vNode,
          id: localId,
        },
      )
      return () => {
        clear(localId)
      }
    }

    useGlobalProvide({
      render,
    })

    return () => {
      return (<>
        {slots?.default?.()}
        {nodes.value.map(v => v.node)}
      </>)
    }
  },
})

export default GlobalProvider
