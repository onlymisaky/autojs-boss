import { getTextByUiObject, swipeDown, swipeLeft, swipeToTopWithStop, swipeUp, waitSysAnimationEnd } from '@/common.js';
import { msg } from '@/config';
import { isEligibleJob, resolveSalary } from '@/utils.js';

/**
 * @returns {JobIno}
 */
function getJobInfoInJobDetail() {

  /** @type {JobIno} */
  const data = {}

  const $tv_job_name = selector().id('tv_job_name').findOne();
  data.title = getTextByUiObject($tv_job_name)
  const $tv_job_salary = selector().id('tv_job_salary').findOne();
  data.salary = resolveSalary(getTextByUiObject($tv_job_salary))

  data.jd = {}
  data.company = {}
  const $tv_required_location = selector().id('tv_required_location').findOne();
  data.company.address = getTextByUiObject($tv_required_location)
  const $tv_required_work_exp = selector().id('tv_required_work_exp').findOne();
  data.jd.workExperience = getTextByUiObject($tv_required_work_exp)
  const $tv_required_degree = selector().id('tv_required_degree').findOne();
  data.jd.degree = getTextByUiObject($tv_required_degree);

  data.boss = {}
  const $tv_boss_name = selector().id('tv_boss_name').findOne();
  data.boss.name = getTextByUiObject($tv_boss_name)
  const $tv_boss_title = selector().id('tv_boss_title').findOne();
  const $tv_boss_title_text = getTextByUiObject($tv_boss_title);
  const bossTitle = $tv_boss_title_text.split('·')[1] || '';
  data.boss.title = bossTitle
  const $$boss_label_tv = selector().id('boss_label_tv');
  data.boss.active = ''
  if ($$boss_label_tv.exists()) {
    data.boss.active = getTextByUiObject($$boss_label_tv.findOnce());
  }
  const $$iv_online_point = selector().id('iv_online_point');
  if ($$iv_online_point.exists()) {
    data.boss.online = true;
  }

  const $$fl_content_above = selector().id('fl_content_above')
  const jdKeywords = [];
  if ($$fl_content_above.exists()) {
    const $fl_content_above_children = $$fl_content_above.findOne().find(selector().className('android.widget.Button'));
    jdKeywords.push(...$fl_content_above_children.map((child) => getTextByUiObject(child)));
  }
  data.jd.keywords = jdKeywords;
  const $$ll_textmodule = selector().id('ll_textmodule');

  while (!(selector().id('home_tip_vf').exists())) {
    swipeUp(0.1)
  }

  const $$fl_content = selector().id('fl_content');
  const benefits = []
  if ($$fl_content.exists()) {
    const $fl_content_children = $$fl_content.findOne().find(selector().className('android.widget.Button'));
    benefits.push(...$fl_content_children.map((child) => getTextByUiObject(child)));
  }
  data.company.benefits = benefits;

  const $tv_com_name = selector().id('tv_com_name').findOne();
  data.company.name = getTextByUiObject($tv_com_name);
  const $tv_com_info = selector().id('tv_com_info').findOne();
  const $tv_com_info_text = getTextByUiObject($tv_com_info);
  const [stage = '', size = '', industry = ''] = $tv_com_info_text.split('·');
  data.company.stage = stage;
  data.company.size = size;
  data.company.industry = industry;
  const $tv_location = selector().id('tv_location').findOne();
  data.company.map = getTextByUiObject($tv_location);
  const $home_tip_vf = selector().id('home_tip_vf').findOne();
  data.distance = getTextByUiObject($home_tip_vf);

  swipeToTopWithStop();

  return data;
}

function waitUiObjectReady() {
  selector().id('tv_job_name').waitFor();
  selector().id('tv_job_salary').waitFor();

  selector().id('tv_required_location').waitFor();
  selector().id('tv_required_work_exp').waitFor();
  selector().id('tv_required_degree').waitFor();

  selector().id('tv_boss_name').waitFor();
  selector().id('tv_boss_title').waitFor();
}

export function JobDetailAuto() {
  console.info('JobDetailAuto');

  waitUiObjectReady();

  const jobInfo = getJobInfoInJobDetail();

  if (!isEligibleJob(jobInfo)) {
    swipeLeft(0.8);
    JobDetailAuto();
    return
  }

  const $btn_chat = selector().id('btn_chat').findOne();

  // jump to chat
  $btn_chat.click();

  waitSysAnimationEnd();

  ChatAuto(jobInfo)

  return
}


function hasChat() {
  return selector().id('tv_content_text').exists()
}

function sendMsg(jobInfo) {
  const $editText_with_scrollbar = selector().id('editText_with_scrollbar').findOne();

  // $editText_with_scrollbar.setText(msg);

  waitSysAnimationEnd();
  // TODO
  // selector().bounds(959, 2235, 1036, 2312).clickable().click();
  console.info('chat')
  console.log(jobInfo.company.name)
  console.log(jobInfo.title)
  console.log(jobInfo.salary.min + '-' + jobInfo.salary.max + ' ' + jobInfo.salary.count)
  waitSysAnimationEnd();
}

/**
 * @param {JobIno} jobInfo? 
 * @returns 
 */
function ChatAuto(jobInfo = {}) {

  selector().id('editText_with_scrollbar').waitFor();

  if (hasChat()) {
    console.info('hasChat');
    console.log(jobInfo.company.name)
    console.log(jobInfo.title)
    console.log(jobInfo.salary.min + '-' + jobInfo.salary.max + ' ' + jobInfo.salary.count)
    back()
    waitSysAnimationEnd();
    swipeLeft(0.8)
    JobDetailAuto();
    return;
  }

  sendMsg(jobInfo);
  back()
  waitSysAnimationEnd();
  swipeLeft(0.8)
  JobDetailAuto();
  return
}