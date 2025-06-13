import { login, waitForLoginOut } from '@/auto/Login';
import { bus, EVENT_LOGIN, EVENT_LOGOUT } from '@/bus';
import { mainActivity } from '@/config';

export const LoginTask = {
  run() {
    while (true) {
      try {
        waitForLoginOut();
        bus.emit(EVENT_LOGOUT);
        login();
        waitForActivity(mainActivity);
        bus.emit(EVENT_LOGIN);
      }
      catch (error) {
        console.error(error);
        break;
      }
    }
  },
};
