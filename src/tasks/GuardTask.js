import { bus, EVENT_APP_EXIT } from '@/bus';
import { pkg } from '@/config';

export const GuardTask = {
  run() {
    while (true) {
      sleep(1000);
      if (currentPackage().trim() !== pkg) {
        bus.emit(EVENT_APP_EXIT);
      }
    }
  },
};
