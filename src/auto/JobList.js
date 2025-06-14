import { findClosestClickableParent, getTextByUiObject, swipeUp, waitForLeaveActivity } from '@/common.js';
import config from '@/config';
import { isEligibleJob, resolveSalary } from '@/utils.js';

/**
 * @param {UiObject} $boss_job_card_view
 * @returns {Partial<JobIno>} jobInfo
 */
function getJobInfoBy$boss_job_card_view($boss_job_card_view) {
  const $tv_position_name = $boss_job_card_view.findOne(selector().id('tv_position_name'));
  const $tv_salary_statue = $boss_job_card_view.findOne(selector().id('tv_salary_statue'));

  const $tv_company_name = $boss_job_card_view.findOne(selector().id('tv_company_name'));
  const $tv_stage = $boss_job_card_view.findOne(selector().id('tv_stage'));
  const $tv_scale = $boss_job_card_view.findOne(selector().id('tv_scale'));
  const $tv_rcd_reason = $boss_job_card_view.findOne(selector().id('tv_rcd_reason'));

  const $fl_require_info = $boss_job_card_view.findOne(selector().id('fl_require_info'));

  const $iv_online_point = $boss_job_card_view.findOne(selector().id('iv_online_point'));
  const $tv_employer = $boss_job_card_view.findOne(selector().id('tv_employer'));
  const $tv_active_status = $boss_job_card_view.findOne(selector().id('tv_active_status'));

  const $tv_distance = $boss_job_card_view.findOne(selector().id('tv_distance'));

  const $fl_require_info_children = $fl_require_info.find(selector().className('android.widget.TextView'));
  const keywords = $fl_require_info_children.map((child) => getTextByUiObject(child));
  const [workExperience = '', degree = '', ...otherKeywords] = keywords;

  const tv_employer_text = getTextByUiObject($tv_employer);
  const [bossName = '', bossTitle = ''] = tv_employer_text.split('·');

  const tv_distance_text = getTextByUiObject($tv_distance);
  const [distance = '', address = ''] = tv_distance_text.split('km');

  /** @type {JobIno} */
  const data = {
    title: getTextByUiObject($tv_position_name).trim().toLowerCase(),
    jd: {
      workExperience: workExperience.trim(),
      degree: degree.trim(),
      keywords: otherKeywords,
      recommended: getTextByUiObject($tv_rcd_reason),
    },
    salary: resolveSalary(getTextByUiObject($tv_salary_statue)),
    company: {
      name: getTextByUiObject($tv_company_name),
      stage: getTextByUiObject($tv_stage),
      size: getTextByUiObject($tv_scale),
      address: address.trim(),
    },
    boss: {
      name: bossName.trim(),
      title: bossTitle.trim(),
      active: getTextByUiObject($tv_active_status),
      online: $iv_online_point,
    },
    distance: distance.trim(),
  };

  return data;
}

/**
 * 查找当前列表中是否有符合要求的职位，如果没有，向上滑动
 * 返回 true 表示有符合要求的职位
 * 返回 false 表示没有
 */
export function JobListAuto() {
  const $boss_job_card_view_list = selector().id('boss_job_card_view').untilFind();
  let $job_card_view = null;

  $boss_job_card_view_list.forEach(element => {
    try {
      const jobInfo = getJobInfoBy$boss_job_card_view(element);
      const { isEligible } = isEligibleJob(jobInfo);
      if (isEligible && !$job_card_view) {
        $job_card_view = element;
      }
    }
    catch {
      console.error('应该是没完全滚动到可视区域内');
    }
  });

  if (!$job_card_view) {
    swipeUp(0.4);
    return;
  }

  const $clickable_parent = findClosestClickableParent($job_card_view);

  if (!$clickable_parent) {
    swipeUp(0.4);
    return;
  }

  $clickable_parent.click();

  waitForLeaveActivity(config.mainActivity);

  return true;
}
