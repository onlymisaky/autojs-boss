import {
  bus,
  EVENT_LIST_TO_DETAIL,
  EVENT_LOGIN,
  EVENT_LOGOUT,
} from '@/bus.js';
import { mainActivity, detailActivity, chatActivity, pkg } from '@/config.js';
import { JobDetailAndChatTask } from './JobDetailAndChatTask.js';
import { JobListTask } from './JobListTask.js';
import { LoginTask } from './LoginTask.js';
import { waitForActivity2 } from '@/common.js';

export class TaskManager {
  constructor() {
    this.guard()
    this.setupEventListeners();
    this.jobListThread = null;
    this.jobDetailChatThread = null;
    this.loginThread = threads.start(() => LoginTask.run());
  }

  setupEventListeners() {
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

  guard() {
    while (true) {
      sleep(1000);
      if (currentPackage() !== pkg) {
        toast('任务结束');
        exit();
      }
    }
  }
}
