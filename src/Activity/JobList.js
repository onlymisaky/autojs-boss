
import { getTextByUiObject, findClosestClickableParent, swipeUp } from '@/common.js'
import { isEligibleJob, resolveSalary } from '@/utils.js'
import { JobDetailAuto } from '@/Activity/JobDetail.js'

/**
 * @param {UiObject} $boss_job_card_view 
 * @returns {Partial<JobIno>}
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
  const [workExperience = '', degree = '', ...otherKeywords] = keywords

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
    distance: distance.trim()
  };

  return data;
}

export function JobListAuto() {
  console.info('JobListAuto');

  const $boss_job_card_view_list = selector().id('boss_job_card_view').untilFind();
  let $job_card_view = null;

  $boss_job_card_view_list.forEach(element => {
    const jobInfo = getJobInfoBy$boss_job_card_view(element);
    const isEligible = isEligibleJob(jobInfo)
    if (isEligible && !$job_card_view) {
      $job_card_view = element;
    }
  });

  if (!$job_card_view) {
    console.info('没有找到符合条件的岗位, 滑动屏幕继续查找');
    swipeUp(0.4)
    sleep(1000)
    JobListAuto()
    return;
  }

  const $clickable_parent = findClosestClickableParent($job_card_view);

  if (!$clickable_parent) {
    console.error('没有找到可点击的元素');
    return;
  }

  // jump to detail
  $clickable_parent.click();
  JobDetailAuto()
  return
}