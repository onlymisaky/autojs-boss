import { getTextByUiObject, swipeLeft, swipeToTopWithStop, swipeUp, waitSysAnimationEnd } from '@/common.js'
import { msg } from '@/config'
import { isEligibleJob, resolveSalary } from '@/utils.js'

function nextJob() {
  swipeLeft(0.8)
  waitSysAnimationEnd()
  JobDetailAuto()
}

function getCurrentPanel() {
  const $rv_list_collection = selector().id('rv_list').find()
  const bottom = $rv_list_collection.get(0).bounds().bottom
  const $rv_list = $rv_list_collection.findOne(selector().boundsContains(0, 0, device.width, bottom))
  return $rv_list
}

/**
 * @param {UiCollection} collection 
 */
function findOneInCollectionById(collection, selectorId) {
  const $uiobject = collection.findOne(selector().id(selectorId))
  return $uiobject
}

/**
 * @param {UiCollection} collection 
 */
function findInCollectionById(collection, selectorId) {
  const $uicollection = collection.find(selector().id(selectorId))
  return $uicollection
}

/**
 * @param {UiCollection} uicollection 
 * @param {string} selectorId 
 * @returns 
 */
function getText(uicollection, selectorId) {
  const $uiobject = findOneInCollectionById(uicollection, selectorId)
  const text = getTextByUiObject($uiobject)
  return text
}

/**
 * @param {UiCollection} uicollection 
 * @returns {JobIno}
 */
function getJobInfoInJobDetail() {
  // 获取的集合不是实时的，所以每次重新调用
  const title = getText(getCurrentPanel().children(), 'tv_job_name').trim().toLowerCase()
  const salaryText = getText(getCurrentPanel().children(), 'tv_job_salary')
  const salary = resolveSalary(salaryText)

  const company_address = getText(getCurrentPanel().children(), 'tv_required_location')
  const jd_workExperience = getText(getCurrentPanel().children(), 'tv_required_work_exp')
  const jd_degree = getText(getCurrentPanel().children(), 'tv_required_degree')

  let jd_publicTime = ''
  const $tv_public_time_collection = findInCollectionById(getCurrentPanel().children(), 'tv_public_time')
  if ($tv_public_time_collection.size() > 0) {
    jd_publicTime = getTextByUiObject($tv_public_time_collection.get(0))
  }

  const $iv_online_point_collection = findInCollectionById(getCurrentPanel().children(), 'iv_online_point')
  const boss_online = $iv_online_point_collection.size() > 0 ? true : false

  const boss_name = getText(getCurrentPanel().children(), 'tv_boss_name')
  const bossTitleText = getText(getCurrentPanel().children(), 'tv_boss_title')
  const boss_title = bossTitleText.split('·')[1] || ''
  const $boss_label_tv_collection = findInCollectionById(getCurrentPanel().children(), 'boss_label_tv')
  const boss_active = $boss_label_tv_collection.size() > 0 ? getTextByUiObject($boss_label_tv_collection.get(0)) : ''

  if (!isEligibleJob({ title, salary, company: { name: `${bossTitleText.split('·')[0]}`.trim() } })) {
    return false
  }

  const $fl_content_above_collection = findInCollectionById(getCurrentPanel().children(), 'fl_content_above')
  const jd_keywords = $fl_content_above_collection.size() > 0
    ? $fl_content_above_collection
      .get(0)
      .find(selector().className('android.widget.Button'))
      .map((item) => getTextByUiObject(item))
    : []

  while (!(selector().id('home_tip_vf').exists())) {
    swipeUp(0.1)
  }

  const $fl_content_collection = findInCollectionById(getCurrentPanel().children(), 'fl_content')
  const company_benefits = $fl_content_collection.size() > 0
    ? $fl_content_collection
      .get(0)
      .find(selector().className('android.widget.Button'))
      .map((item) => getTextByUiObject(item))
    : []

  const company_name = getText(getCurrentPanel().children(), 'tv_com_name')
  const companyInfo = getText(getCurrentPanel().children(), 'tv_com_info')
  const [
    company_stage = '',
    company_size = '',
    company_industry = ''
  ] = companyInfo.split('·').map((item) => item.trim())

  const company_map = getText(getCurrentPanel().children(), 'tv_location')

  const distance = getText(getCurrentPanel().children(), 'home_tip_vf')

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
      map: company_map
    },
    boss: {
      name: boss_name,
      title: boss_title.trim(),
      online: boss_online,
      active: boss_active,
    },
    distance,
  }

  swipeToTopWithStop()

  return data
}

/**
 * 
 * @param {JobIno} jobInfo 
 */
function mock(jobInfo) {
  waitSysAnimationEnd()
  console.info('mock chat')
  console.log(jobInfo.title)
  console.log(jobInfo.salary.min + '-' + jobInfo.salary.max + ' ' + jobInfo.salary.count)
  console.log(jobInfo.company.name)
  nextJob()
}

function waitUiObjectReady() {
  selector().id('tv_job_name').waitFor()
  selector().id('tv_job_salary').waitFor()

  selector().id('tv_required_location').waitFor()
  selector().id('tv_required_work_exp').waitFor()
  selector().id('tv_required_degree').waitFor()

  selector().id('tv_boss_name').waitFor()
  selector().id('tv_boss_title').waitFor()
}

export function JobDetailAuto() {

  waitUiObjectReady()
  waitSysAnimationEnd()

  const jobInfo = getJobInfoInJobDetail()

  if (!jobInfo || !isEligibleJob(jobInfo)) {
    nextJob()
    return
  }

  const $btn_chat = selector().id('btn_chat').findOne()

  // jump to chat
  $btn_chat.click()

  waitSysAnimationEnd()

  ChatAuto(jobInfo)

  return
}


function hasChat() {
  return selector().id('tv_content_text').exists()
}

/**
 * @param {JobIno} jobInfo 
 */
function sendMsg(jobInfo) {
  const $editText_with_scrollbar = selector().id('editText_with_scrollbar').findOne()

  $editText_with_scrollbar.setText(msg)

  waitSysAnimationEnd()
  // TODO
  selector().bounds(959, 2235, 1036, 2312).clickable().click()
  console.info('chat')
  console.log(jobInfo.company.name)
  console.log(jobInfo.title)
  console.log(jobInfo.salary.min + '-' + jobInfo.salary.max + ' ' + jobInfo.salary.count)
  waitSysAnimationEnd()
}

/**
 * @param {JobIno} jobInfo? 
 * @returns 
 */
function ChatAuto(jobInfo = {}) {

  selector().id('editText_with_scrollbar').waitFor()

  if (hasChat()) {
    console.info('hasChat')
    console.log(jobInfo.company.name)
    console.log(jobInfo.title)
    console.log(jobInfo.salary.min + '-' + jobInfo.salary.max + ' ' + jobInfo.salary.count)
    back()
    waitSysAnimationEnd()
    nextJob()
    return
  }

  sendMsg(jobInfo)
  back()
  waitSysAnimationEnd()
  nextJob()
  return
}