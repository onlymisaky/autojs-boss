declare global {
  interface JobIno {
    title: string;
    salary: {
      min: number;
      max: number;
      count: number;
    };
    jd: {
      workExperience: string;
      degree: string;
      keywords: string[]
      recommended?: string
    },
    company: {
      name: string;
      stage: string; // 融资阶段
      size?: string; // 公司规模
      industry?: string; // 行业
      address: string;
      map?: string;
      benefits?: string[];
    },
    boss: {
      title: string;
      name: string;
      active: string;
      online: boolean;
    },
    distance: string;
  }
}

export { }