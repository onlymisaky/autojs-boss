import { waitForLeaveActivity, writeLog } from '@/common.js';
import { chatActivity, msg, sendBounds } from '@/config.js';
import { genLogMsg } from '@/utils';

function hasChat() {
  return selector().id('tv_content_text').exists();
}

/**
 * @param {JobIno} jobInfo
 */
function sendMsg(jobInfo) {
  const $editText_with_scrollbar = selector().id('editText_with_scrollbar').findOne();

  $editText_with_scrollbar.setText(msg);

  sleep(300);

  selector().bounds(...sendBounds.map((v) => Number(v))).clickable().click();

  writeLog(genLogMsg('沟通', jobInfo), '😊');
}

/**
 * @param {JobIno} jobInfo
 * @returns {boolean} 是否聊过
 */
export function ChatAuto(jobInfo = {}) {
  selector().id('editText_with_scrollbar').waitFor();

  if (hasChat()) {
    writeLog(genLogMsg('聊过', jobInfo), '🙂');
    back();
    waitForLeaveActivity(chatActivity);
    return false;
  }

  sendMsg(jobInfo);
  back();
  waitForLeaveActivity(chatActivity);
  return true;
}
