import { login, waitForLoginOut } from '@/auto/Login'
import { bus, EVENT_LOGOUT, EVENT_LOGIN } from '@/bus'
import { mainActivity } from '@/config'


export const LoginTask = {
  run() {
    while (true) {
      try {
        waitForLoginOut()
        bus.emit(EVENT_LOGOUT)
        login()
        waitForActivity(mainActivity)
        bus.emit(EVENT_LOGIN)
      } catch (error) {
        break
      }
    }
  }
}
