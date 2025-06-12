import { jobTitleMatches, salaryRange } from './config.js'

export function resolveSalary(salaryText) {
  const arr = salaryText.split('·')
  const count = arr[1] || '12薪'
  arr[0] = `${arr[0]}`.trim().toLowerCase()
  if (!arr[0].endsWith('k')) {
    return {
      min: 0,
      max: 0,
      count: salaryText
    }
  }
  const salaryRange = arr[0].split('-').map((item) => item.replace('k', ''))
  const max = salaryRange[1]
  const min = salaryRange[0]
  return {
    min,
    max,
    count,
  }
}

/**
 * @param {string} prefix 
 * @param {JobIno} jobInfo 
 */
function consoleError(prefix, jobInfo) {
  console.error(prefix + ' ↓↓↓')
  console.log(jobInfo.company.name)
  console.log(jobInfo.title)
  console.log(jobInfo.salary.min + '-' + jobInfo.salary.max + ' ' + jobInfo.salary.count)
  console.error('------------')
}

/**
 * @param {JobIno} job 
 * @returns {boolean}
 */
export function isEligibleJob(job) {
  const { title, salary, company } = job

  const { include: includeKeywords, exclude: excludeKeywords } = jobTitleMatches

  if (!(includeKeywords.some((keyword) => title.includes(keyword)))) {
    consoleError('不是前端', job)
    return false
  }

  if (excludeKeywords.some((keyword) => title.includes(keyword))) {
    consoleError('臭外包的', job)
    return false
  }

  const [min, max] = salaryRange
  if (salary.min < min && salary.max < max) {
    consoleError('钱太少', job)
    return false
  }

  return true
}


export function catchError(fn, errorFn) {
  try {
    fn()
  } catch (error) {
    errorFn(error)
  }
}