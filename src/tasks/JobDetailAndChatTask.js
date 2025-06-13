import { ChatAuto } from '@/auto/Chat.js';
import { JobDetailAuto, nextJob } from '@/auto/JobDetail.js';
import { bus, EVENT_CHAT_BACK_TO_DETAIL, EVENT_DETAIL_TO_CHAT, EVENT_DETAIL_TO_NEXT_DETAIL } from '@/bus.js';

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
            this.switchMode('chat');
            this.jobInfo = jobInfo;
            bus.emit(EVENT_DETAIL_TO_CHAT, jobInfo);
            continue;
          }
          bus.emit(EVENT_DETAIL_TO_NEXT_DETAIL);
          continue;
        }

        if (this.currentMode === 'chat') {
          this.runChat();
          this.switchMode('detail');
          bus.emit(EVENT_CHAT_BACK_TO_DETAIL);
          // TODO 返回动画时长
          nextJob(1000);
          bus.emit(EVENT_DETAIL_TO_NEXT_DETAIL);
          continue;
        }
      }
      catch {
        console.error('JobDetailAndChatTask');
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
