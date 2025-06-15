const config = {
  pkg: 'com.hpbr.bosszhipin',
  mainActivity: 'com.hpbr.bosszhipin.module.main.activity.MainActivity',
  detailActivity: 'com.hpbr.bosszhipin.geekjd.activity.BossJobPagerActivity',
  chatActivity: 'com.hpbr.bosszhipin.chat.single.activity.ChatRoomActivity',
  jobTitleMatches: {
    include: ['前端', 'web'],
    exclude: [
      '外包',
      '外派',
      '驻场',
      '短期',
      '长期',
      '稳定',

      '英语',
      '口语',

      '产品经理',
      '经理',
      '主管',
      '负责人',

      '游戏',
      'unity',
      'cocos',
      'webgl',
      'gis',
      'ue4',
      'ue5',
      '3d',
      'threejs',
      'three.js',

      '微信',
      '小程序',
      'uniapp',
      'uni-app',

      '移动端',
      'android',
      '安卓',
      'ios',
      '大前端',
      'flutter',
      'rn',
      'native',
      '鸿蒙',
      'harmony',
      '跨端',

      '全栈',
      'java',

      'ai',
      'agent',
      'agi',
      '算法',
      '区块链',

      '合伙人',
      '远程',

      '校招',
      '兼职',
      '实习',
      '管培',

      'soc',
      '芯片',
      '数字前端',
      '设计师',
    ],
  },
  jobTitleNotIncludeMsg: '不是前端岗位',
  jobTitleExcludeMsg: '不是优质的纯前端岗位',
  excludeCompanies: [
    '阿里巴巴',
    '腾讯',
    '百度',
    '蚂蚁金服',
    '网易',
    '字节跳动',
    '京东',
    '美团',
    '拼多多',
    '优酷',
    '美团',
    'pdd',
    'Pdd',
    'PDD',
    '百度',
    '得物',
    '华为',

    '微创',
    '合合信息',
    '泛微',
    '纬创',
    '浪潮',
    '数字马力',
    '中软',
    '软通',
    '法本',
    '佰钧成',
    '达达集团',
    '人瑞',
    '海南钦诚软件',
    '自协软件',
    '新致软件',
  ],
  excludeCompanyMsg: '公司不适合',
  salaryRange: [20, 30],
  salaryNotInRangeMsg: '薪资不在范围内',
  msgs: [
    '您好，我对这份工作非常感兴趣，希望可以有机会与您进一步沟通。',
    '我熟练掌握Vue/React，具有微前端、组件库、前端工程化等经验。',
    '期待能有机会与您一起工作。',
  ],
  sendBounds: [959, 2235, 1036, 2312],
};

/**
 * @param {any} stringArrConfig
 * @returns {string[]} stringArray
 */
function formatStringArr(stringArrConfig) {
  if (Array.isArray(stringArrConfig)) {
    return stringArrConfig.reduce((prev, item) => {
      const str = `${item}`.trim();
      if (!['undefined', 'null', ''].includes(str)) {
        prev.push(str);
      }
      return prev;
    }, []);
  }
  return [];
}

try {
  const path = files.join(files.cwd(), 'boss-auto-config.json');
  const userConfigStr = files.read(path, 'utf-8');
  const userConfig = JSON.parse(userConfigStr);

  const jobTitleIncludes = formatStringArr(userConfig?.jobTitleMatches?.include);
  if (jobTitleIncludes.length > 0) {
    config.jobTitleMatches.include = jobTitleIncludes;
  }

  const jobTitleExcludes = formatStringArr(userConfig?.jobTitleMatches?.exclude);
  if (jobTitleExcludes.length > 0) {
    config.jobTitleMatches.exclude = jobTitleExcludes;
  }

  config.jobTitleNotIncludeMsg = typeof userConfig?.jobTitleNotIncludeMsg === 'string'
    ? userConfig?.jobTitleNotIncludeMsg.trim()
    : config.jobTitleNotIncludeMsg;

  config.jobTitleExcludeMsg = typeof userConfig?.jobTitleExcludeMsg === 'string'
    ? userConfig?.jobTitleExcludeMsg.trim()
    : config.jobTitleExcludeMsg;

  const excludeCompanies = formatStringArr(userConfig?.excludeCompanies);
  if (excludeCompanies.length > 0) {
    config.excludeCompanies = excludeCompanies;
  }

  config.salaryNotInRangeMsg = typeof userConfig?.salaryNotInRangeMsg === 'string'
    ? userConfig?.salaryNotInRangeMsg.trim()
    : config.salaryNotInRangeMsg;

  config.excludeCompanyMsg = typeof userConfig?.excludeCompanyMsg === 'string'
    ? userConfig?.excludeCompanyMsg.trim()
    : config.excludeCompanyMsg;

  const salaryRange = userConfig?.salaryRange;
  if (Array.isArray(salaryRange)
    && salaryRange.length === 2
    && salaryRange.every((item) => !Number.isNaN(Number(item)))
    && salaryRange[0] <= salaryRange[1]
  ) {
    config.salaryRange = salaryRange.map((item) => Number(item));
  }

  const msgs = formatStringArr(userConfig?.msgs);
  if (msgs.length > 0) {
    config.msgs = msgs;
  }

  const sendBounds = userConfig?.sendBounds;
  if (Array.isArray(sendBounds)
    && sendBounds.length === 4
    && sendBounds.every((item) => !Number.isNaN(Number(item)))
  ) {
    config.sendBounds = sendBounds.map((item) => Number(item));
  }
  toast('读取配置成功');
}
catch {
  toast('读取配置失败，使用默认配置');
}

try {
  const path = files.join(files.cwd(), 'boss-auto-config-2.json');
  const additionalConfigStr = files.read(path, 'utf-8');
  const additionalConfig = JSON.parse(additionalConfigStr);

  const jobTitleIncludes = formatStringArr(additionalConfig?.jobTitleMatches?.include);
  if (jobTitleIncludes.length > 0) {
    config.jobTitleMatches.include.push(...jobTitleIncludes);
  }

  const jobTitleExcludes = formatStringArr(additionalConfig?.jobTitleMatches?.exclude);
  if (jobTitleExcludes.length > 0) {
    config.jobTitleMatches.exclude.push(...jobTitleExcludes);
  }

  const excludeCompanies = formatStringArr(additionalConfig?.excludeCompanies);
  if (excludeCompanies.length > 0) {
    config.excludeCompanies.push(...excludeCompanies);
  }

  const msgs = formatStringArr(additionalConfig?.msgs);
  if (msgs.length > 0) {
    config.msgs.push(...msgs);
  }
  toast('附加配置已添加');
}
catch { }

export default config;
