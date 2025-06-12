
import {
  bus,
  EVENT_DETAIL_TO_CHAT,
  EVENT_LIST_TO_DETAIL,
  EVENT_DETAIL_TO_NEXT_DETAIL,
  EVENT_CHAT_BACK_TO_DETAIL,
  EVENT_LOGOUT,
  EVENT_LOGIN
} from '@/bus.js'
import { JobListTask } from './JobListTask.js'
import { JobDetailAndChatTask } from './JobDetailAndChatTask.js'
import { LoginTask } from './LoginTask.js'
import { chatActivity, detailActivity } from '@/config.js'


/**
 * 界面跳转时，只判断是否已经离开当前界面 (waitForLeaveActivity) ，然后发送一个对应的事件 bus.emit(EVENT_XXX)
 * 任务管理器负责监听这些事件，判断是否进入目标界面 (waitForActivity) ，然后启动对应的任务
 */


export class TaskManager {
  constructor() {
    this.setupEventListeners()
    this.jobListThread = null
    this.jobDetailChatThread = null
    this.loginThread = threads.start(() => LoginTask.run())
  }

  setupEventListeners() {
    bus.on(EVENT_LOGOUT, () => {
      console.log('退出登录')
      if (this.jobDetailChatThread) {
        this.jobDetailChatThread.interrupt()
        this.jobDetailChatThread = null
      }
      if (this.jobListThread) {
        this.jobListThread.interrupt()
        this.jobListThread = null
      }
      sleep(1000)
    })

    bus.on(EVENT_LOGIN, () => {
      console.log('登录成功')
      this.startJobListTask()
    })

    // 监听列表到详情的事件
    bus.on(EVENT_LIST_TO_DETAIL, () => {
      waitForActivity(detailActivity)
      this.startJobDetailAndChatTask()
      console.log('已切换到详情界面')
    })

    // 监听详情到聊天的事件
    bus.on(EVENT_DETAIL_TO_CHAT, () => {
      waitForActivity(chatActivity)
      console.log('已切换到聊天界面')
    })

    // 监听聊天到详情的事件
    bus.on(EVENT_CHAT_BACK_TO_DETAIL, () => {
      waitForActivity(detailActivity)
      console.log('已回到到详情界面')
    })

    // 监听详情到下一个详情的事件
    bus.on(EVENT_DETAIL_TO_NEXT_DETAIL, () => {
      console.log('已切换到下一个详情界面')
    })
  }

  startJobListTask() {
    if (this.jobDetailChatThread) {
      this.jobDetailChatThread.interrupt()
      this.jobDetailChatThread = null
    }

    this.jobListThread = threads.start(() => JobListTask.run())
  }

  startJobDetailAndChatTask() {
    if (this.jobListThread) {
      this.jobListThread.interrupt()
      this.jobListThread = null
    }

    this.jobDetailChatThread = threads.start(() => JobDetailAndChatTask.run())
  }
}
