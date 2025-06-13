import { pkg } from '@/config.js';
import { TaskManager } from '@/tasks/TaskManager.js';

auto.waitFor();
console.show();
home();
app.launchApp('BOSS直聘');

function main() {
  while (currentPackage().trim() !== pkg) {
    sleep(1000);
  }

  const taskManager = new TaskManager();

  taskManager.startJobListTask();
}

main();
