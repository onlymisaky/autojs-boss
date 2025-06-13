import { ChatAuto } from '@/auto/Chat.js';
import { JobDetailAuto, nextJob } from '@/auto/JobDetail.js';
import { waitForActivity2 } from '@/common';
import { chatActivity, detailActivity } from '@/config.js';

export const JobDetailAndChatTask = {
  /** @type {'detail' | 'chat'} */
  currentMode: 'detail',

  /** @type {JobIno} */
  jobInfo: {},

  run() {
    while (true) {
      try {
        if (this.currentMode === 'detail') {
          const { jobInfo, isEligible } = this.runDetail();
          if (isEligible) {
            this.jobInfo = jobInfo;
            waitForActivity2(chatActivity);
            this.switchMode('chat');
            continue;
          }
          continue;
        }

        if (this.currentMode === 'chat') {
          this.runChat();
          waitForActivity2(detailActivity);
          // TODO 返回动画时长
          nextJob(1000);
          this.switchMode('detail');
          continue;
        }
      }
      catch (e) {
        console.error('JobDetailAndChatTask', e);
        break;
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
