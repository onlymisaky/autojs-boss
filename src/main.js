import { JobListAuto } from '@/Activity/JobList.js'
import { isLogout, login } from '@/Activity/Login.js'
import { waitSysAnimationEnd } from '@/common';

auto();
console.show(true);
home();
sleep(3000)
launchApp('BOSS直聘');

const bus = events.emitter()

let mainThread = threads.start(() => {
  JobListAuto();
})

threads.start(() => {
  setInterval(() => {
    console.info('登录状态监测中')
    if (isLogout()) {
      console.error('退出登录')
      bus.emit('logout')
      login()
      waitSysAnimationEnd()
      bus.emit('login')
    }
    if (!mainThread.isAlive()) {
      bus.emit('login')
    }
  }, 10000);
})

bus.on('logout', () => {
  if (mainThread && mainThread.interrupt) {
    mainThread.interrupt()
  }
})

bus.on('login', () => {
  if (mainThread && mainThread.interrupt) {
    mainThread.interrupt()
  }
  mainThread = threads.start(() => {
    JobListAuto()
  })
})