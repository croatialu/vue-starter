import { VTextField } from 'vuetify/components'
import { sleep } from '~/utils/common'
import { createDialog, useDialogOk } from '~/utils/dialog'

interface UserInfoDialogInput {
  userName: string
  password: string
}
interface UserInfoDialogOutput {
  userName: string
  password: string
}

export const UserInfo = defineComponent({
  name: 'UserInfo',
  props: {
    userName: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  setup(props) {
    const userName = ref('')
    const password = ref('')

    watch(() => props.userName, (value) => {
      if (value === userName.value || value === undefined)
        return
      userName.value = value
    }, { immediate: true })

    watch(() => props.password, (value) => {
      if (value === password.value || value === undefined)
        return
      password.value = value
    }, { immediate: true })

    useDialogOk<UserInfoDialogOutput>(async (next, isOkLoading) => {
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

export const useUserInfoDialog = createDialog<UserInfoDialogInput, UserInfoDialogOutput>(props => <UserInfo {...props} />, { width: 340 })
