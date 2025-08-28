import { ChatAuto } from '@/auto/Chat';
import { JobDetailAuto, nextJob } from '@/auto/JobDetail';
import { JobListAuto } from '@/auto/JobList';
import { isLogout, login } from '@/auto/Login';
import config from '@/config.js';
import { logErrorWithTime } from '@/utils';

console.show(true);
home();
sleep(1000);
app.launchApp('BOSS直聘');

function run() {
  let jobInfo = null;
  while (true) {
    try {
      // 非BOSS直聘进程，不做任何操作
      if (currentPackage() !== config.pkg) {
        sleep(3000);
        console.log('currentPackage', currentPackage());
        continue;
      }

      // 只要不是聊天界面，就清空上次获取的职位信息
      if (currentActivity() !== config.chatActivity) {
        jobInfo = null;
      }

      // 职位列表界面
      if (currentActivity() === config.mainActivity) {
        JobListAuto();
        continue;
      }

      // 职位详情界面
      else if (currentActivity() === config.detailActivity) {
        const res = JobDetailAuto();
        if (res.isEligible) {
          jobInfo = res.jobInfo;
          waitForActivity(config.chatActivity);
        }
        continue;
      }

      // 聊天界面
      else if (currentActivity() === config.chatActivity) {
        ChatAuto(jobInfo);
        waitForActivity(config.detailActivity);
        nextJob(1000);
        continue;
      }

      // 未登录
      else if (isLogout()) {
        login();
        waitForActivity(config.mainActivity);
        continue;
      }

      // 其他
      else {
        sleep(3000);
        console.log('currentActivity', currentActivity());
        continue;
      }
    }
    catch (error) {
      logErrorWithTime(error);
      sleep(3000);
      continue;
    }
  }
}

function main() {
  waitForPackage(config.pkg);

  run();
}

main();
