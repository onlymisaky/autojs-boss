import { TaskManager } from '@/tasks/TaskManager.js';
import { pkg } from './config';

auto.waitFor();
console.show(true);
home();
app.launchApp('BOSS直聘');

function main() {

  while (currentPackage() !== pkg) {
    sleep(1000);
  }

  const taskManager = new TaskManager();

  taskManager.startJobListTask();
}

main();
