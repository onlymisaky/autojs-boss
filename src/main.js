import { TaskManager } from '@/tasks/TaskManager.js'

auto.waitFor()
console.show(true)
home()
sleep(3000)
app.launchApp('BOSS直聘')



function main() {
  const taskManager = new TaskManager()

  taskManager.startJobListTask()
}

main()