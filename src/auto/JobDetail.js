import {
  findClosestClickableParent,
  getTextByUiObject,
  swipeLeft,
  swipeToTopWithStop,
  swipeUp,
  waitForLeaveActivity,
  writeLog,
} from '@/common.js';
import config from '@/config';
import { genViewJobLogMsg, isEligibleJob, resolveSalary } from '@/utils.js';

export function nextJob(beforSwipeWaitMs = 1) {
  sleep(beforSwipeWaitMs);
  swipeLeft(0.8);
}

/**
 * 滑动过程中也要实时获取 uiobject
 * @param {string} selectorId
 */
function clickMore(selectorId) {
  const getUiobject = () => {
    const $uiobject = findOneInCollectionById(getCurrentPanel().children(), selectorId);
    return $uiobject;
  };

  let $uiobject = getUiobject();
  const bottom = $uiobject.bounds().bottom;
  while ($uiobject.bounds().bottom >= bottom) {
    if (currentPackage() !== config.pkg) {
      return false;
    }

    if (currentActivity() !== config.detailActivity) {
      return false;
    }

    swipeUp(0.1);

    $uiobject = getUiobject();
  }

  click($uiobject.bounds().right - 50, $uiobject.bounds().bottom - 50);

  return true;
}

function swipeToLastInfoVisible() {
  while (!(selector().id('tv_job_competitive_title').exists())) {
    if (currentPackage() !== config.pkg) {
      return false;
    }

    if (currentActivity() !== config.detailActivity) {
      return false;
    }

    swipeUp(0.2);
  }
  return true;
}

// eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
function copyUrl() {
  const $$iv_share = selector().id('iv_share');
  $$iv_share.findOne().click();

  const $$tv_share_title = selector().id('tv_share_title');
  $$tv_share_title.waitFor();

  const $rv_share = selector().id('rv_share').findOne();
  const { top, bottom, right, left } = $rv_share.bounds();

  const startX = (right - left) * 0.9;
  const endX = (right - left) * 0.1;

  const startY = top + (bottom - top) * 0.5;
  const endY = startY;

  while (!selector().id('tv_share_type').text('复制链接').exists()) {
    swipe(startX, startY, endX, endY, 300);
    sleep(100);
  }

  const $tv_share_type = selector().id('tv_share_type').text('复制链接').findOne();
  const $clickable_parent = findClosestClickableParent($tv_share_type);

  if (!$clickable_parent) {
    setClip('');
    return;
  }

  $clickable_parent.click();
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
  const [company_title, boss_title] = bossTitleText.split('•');
  const $boss_label_tv_collection = findInCollectionById(getCurrentPanel().children(), 'boss_label_tv');
  const boss_active = $boss_label_tv_collection.size() > 0 ? getTextByUiObject($boss_label_tv_collection.get(0)) : '';

  const $fl_content_above_collection = findInCollectionById(getCurrentPanel().children(), 'fl_content_above');
  const jd_keywords = $fl_content_above_collection.size() > 0
    ? $fl_content_above_collection
        .get(0)
        .find(selector().className('android.widget.Button'))
        .map((item) => getTextByUiObject(item))
    : [];

  let jd_description = '';
  const $ll_textmodule = getCurrentPanel().children().find(selector().id('ll_textmodule'));
  if ($ll_textmodule.size()) {
    const $tv_description = $ll_textmodule.get(0).findOne(selector().id('tv_description'));
    jd_description = getTextByUiObject($tv_description);
  }

  /** @type {JobIno} */
  const data = {
    title,
    salary,
    jd: {
      description: jd_description,
      workExperience: jd_workExperience,
      degree: jd_degree,
      publicTime: jd_publicTime,
      keywords: jd_keywords,
    },
    company: {
      address: company_address,
      name: company_title.trim(),
    },
    boss: {
      name: boss_name,
      title: boss_title.trim(),
      online: boss_online,
      active: boss_active,
    },
    distance: '',
  };

  const { isEligible } = isEligibleJob(data);

  // 如果不符合要求，也没有配置 当不匹配也要加载完整职位描述 ，则直接退出，不继续向下滚动，节省更多时间
  if (!isEligible && !config.whileNotMatchLoadFullJobDescription) {
    if (!isEligible) {
      return data;
    }
  }

  // 职位描述太长，需要点击查看更多
  if (jd_description && jd_description.endsWith('查看更多')) {
    if (clickMore('tv_description')) {
      jd_description = getText(getCurrentPanel().children(), 'tv_description');
      data.jd.description = jd_description;
    }
  }

  // 如果不符合要求，也没有配置 当不匹配也要加载完整职信息，则直接退出，不继续向下滚动，节省更多时间
  if (!isEligible && !config.whileNotMatchLoadFullJobDetail) {
    return data;
  }

  // 一直向上滑动，直到最后一条信息出现
  // 退出 app 或退出 当前 activity 时，停止滑动
  if (!swipeToLastInfoVisible()) {
    return data;
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

  let distance = '';
  const $home_tip_vf_collection = findInCollectionById(getCurrentPanel().children(), 'home_tip_vf');
  if ($home_tip_vf_collection.size()) {
    const $tv_distance = $home_tip_vf_collection.get(0).children().findOne(selector().id('tv_title'));
    if ($tv_distance) {
      distance = getTextByUiObject($tv_distance);
    }
  }

  data.company = {
    ...data.company,
    name: company_name,
    stage: company_stage,
    size: company_size,
    industry: company_industry,
    address: company_map,
    benefits: company_benefits,
  };
  data.distance = distance;

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
    const msg = genViewJobLogMsg(reason, jobInfo);
    writeLog(msg, '👎');
    nextJob();
    return { jobInfo, isEligible };
  }

  const $btn_chat = selector().id('btn_chat').findOne();

  $btn_chat.click();

  waitForLeaveActivity(config.detailActivity);

  return { jobInfo, isEligible };
}
