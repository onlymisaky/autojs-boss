import { login, waitForLoginOut } from '@/auto/Login';
import { bus, EVENT_LOGIN, EVENT_LOGOUT } from '@/bus';
import { waitForActivity2 } from '@/common';
import { mainActivity } from '@/config';
import { logErrorWithTime } from '@/utils';

export const LoginTask = {
  isLogin: true,
  run() {
    while (this.isLogin) {
      try {
        waitForLoginOut();
        this.isLogin = false;
        bus.emit(EVENT_LOGOUT);
        sleep(3000);
        login();
        waitForActivity2(mainActivity);
        bus.emit(EVENT_LOGIN);
        this.isLogin = true;
      }
      catch (e) {
        logErrorWithTime('LoginTask', e);
        break;
      }
    }
  },
};
