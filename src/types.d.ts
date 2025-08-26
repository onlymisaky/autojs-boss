declare global {

  interface Salary {
    min: number
    max: number
    count: number
  }

  interface JobDescription {
    description?: string
    publicTime?: string
    workExperience: string
    degree: string
    keywords: string[]
    recommended?: string
  }

  interface Company {
    name: string
    stage: string // 融资阶段
    size?: string // 公司规模
    industry?: string // 行业
    address: string
    map?: string
    benefits?: string[]
  }

  interface Boss {
    title: string
    name: string
    active: string
    online: boolean
  }

  interface JobIno {
    title: string
    salary: Salary
    jd: JobDescription
    company: Company
    boss: Boss
    distance: string
  }
}

export { };
