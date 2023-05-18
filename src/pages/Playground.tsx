import { createDialog } from './../utils/dialog'
import { UserInfo } from '~/components/UserInfo'

const useUserInfoDialog = createDialog(UserInfo)

const Playground = defineComponent({
  setup() {
    const { show, hide } = useUserInfoDialog({
      onOk(value) {
        console.log(value, 'okValue')
      },
    })

    return () => {
      return (
        <div>
          <button onClick={show}>123123</button>
          {/* <Dialog /> */}
        </div>
      )
    }
  },
})

export default Playground
