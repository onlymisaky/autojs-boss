import { jobTitleMatches, salaryRange } from './config.js'

export function resolveSalary(salaryText) {
  const arr = salaryText.split('·');
  const count = arr[1] || '12薪';
  arr[0] = `${arr[0]}`.trim().toLowerCase()
  if (!arr[0].endsWith('k')) {
    return {
      min: 0,
      max: 0,
      count: salaryText
    }
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
 * @returns {boolean}
 */
export function isEligibleJob(job) {
  const { title, salary, company } = job;

  const { include: includeKeywords, exclude: excludeKeywords } = jobTitleMatches

  if (!(includeKeywords.some((keyword) => title.includes(keyword)))) {
    console.error('不是前端');
    console.log(title)
    return false;
  }

  if (excludeKeywords.some((keyword) => title.includes(keyword))) {
    console.error('臭外包的');
    console.log(title)
    return false;
  }

  const [min, max] = salaryRange
  if (salary.min < min && salary.max < max) {
    console.error('钱太少');
    console.log(company.name);
    console.log(title);
    console.log(salary.min + '-' + salary.max + ' ' + salary.count);
    return false;
  }

  return true
}
