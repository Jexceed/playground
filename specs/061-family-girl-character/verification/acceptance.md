# 061 验收记录

日期：2026-10-29 完成图片和工程验证，2026-10-30 凌晨完成原生窗口目检（Asia/Singapore）。分支：main；本次未提交或推送。

## 接续时的实际状态

六幅运行时 PNG 的 SHA-256 全部与 `/tmp/playground-girl-061-baseline/` 中的修改前备份相同，均仍为小男孩。已有规格、计划、提示词，以及中文代词调整和相应语音；原任务清单只勾选了 T001。本次接续完成图片替换和其余验收，未将已有文案工作计为本次新写。

## 图片与内容

- 使用内置 image_gen，以 `public/images/brand/thinking-house-brand-v3.png` 为身份参考，逐幅编辑原场景。六图均已逐张目检：高马尾、齐刘海、粉色发圈、米白上衣、粉色背带装；求助图保留青绿外套。
- 运行时图均保存为 1200×675 PNG；原 060 源图、新 061 源图、精确提示词和哈希均保存在 `public/images/scenes/source/`。来源与处理记录见 `family-girl-061-manifest.json`。
- 逐场景检查：早晨的日出、早餐和双方挥手；告别的书包、老师及来接的家长；小熊从粉色主角递向蓝裙朋友；碰倒后的散落/倾斜积木及歉意；空杯和未倾倒的饮用水壶；敞开外套和未拉好的拉链。六张中的原男孩均已替换，两张有朋友的画面仍能区分角色。
- 相对于修改前的内容，3 组 12 项只有图片 alt、提示代词、重试句和一条家长提示发生变化；活动身份、答案、英文示范、操作步骤、观察项及难度配置保持一致。详见 `content-compatibility.json`。

## 工程验证

| 检查 | 结果 |
|---|---|
| `node --test scripts/everyday-english.test.mjs scripts/activity-language.test.mjs scripts/speech.test.mjs` | 17/17 通过 |
| `pnpm build` | 通过；仍有既有主包超过 500 kB 的提示 |
| `pnpm audit:curriculum` | 118 组 / 1122 项，0 问题 |
| `pnpm audit:voice-media` | 4397 文件，0 问题 |
| `pnpm export:voice-lines` 与标准 Edge 生成流程 | 4397 条脚本与 manifest 的 ID、文本、语言一一对应；文件全部存在；failures=[] |
| 语音提供者 | 中文 Xiaoxiao、英文 Jenny；没有 macOS say + afconvert 或 mixed local |

首次课程审计找出 7 条不再引用的旧男性代词音频。逐条确认它们属于修改前的 manifest 且已被新脚本取代后，移动到 `.tmp/family-girl-061-superseded-voice/` 保留恢复副本，再次审计通过。记录见 `superseded-voices.json`；没有清理其他历史文件。

## Mac 安装与实际窗口

- `pnpm mac:install` 成功，已更新 `/Applications/小小思考屋.app`。安装流程再次执行最终 TypeScript/Vite 构建，移出旧语音后的资源进入新包。
- 安装产物通过 `codesign --verify --deep --strict --verbose=2`，二进制 SHA-256 与本次构建产物一致；详见 `native-install.json`。这是本机 ad-hoc 签名安装，没有 Apple 公证或对外发布。
- 关闭旧进程后打开新应用，看到启动页并正常进入 `tauri://localhost` 的真实窗口。原“词语有朋友”的 1/9 已做状态和原“英语听一听”的已做标记仍在。
- 在 探索 → 语言花园 → 英语日常说，进入三个题组并分别查看第 1、3 题。六张图片均实际显示为新女孩，与更新后的可访问描述一致，没有残留旧男孩或失效图；布局中的题干和选项完整可见。
- 拉链求助图的放大查看与关闭正常。早晨和求助的亲子对话页显示相同的新图及中英示范、逐句听英语按钮、操作步骤。亲子观察没有被代填；三个英语题组仍显示 0/4 已做。
- 在实际窗口触发 `Good morning.`、`Can you help me, please?`、`Of course.` 的示范播放按钮，页面可继续操作。此处确认播放入口可触发；本次工具没有采集扬声器音频，因此不声称已听音签收发音、音量或音色。文件完整性及播放路由另由媒体审计和相关测试覆盖，人耳听音保留在 TODO。
- 原生图像检查使用 cua_repl 的实际窗口截图逐张目检，截图展示在本次会话工具记录中；没有用浏览器截图替代原生窗口。

## 验证边界

图片成人目检和技术检查不代表儿童已理解。真实亲子试玩、日常英语长句的支持强度校准，以及 059 其余内容审查继续按 TODO 保留。没有替孩子填写亲子观察，也没有新增进度迁移。
