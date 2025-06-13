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
