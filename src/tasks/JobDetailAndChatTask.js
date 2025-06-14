import { ChatAuto } from '@/auto/Chat.js';
import { JobDetailAuto, nextJob } from '@/auto/JobDetail.js';
import { chatActivity, detailActivity, pkg } from '@/config.js';
import { logErrorWithTime } from '@/utils';

export const JobDetailAndChatTask = {
  /** @type {'detail' | 'chat'} */
  currentMode: 'detail',

  /** @type {JobIno} */
  jobInfo: {},

  run() {
    while (true) {
      try {
        if (currentPackage() !== pkg) {
          sleep(3000);
          continue;
        }

        const activity = currentActivity();
        if (activity !== detailActivity && activity !== chatActivity) {
          sleep(3000);
          continue;
        }

        if (this.currentMode === 'detail') {
          const { jobInfo, isEligible } = this.runDetail();
          if (isEligible) {
            this.jobInfo = jobInfo;
            waitForActivity(chatActivity);
            this.switchMode('chat');
            continue;
          }
          continue;
        }

        if (this.currentMode === 'chat') {
          this.runChat();
          waitForActivity(detailActivity);
          // TODO 返回动画时长
          nextJob(1000);
          this.switchMode('detail');
          continue;
        }
      }
      catch (e) {
        logErrorWithTime('JobDetailAndChatTask', e);
        sleep(3000);
        continue;
      }
    }
  },
  runDetail() {
    return JobDetailAuto();
  },
  runChat() {
    return ChatAuto(this.jobInfo);
  },
  switchMode(mode) {
    if (['detail', 'chat'].includes(mode)) {
      this.currentMode = mode;
    }
  },
};
