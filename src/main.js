import { pkg } from '@/config.js';
import { TaskManager } from '@/tasks/TaskManager.js';

auto.waitFor();
console.show(true);
home();
sleep(1000);
app.launchApp('BOSS直聘');

function main() {
  waitForPackage(pkg);

  // eslint-disable-next-line no-new
  new TaskManager();
}

main();
