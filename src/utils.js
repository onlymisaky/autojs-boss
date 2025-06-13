import {
  excludeCompanies,
  excludeCompanyMsg,
  jobTitleExcludeMsg,
  jobTitleMatches,
  jobTitleNotIncludeMsg,
  salaryNotInRangeMsg,
  salaryRange,
} from './config.js';

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
 * @param {JobIno} jobInfo
 */
export function consoleJobInfo(jobInfo) {
  console.log(`公司：${jobInfo.company.name}`);
  console.log(`职位：${jobInfo.title}`);
  console.log(`薪资：${jobInfo.salary.min}-${jobInfo.salary.max} ${jobInfo.salary.count}`);
}

/**
 * @param {JobIno} job
 */
export function isEligibleJob(job) {
  const { title = '', salary = { min: 0, max: 0, count: '' }, company = {} } = job;

  const includeKeywords = jobTitleMatches.include.filter((keyword) => keyword.trim());
  const excludeKeywords = jobTitleMatches.exclude.filter((keyword) => keyword.trim());
  const excludeCompany = excludeCompanies.filter((keyword) => keyword.trim());

  if (includeKeywords.length) {
    if (!(includeKeywords.some((keyword) => title.includes(keyword)))) {
      return { isEligible: false, reason: jobTitleNotIncludeMsg };
    }
  }

  if (excludeKeywords.some((keyword) => title.includes(keyword))) {
    return { isEligible: false, reason: jobTitleExcludeMsg };
  }

  const [min, max] = salaryRange;
  if (salary.min < min && salary.max < max) {
    return { isEligible: false, reason: salaryNotInRangeMsg };
  }

  if (excludeCompany.some((keyword) => company.name.includes(keyword))) {
    return { isEligible: false, reason: excludeCompanyMsg };
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

export function logWithTime(...msgs) {
  console.log(`[${timeNow()}]`, ...msgs);
  console.log(...msgs);
}

export function logErrorWithTime(...msgs) {
  console.error(`[${timeNow()}]`, ...msgs);
  console.error(...msgs);
}
