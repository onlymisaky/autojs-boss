import { login, waitForLoginOut } from '@/auto/Login';
import { bus, EVENT_LOGIN, EVENT_LOGOUT } from '@/bus';
import { waitForActivity2 } from '@/common';
import { mainActivity } from '@/config';

export const LoginTask = {
  run() {
    while (true) {
      try {
        waitForLoginOut();
        bus.emit(EVENT_LOGOUT);
        sleep(1000);
        login();
        waitForActivity2(mainActivity);
        bus.emit(EVENT_LOGIN);
      }
      catch (e) {
        console.error('LoginTask', e);
        break;
      }
    }
  },
};
