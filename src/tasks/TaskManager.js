import {
  bus,
  EVENT_APP_EXIT,
  EVENT_LIST_TO_DETAIL,
  EVENT_LOGIN,
  EVENT_LOGOUT,
} from '@/bus.js';
import { waitForActivity2 } from '@/common.js';
import { detailActivity, mainActivity } from '@/config.js';
import { GuardTask } from './GuardTask.js';
import { JobDetailAndChatTask } from './JobDetailAndChatTask.js';
import { JobListTask } from './JobListTask.js';
import { LoginTask } from './LoginTask.js';

export class TaskManager {
  constructor() {
    this.setupEventListeners();
    this.jobListThread = null;
    this.jobDetailChatThread = null;
    this.guardThread = threads.start(() => GuardTask.run());
    this.loginThread = threads.start(() => LoginTask.run());
  }

  setupEventListeners() {
    bus.on(EVENT_APP_EXIT, () => {
      toast('应用退出');
      if (this.guardThread) {
        this.guardThread.interrupt();
        this.guardThread = null;
      }
      if (this.loginThread) {
        this.loginThread.interrupt();
        this.loginThread = null;
      }
      if (this.jobListThread) {
        this.jobListThread.interrupt();
        this.jobListThread = null;
      }
      if (this.jobDetailChatThread) {
        this.jobDetailChatThread.interrupt();
        this.jobDetailChatThread = null;
      }
      exit();
    });

    bus.on(EVENT_LOGOUT, () => {
      console.log('退出登录');
      if (this.jobDetailChatThread) {
        this.jobDetailChatThread.interrupt();
        this.jobDetailChatThread = null;
      }
      if (this.jobListThread) {
        this.jobListThread.interrupt();
        this.jobListThread = null;
      }
    });

    bus.on(EVENT_LOGIN, () => {
      waitForActivity2(mainActivity);
      this.startJobListTask();
    });

    // 监听列表到详情的事件
    bus.on(EVENT_LIST_TO_DETAIL, () => {
      if (this.jobListThread) {
        this.jobListThread.interrupt();
        this.jobListThread = null;
      }
      waitForActivity2(detailActivity);
      this.startJobDetailAndChatTask();
    });
  }

  startJobListTask() {
    if (this.jobDetailChatThread) {
      this.jobDetailChatThread.interrupt();
      this.jobDetailChatThread = null;
    }

    this.jobListThread = threads.start(() => JobListTask.run());
  }

  startJobDetailAndChatTask() {
    if (this.jobListThread) {
      this.jobListThread.interrupt();
      this.jobListThread = null;
    }

    this.jobDetailChatThread = threads.start(() => JobDetailAndChatTask.run());
  }
}
