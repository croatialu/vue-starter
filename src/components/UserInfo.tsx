import { VTextField } from 'vuetify/components'
import { sleep } from '~/utils/common'
import { useDialogOk } from '~/utils/dialog'

export const UserInfo = defineComponent({
  setup() {
    const userName = ref('')
    const password = ref('')

    useDialogOk(async (next, isOkLoading) => {
      isOkLoading.value = true
      await sleep(1000)
      isOkLoading.value = false
      next({
        userName: userName.value,
        password: password.value,
      })
    })

    return () => {
      return (
        <div class="bg-white">
          <VTextField placeholder='UserName' v-model={userName.value} />
          <VTextField type="password" placeholder='Password' v-model={password.value} />
        </div>
      )
    }
  },
})
