import { useUserInfoDialog } from '~/components/UserInfo'

const Playground = defineComponent({
  setup() {
    const { show: showUserInfo } = useUserInfoDialog()

    const userInfo = ref({
      userName: '',
      password: '',
    })

    const handleShowUserInfo = async () => {
      const result = await showUserInfo({
        options: {
          userName: userInfo.value.userName,
          password: userInfo.value.password,
        },
      })

      if (!result.isOk)
        return

      userInfo.value = result.value!
    }

    return () => {
      return (
        <div>
          <pre class="bg-[#ADADAD]">
            {JSON.stringify(userInfo.value, null, 2)}
          </pre>
          <button onClick={handleShowUserInfo}>Show User Info</button>
          {/* <Dialog /> */}
        </div>
      )
    }
  },
})

export default Playground
