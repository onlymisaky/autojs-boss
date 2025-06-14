import { isLogout, login } from '@/auto/Login';
import config from '@/config';
import { logErrorWithTime } from '@/utils';

export const LoginTask = {
  isLogin: true,
  run() {
    while (true) {
      try {
        if (currentPackage() !== config.pkg) {
          sleep(3000);
          continue;
        }

        if (!isLogout()) {
          sleep(3000);
          continue;
        }

        login();

        waitForActivity(config.mainActivity);

        sleep(5000);
      }
      catch (e) {
        logErrorWithTime('LoginTask', e);
        sleep(3000);
        continue;
      }
    }
  },
};
