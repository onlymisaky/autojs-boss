import config from '@/config.js';
import { TaskManager } from '@/tasks/TaskManager.js';

auto.waitFor();
console.show(true);
home();
sleep(1000);
app.launchApp('BOSS直聘');

function main() {
  waitForPackage(config.pkg);

  // eslint-disable-next-line no-new
  new TaskManager();
}

main();
