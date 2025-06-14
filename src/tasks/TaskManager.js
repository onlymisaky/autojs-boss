import { JobDetailAndChatTask } from './JobDetailAndChatTask.js';
import { JobListTask } from './JobListTask.js';
import { LoginTask } from './LoginTask.js';

export class TaskManager {
  constructor() {
    this.loginThread = threads.start(() => LoginTask.run());
    this.loginThread.waitFor();
    this.jobListThread = threads.start(() => JobListTask.run());
    this.jobListThread.waitFor();
    this.jobDetailChatThread = threads.start(() => JobDetailAndChatTask.run());
  }
}
