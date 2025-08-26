import config from './config.js';

export function resolveSalary(salaryText) {
  const arr = salaryText.split('·');
  const count = arr[1] || '12薪';
  arr[0] = `${arr[0]}`.trim().toLowerCase();
  if (!arr[0].endsWith('k')) {
    return {
      min: 0,
      max: 0,
      count: salaryText,
    };
  }
  const salaryRange = arr[0].split('-').map((item) => item.replace('k', ''));
  const max = salaryRange[1];
  const min = salaryRange[0];
  return {
    min,
    max,
    count,
  };
}

/**
 * @param {JobIno} job
 */
export function isEligibleJob(job) {
  const { salary = { min: 0, max: 0, count: '' } } = job;

  const jobTitle = job.title;

  if (!jobTitle || jobTitle.trim() === '') {
    return { isEligible: false, reason: '职位名称为空' };
  }

  const includeKeywords = config.jobTitleMatches.include.filter((keyword) => keyword.trim());
  const excludeKeywords = config.jobTitleMatches.exclude.filter((keyword) => keyword.trim());
  const excludeCompany = config.excludeCompanies.filter((keyword) => keyword.trim());
  const excludeJobDescriptionKeywords = config.excludeJobDescriptionKeywords.filter((keyword) => keyword.trim());

  if (includeKeywords.length) {
    if (!(includeKeywords.some((keyword) => jobTitle.trim().toLowerCase().includes(keyword)))) {
      return {
        isEligible: false,
        reason: `职位名称中不包含关键词：${includeKeywords.join('、')}`,
      };
    }
  }

  let arr = excludeKeywords.filter((keyword) => jobTitle.trim().toLowerCase().includes(keyword));

  if (arr.length) {
    return {
      isEligible: false,
      reason: `职位名称中包含关键词：${arr.join('、')}`,
    };
  }

  const [min, max] = config.salaryRange;
  if (salary.min < min && salary.max < max) {
    return { isEligible: false, reason: config.salaryNotInRangeMsg };
  }

  const companyName = job.company?.name;

  if (!companyName || companyName.trim() === '') {
    return { isEligible: false, reason: '公司名称为空' };
  }

  arr = excludeCompany.filter((keyword) => companyName.trim().toLowerCase().includes(keyword));

  if (arr.length) {
    return {
      isEligible: false,
      reason: `公司名称中包含关键词：${arr.join('、')}`,
    };
  }

  const jobDescription = job.jd?.description;

  if (jobDescription && jobDescription.trim() !== '') {
    arr = excludeJobDescriptionKeywords.filter((keyword) => jobDescription.trim().toLowerCase().includes(keyword));
    if (arr.length) {
      return {
        isEligible: false,
        reason: `职位描述中包含关键词：${arr.join('、')}`,
      };
    }
  }

  return { isEligible: true, reason: '' };
}

export function timeNow(format = 'yyyy-MM-dd HH:mm:ss') {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return format
    .replace('yyyy', year)
    .replace('MM', month)
    .replace('dd', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

export function logErrorWithTime(...msgs) {
  console.error(`[${timeNow()}]`, ...msgs);
}

/**
 * @param {string} result
 * @param {JobIno} jobInfo
 * @param {boolean} _isEligible
 */
export function genViewJobLogMsg(result, jobInfo, _isEligible = false) {
  let msg = `${result}\n`;
  msg += `公司：${jobInfo.company.name} ${jobInfo.company.size ? jobInfo.company.size : ''}\n`;
  msg += `职位：${jobInfo.title}\n`;
  msg += `薪资：${jobInfo.salary.min}-${jobInfo.salary.max} ${jobInfo.salary.count}\n`;
  // if (_isEligible) {
  msg += `要求：${jobInfo.jd.degree} ${jobInfo.jd.workExperience}\n`;
  msg += `${jobInfo.jd.description}\n`;
  msg += `区域：${jobInfo.company.address}\n`;
  msg += `地址：${jobInfo.company.map} ${jobInfo.distance ? jobInfo.distance : ''}\n`;
  msg += `HR：${jobInfo.boss.name}${jobInfo.boss.online ? '(在线)' : ''} ${jobInfo.boss.active || ''}\n`;
  // }
  msg += `${JSON.stringify(jobInfo)}\n`;
  return msg;
}
