# Technical

## 1. 技术栈

- 游戏：Same Brain
- 类型：social
- 简述：AlterU 社交读心 · 每日一题关于「另一个你」，4 个图标 tap 选完，AI 把你的选择渲染成一幅 vision，并排撞上一个想到同款画面的陌生人 + Sync% 同步率，撞中即互推通知。双胞胎墙看陌生人们的同款脑洞。生图为核心 payoff。
- 框架 / 语言 / 构建：React, TypeScript, Vite, Less
- 渲染方式：Canvas/WebGL
- 依赖摘录：@types/react@^18.2.0, @types/react-dom@^18.2.0, @vitejs/plugin-react@^4.2.1, less@^4.2.0, react@^18.2.0, react-dom@^18.2.0, typescript@^5.3.3, vite@^5.1.0
- 平台元信息：meta.title=Same Brain；cover_url=/poster.png；category=social；uuid=272cf069-7f84-4d49-a4ac-b2785a2bc1fc

## 2. 目录结构

- `index.html`：Vite/浏览器入口，挂载根节点和基础 meta。
- `package.json`：定义 npm 脚本、依赖和工程名称。
- `vite.config.ts`：配置构建、插件和相对路径 base。
- `meta.json`：平台发布元信息，包含标题和封面。
- `src/App.tsx`：React 组件和交互界面。
- `src/main.tsx`：React 组件和交互界面。
- `src/index.less`：视觉样式、布局、动画和响应式规则。
- `src/shared.d.ts`：游戏源码模块。
- `src/vite-env.d.ts`：游戏源码模块。
- `src/game-id.ts`：游戏源码模块。
- `src/SameBrain/SameBrain.tsx`：React 组件和交互界面。
- `src/SameBrain/types.ts`：游戏源码模块。
- `src/SameBrain/SameBrain.less`：视觉样式、布局、动画和响应式规则。
- `src/SameBrain/utils/match.ts`：游戏源码模块。
- `src/SameBrain/utils/sample.ts`：游戏源码模块。
- `src/SameBrain/utils/cadence.ts`：游戏源码模块。
- `src/SameBrain/utils/frame.ts`：游戏源码模块。
- `src/SameBrain/utils/compose.ts`：游戏源码模块。

关键源码模块：

- `src/App.tsx`
- `src/main.tsx`
- `src/index.less`
- `src/shared.d.ts`
- `src/vite-env.d.ts`
- `src/game-id.ts`
- `src/SameBrain/SameBrain.tsx`
- `src/SameBrain/types.ts`
- `src/SameBrain/SameBrain.less`
- `src/SameBrain/utils/match.ts`
- `src/SameBrain/utils/sample.ts`
- `src/SameBrain/utils/cadence.ts`
- `src/SameBrain/utils/frame.ts`
- `src/SameBrain/utils/compose.ts`
- `src/SameBrain/hooks/useSameBrain.ts`
- `src/SameBrain/hooks/useWall.ts`
- `src/SameBrain/i18n/index.ts`
- `src/SameBrain/data/colors.ts`
- `src/SameBrain/data/seeds.ts`
- `src/SameBrain/data/prompts.ts`
- `src/SameBrain/assets/icons.tsx`
- `src/shared/runtime/useGameStats.ts`
- `src/shared/runtime/useUpload.ts`
- `src/shared/runtime/useChat.ts`

## 3. 核心模块

- 状态管理与节奏：通过 React 状态与定时器处理倒计时、阶段推进或生成节奏。
- 渲染方式：Canvas/WebGL，样式由 CSS/Less 和组件结构共同完成。
- 碰撞 / 更新：源码包含命中、距离、边界或重叠判断，结果会影响得分、生命或阶段。
- 音频：未发现独立音频模块，当前以视觉和文案反馈为主。
- 多语言：包含 i18n / locale 检测或 `t()` 文案函数。
- 存储：使用 localStorage、useGameSave 或 persist 保存分数、收藏、墙数据或本地状态。
- Aigram 运行时：接入 `@shared/runtime` 或平台桥接能力，用于用户、资料页、分享、通知或平台 API。
- AI / 生成接口：包含图像生成、视觉识别、ref_url 或 img2img 相关流程。
- 社交墙 / 归档：包含 wall、gallery、feed 或 archive 数据流与浏览界面。

## 4. 扩展点

- 改玩法参数：优先查找 `src/` 内大写常量、hooks、主组件顶部配置或关卡数组。
- 换素材：替换 `public/`、`src/img/` 或源码 import 的图片/音频文件，并保持相对路径。
- 调视觉：修改主样式文件中的颜色、间距、动画时长、网格尺寸和响应式规则。
- 改文案：修改 i18n 字典、组件内标题按钮文案，保持 zh/en 同步。
- 加平台能力：在已有 `@shared/runtime`、useGameSave、排行榜、墙或通知调用附近扩展，避免另起一套存储。
