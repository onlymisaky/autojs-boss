import { JobListAuto } from '@/auto/JobList.js'
import { bus, EVENT_LIST_TO_DETAIL } from '@/bus'

/**
 * 发送事件可以放在 auto 函数中，也可以放在任务中
 * 为了解耦和统一管理，一律放在任务中
 */

export const JobListTask = {
  run() {
    while (true) {
      try {
        const hasEligibleJob = JobListAuto()
        if (hasEligibleJob) {
          bus.emit(EVENT_LIST_TO_DETAIL)
          break
        }
      } catch (error) {
        break
      }
    }
  }
}
