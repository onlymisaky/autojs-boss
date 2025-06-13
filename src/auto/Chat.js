import { waitForLeaveActivity } from '@/common.js';
import { chatActivity, msg } from '@/config.js';

function hasChat() {
  return selector().id('tv_content_text').exists();
}

function consoleChatInfo(prefix, jobInfo) {
  console.info(`${prefix} ↓↓↓`);
  console.log(jobInfo.company.name);
  console.log(jobInfo.title);
  console.log(`${jobInfo.salary.min}-${jobInfo.salary.max} ${jobInfo.salary.count}`);
  console.info('------------');
}

/**
 * @param {JobIno} jobInfo
 */
function sendMsg(jobInfo) {
  const $editText_with_scrollbar = selector().id('editText_with_scrollbar').findOne();

  $editText_with_scrollbar.setText(msg);

  sleep(300);

  selector().bounds(959, 2235, 1036, 2312).clickable().click();

  consoleChatInfo('chat', jobInfo);
}

/**
 * @param {JobIno} jobInfo
 * @returns {boolean} 是否聊过
 */
export function ChatAuto(jobInfo = {}) {
  selector().id('editText_with_scrollbar').waitFor();

  if (hasChat()) {
    consoleChatInfo('chat', jobInfo);
    back();
    waitForLeaveActivity(chatActivity);
    return false;
  }

  sendMsg(jobInfo);
  back();
  waitForLeaveActivity(chatActivity);
  return true;
}
