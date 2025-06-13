import { getTextByUiObject, swipeLeft, swipeToTopWithStop, swipeUp, waitForLeaveActivity } from '@/common.js';
import { detailActivity } from '@/config';
import { consoleNotMatchReason, isEligibleJob, resolveSalary } from '@/utils.js';

export function nextJob(beforSwipeWaitMs = 1) {
  sleep(beforSwipeWaitMs);
  swipeLeft(0.8);
}

function getCurrentPanel() {
  const $rv_list_collection = selector().id('rv_list').untilFind();
  const bottom = $rv_list_collection.get(0).bounds().bottom;
  const $rv_list = $rv_list_collection.findOne(selector().boundsContains(0, 0, device.width, bottom));
  return $rv_list;
}

/**
 * @param {UiCollection} collection
 */
function findOneInCollectionById(collection, selectorId) {
  const $uiobject = collection.findOne(selector().id(selectorId));
  return $uiobject;
}

/**
 * @param {UiCollection} collection
 */
function findInCollectionById(collection, selectorId) {
  const $uicollection = collection.find(selector().id(selectorId));
  return $uicollection;
}

/**
 * @param {UiCollection} uicollection
 * @param {string} selectorId
 */
function getText(uicollection, selectorId) {
  const $uiobject = findOneInCollectionById(uicollection, selectorId);
  const text = getTextByUiObject($uiobject);
  return text;
}

function getJobInfoInJobDetail() {
  // 获取的集合不是实时的，所以每次重新调用
  const title = getText(getCurrentPanel().children(), 'tv_job_name').trim().toLowerCase();
  const salaryText = getText(getCurrentPanel().children(), 'tv_job_salary');
  const salary = resolveSalary(salaryText);

  const company_address = getText(getCurrentPanel().children(), 'tv_required_location');
  const jd_workExperience = getText(getCurrentPanel().children(), 'tv_required_work_exp');
  const jd_degree = getText(getCurrentPanel().children(), 'tv_required_degree');

  let jd_publicTime = '';
  const $tv_public_time_collection = findInCollectionById(getCurrentPanel().children(), 'tv_public_time');
  if ($tv_public_time_collection.size() > 0) {
    jd_publicTime = getTextByUiObject($tv_public_time_collection.get(0));
  }

  const $iv_online_point_collection = findInCollectionById(getCurrentPanel().children(), 'iv_online_point');
  const boss_online = $iv_online_point_collection.size() > 0;

  const boss_name = getText(getCurrentPanel().children(), 'tv_boss_name');
  const bossTitleText = getText(getCurrentPanel().children(), 'tv_boss_title');
  const boss_title = bossTitleText.split('·')[1] || '';
  const $boss_label_tv_collection = findInCollectionById(getCurrentPanel().children(), 'boss_label_tv');
  const boss_active = $boss_label_tv_collection.size() > 0 ? getTextByUiObject($boss_label_tv_collection.get(0)) : '';

  // 提前校验，节省乡下滚动时间
  const { isEligible } = isEligibleJob({
    title,
    salary,
    company: { name: `${bossTitleText.split('·')[0]}`.trim() }
  })

  if (!isEligible) {
    return { title, salary, company: { name: `${bossTitleText.split('·')[0]}`.trim() } };
  }

  const $fl_content_above_collection = findInCollectionById(getCurrentPanel().children(), 'fl_content_above');
  const jd_keywords = $fl_content_above_collection.size() > 0
    ? $fl_content_above_collection
      .get(0)
      .find(selector().className('android.widget.Button'))
      .map((item) => getTextByUiObject(item))
    : [];

  while (!(selector().id('home_tip_vf').exists())) {
    swipeUp(0.2);
  }

  const $fl_content_collection = findInCollectionById(getCurrentPanel().children(), 'fl_content');
  const company_benefits = $fl_content_collection.size() > 0
    ? $fl_content_collection
      .get(0)
      .find(selector().className('android.widget.Button'))
      .map((item) => getTextByUiObject(item))
    : [];

  const company_name = getText(getCurrentPanel().children(), 'tv_com_name');
  const companyInfo = getText(getCurrentPanel().children(), 'tv_com_info');
  const [
    company_stage = '',
    company_size = '',
    company_industry = '',
  ] = companyInfo.split('·').map((item) => item.trim());

  const company_map = getText(getCurrentPanel().children(), 'tv_location');

  const distance = getText(getCurrentPanel().children(), 'home_tip_vf');

  /** @type {JobIno} */
  const data = {
    title,
    salary,
    jd: {
      workExperience: jd_workExperience,
      degree: jd_degree,
      publicTime: jd_publicTime,
      keywords: jd_keywords,
    },
    company: {
      name: company_name,
      address: company_address,
      benefits: company_benefits,
      stage: company_stage,
      size: company_size,
      industry: company_industry,
      map: company_map,
    },
    boss: {
      name: boss_name,
      title: boss_title.trim(),
      online: boss_online,
      active: boss_active,
    },
    distance,
  };

  swipeToTopWithStop();

  return data;
}

function waitForJobDetailReady() {
  let $rv_list = getCurrentPanel();
  while (
    !$rv_list
    || !$rv_list.children
    || !getText($rv_list.children(), 'tv_boss_title').trim()
  ) {
    $rv_list = getCurrentPanel();
    sleep(100);
  }
}

/**
 * 自动获取职位信息，并判断是否符合要求
 * 符合要求，跳转到聊天
 * 不符合要求，左滑查看下一个职位
 */
export function JobDetailAuto() {
  waitForJobDetailReady();

  const jobInfo = getJobInfoInJobDetail();
  const { isEligible, reason } = isEligibleJob(jobInfo);

  if (!isEligible) {
    consoleNotMatchReason(reason, jobInfo);
    nextJob();
    return { jobInfo, isEligible: false };
  }

  const $btn_chat = selector().id('btn_chat').findOne();

  $btn_chat.click();

  waitForLeaveActivity(detailActivity);

  return { jobInfo, isEligible: true };
}
