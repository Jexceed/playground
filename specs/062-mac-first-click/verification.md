# 062 修正与验证

2026-11-08，main 本地交付。运行时改动仅为 `src-tauri/tauri.conf.json` 的 `acceptFirstMouse: true`。

## 结论和边界

当前 Tauri 主窗口原先省略该选项，schema 默认 false；本地 Wry 源码的 `acceptsFirstMouse:` 直接返回该字段。这会让非活动 Mac 窗口的第一次点击只激活窗口，而不同时传给 WebView。本次安装产物明确启用该行为。

该原因是窗口级行为，适用于启蒙与探索。用户报告的所有间歇性重复点击尚未稳定复现，不能认定全部由这个设置造成。原先在活动窗口的代表题单击就能通过；自动化可能先把目标应用激活，所以切应用再点击的自动化通过不是一份独立的前后失败对照。

## 自动验证

| 命令 | 结果 |
| --- | --- |
| `pnpm build` | 通过；保留既有大于 500 kB 的产物提示 |
| `pnpm audit:curriculum` | 118 组 / 1122 题，0 问题；启蒙 40 / 489，探索 78 / 633 |
| `pnpm test:desktop-release` | 12 / 12 通过 |
| `pnpm test:exploration` | 32 / 32 通过 |
| `pnpm test:enlightenment` | 21 / 21 通过 |
| `node --test scripts/visible-activity-assets.test.mjs scripts/activity-framework.test.mjs scripts/round-speech-navigation.test.mjs` | 12 / 12 通过 |
| `pnpm audit:voice-media` | 4397 条，0 问题 |

共 77 项相关测试通过，没有运行与本次单个窗口设置无关的完整历史套件。没有新增只匹配配置字段的重复测试。

语音脚本与 manifest 的 4397 个 ID、原文、locale 和解码后的本地文件全部对齐，failures 为空；中文使用 Edge Xiaoxiao，英文使用 Jenny，无 macOS say / mixed local。[语音对齐结果](verification/voice-alignment.json)。题干等内容未变，因此不重新生成语音。

## Mac 安装

`pnpm mac:install` 成功执行原生构建、签名和复制，更新 `/Applications/小小思考屋.app`。退出旧进程后重新打开安装版完成以下检查。[安装日志](verification/mac-install.log)。

严格 deep 签名检查通过，安装和构建的可执行文件 SHA-256 一致：

`60a09592ec195da2f0b7f49183653525520e5b93cc5ff280592f1f58ce844d4e`

[安装产物校验](verification/installed-bundle.json)。

## 安装版实际操作

- 探索“规则收纳盒”第 6 题：坐标鼠标单击蓝色圆形后由 off 变 on，再单击一次变 off；没有双触发。
- 探索“数量结构屋”第 1 题：切应用操作后，用一次坐标鼠标点击选中“7”；单击“选好了，看看”进入正确反馈，仅记录 1 次尝试。
- 完成后单击其他答案，选中结果与尝试数均不变，禁用规则正常。
- 单击“再试一次”，答案恢复未选状态。
- 启蒙“先做什么”第 7 题：单击“开始排顺序”进入操作，单击“先分开两类”使检查按钮从禁用变为可用。
- 最终恢复到原来的启蒙“先做什么”第 7 题起始情境；探索返回其原来的“规则收纳盒”第 6 题续玩位置。只提交了一道原本已完成的探索题，未增加完成题数，启蒙仍 280 题，探索完成/观察条目仍 114。[进度核对](verification/progress-check.json)。

按钮未准备好或记忆阶段不可编辑、失焦中断记忆等规则继续由现有页面负责，相关自动回归通过。没有把这些代表操作等同于全部题目验收、实际儿童试玩或所有前台间歇性问题已解决；后续边界记录在 `docs/TODO.md`。
