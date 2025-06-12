import { waitForLeaveActivity } from '@/common.js'
import { msg, chatActivity } from '@/config.js'

function hasChat() {
  return selector().id('tv_content_text').exists()
}

function consoleJobInfo(prefix, jobInfo) {
  console.info(prefix + ' ↓↓↓')
  console.log(jobInfo.company.name)
  console.log(jobInfo.title)
  console.log(jobInfo.salary.min + '-' + jobInfo.salary.max + ' ' + jobInfo.salary.count)
  console.info('------------')
}

/**
 * @param {JobIno} jobInfo 
 */
function sendMsg(jobInfo) {
  const $editText_with_scrollbar = selector().id('editText_with_scrollbar').findOne()

  $editText_with_scrollbar.setText(msg)

  sleep(300)

  selector().bounds(959, 2235, 1036, 2312).clickable().click()

  consoleJobInfo('chat', jobInfo)
}

/**
 * @param {JobIno} jobInfo?
 * @returns 
 */
export function ChatAuto(jobInfo = {}) {
  selector().id('editText_with_scrollbar').waitFor()

  if (hasChat()) {
    consoleJobInfo('chat', jobInfo)
    back()
    waitForLeaveActivity(chatActivity)
    return false
  }

  sendMsg(jobInfo)
  back()
  waitForLeaveActivity(chatActivity)
  return true
}