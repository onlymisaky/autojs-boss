import { JobListAuto } from '@/auto/JobList.js';
import config from '@/config';
import { logErrorWithTime } from '@/utils';

export const JobListTask = {
  run() {
    while (true) {
      try {
        if (currentPackage() !== config.pkg) {
          sleep(3000);
          continue;
        }

        if (currentActivity() !== config.mainActivity) {
          sleep(3000);
          continue;
        }

        const hasEligibleJob = JobListAuto();
        if (hasEligibleJob) {
          sleep(5000);
        }
      }
      catch (e) {
        logErrorWithTime('JobListTask', e);
        sleep(3000);
        continue;
      }
    }
  },
};
