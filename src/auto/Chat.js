import { waitForLeaveActivity, writeLog } from '@/common.js';
import config from '@/config.js';
import { genViewJobLogMsg } from '@/utils';

function hasChat() {
  return selector().id('tv_content_text').exists();
}

/**
 * @param {JobIno} jobInfo
 */
function sendMsg(jobInfo) {
  const $editText_with_scrollbar = selector().id('editText_with_scrollbar').findOne();

  for (const msg of config.msgs) {
    $editText_with_scrollbar.setText(msg);

    sleep(300);

    selector().bounds(...config.sendBounds.map((v) => Number(v))).clickable().click();
  }

  writeLog(genViewJobLogMsg('沟通', jobInfo), '😊');
}

/**
 * @param {JobIno} jobInfo
 * @returns {boolean} 是否聊过
 */
export function ChatAuto(jobInfo = {}) {
  selector().id('editText_with_scrollbar').waitFor();

  if (hasChat()) {
    writeLog(genViewJobLogMsg('聊过', jobInfo), '🙂');
    back();
    waitForLeaveActivity(config.chatActivity);
    return false;
  }

  sendMsg(jobInfo);
  back();
  waitForLeaveActivity(config.chatActivity);
  return true;
}
