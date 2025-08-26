## autojs-boss

一个基于 Auto.js 的自动化脚本项目，用于在 BOSS 直聘 App 中自动执行以下流程：
- 打开职位列表，筛选符合要求的职位
- 进入职位详情，判断是否符合预设条件
- 若符合，进入聊天界面，自动发送预设消息；否则左滑切换下一个职位
- 发送完成后返回职位详情并继续循环
- 支持退出后自动登录使用微信（若操作频繁，BOSS 直聘会强制退出登录）

### 功能与原理
- 通过 Auto.js 的无障碍/控件 API 与 ADB 能力控制 Android 设备，识别当前 `Activity` 并执行逻辑分支
- 依据预设规则过滤职位标题、公司、职位描述关键词与薪资范围
- 自动进入聊天界面并发送多条预设消息

### 技术栈
- 语言与构建：JavaScript（ESM）、Webpack、Babel
- 代码规范：ESLint（`@antfu/eslint-config`）
- 运行环境：Auto.js（Android 端脚本引擎）

项目主要文件：
- `src/main.js`：入口，调度状态机（职位列表 → 职位详情 → 聊天 → 返回）
- `src/auto/*`：具体页面自动化逻辑（`JobList`/`JobDetail`/`Chat`/`Login`）
- `src/config.js`：默认配置与用户配置覆盖逻辑
- `webpack.config.mjs`：打包配置（输出 `dist/index.js`，并注入 `auto.waitFor();` Banner）

## 开发与调试（开发者）

### 前置条件
- Node.js 18+（本地构建）
- Android 设备，安装 BOSS 直聘 App
- Auto.js（我使用的是 Autox.js v7）
- 已开启设备开发者模式与 USB 调试（如需使用 ADB）
- vscode 中安装 [Auto.js-Autox.js-VSCodeExt](https://marketplace.visualstudio.com/items?itemName=aaroncheng.auto-js-vsce-fixed)

### 安装依赖
```bash
npm i
```

### 本地开发（持续构建与 SourceMap）
```bash
npm run watch
# 产物：dist/index.js
```

### 生产打包
```bash
npm run build
# 产物：dist/index.js
```

构建时会在产物头部注入 `auto.waitFor();`，确保 Auto.js 在服务可用后再执行脚本。

### 在设备上调试脚本
1. `npm run watch`
2. 使用 Auto.js-Autox.js-VSCodeExt 连接手机调试


## 使用

1. 在电脑上执行构建 `npm run build`，得到 `dist/index.js`
2. 将脚本拷贝到手机并在 Auto.js 中运行
3. 首次运行可在项目根目录放置 `boss-auto-config.json`（可选），覆盖默认筛选与消息配置
4. 打开 BOSS 直聘，脚本会自动：
   - 在职位列表页筛选符合条件的职位
   - 进入职位详情判断是否符合条件
   - 符合则进入聊天界面发送消息；否则左滑切换职位

### 配置说明
默认配置位于 `src/config.js`，并支持在工作目录下用以下文件覆盖：
- `boss-auto-config.json`：覆盖默认配置
- `boss-auto-config-2.json`：在**默认/覆盖基础**上**追加**（如数组合并）

关键字段（示例）：
```json
{
  "jobTitleMatches": {
    "include": ["前端", "web"],
    "exclude": ["外包", "外派", "驻场"]
  },
  "excludeCompanies": ["外包公司A", "中介B"],
  "excludeJobDescriptionKeywords": ["英语", "unity"],
  "salaryRange": [25, 25],
  "salaryNotInRangeMsg": "薪资不在范围内",
  "msgs": [
    "您好，我对这份工作非常感兴趣，希望进一步沟通。",
    "我熟练掌握Vue/React，具备微前端与工程化经验。"
  ],
  "sendBounds": [959, 2235, 1036, 2312],
  "whileNotMatchLoadFullJobDescription": false,
  "whileNotMatchLoadFullJobDetail": false
}
```

说明：
- `jobTitleMatches.include/exclude`：职位标题包含/排除关键词
- `excludeCompanies`：排除公司名单
- `excludeJobDescriptionKeywords`：职位描述中的排除关键词
- `salaryRange`：单位为 K（月薪区间）。`[min, max]`
- `msgs`：进入聊天后依次发送的消息数组
- `sendBounds`：发送按钮的坐标区域 `[x1, y1, x2, y2]` (可以使用 Auto.js 的获取到发送按钮的坐标)
- `whileNotMatchLoadFullJobDescription / whileNotMatchLoadFullJobDetail`：是否在不匹配时继续加载完整信息再判断

## 常见问题
- 看不到控件/无法点击：检查无障碍/悬浮窗权限；不同分辨率设备可能需调整 `sendBounds`
- 未进入聊天页：可能因为筛选规则不匹配或聊天按钮控件未识别，可适当放宽筛选或补充关键词
- 自动化不触发：确认 BOSS 直聘包名与 Activity 未变更（`src/config.js` 中有默认值）
- 本项目是基于 Autox.js v7 开发的，其他版本未做适配
- Autox.js v7 文档: https://web.archive.org/web/20241130032000/http://doc.autoxjs.com/#/widgetsBasedAutomation?id=rect

## 许可证
本仓库仅用于技术交流与学习，请遵循目标 App 的使用条款与相关法律法规，勿用于商业用途或批量骚扰。
