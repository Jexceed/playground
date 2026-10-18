# 044 验证记录

日期：2026-10-18。基线：dev `c6c72277`。工作区：`/Users/chiang/.codex/worktrees/curriculum-benchmark/playground`。

## 原因与改动边界

`940271cb` 从 `makeOrderRounds` 删除24个场景引用，包含喝水题原先借用的洗手/点心场景；图片文件未删除。清理避免了部分矛盾图，但也使生活流程题失去了初始情境。完整撤除清单见 [removed-order-scenes.json](verification/removed-order-scenes.json)。

本次修复第1、9、18题。补充两种准确初始情境及六张动作图；进入任务前先看场景，任务中可以回看。答对才填补缺口并逐步演示；支持暂停、前后单步、点卡查看/读音与重播。播放按每步2.4秒推进，最后停止；切题、重置、回看和窗口失焦停止旧播放。减少动态偏好下不自动播放，保留逐步查看。

独立冻结快照 [baseline.json](verification/baseline.json) 与 `scripts/drinking-sequence.test.mjs` 证明只有三个题目的 instruction/sceneImage/sequenceStory 改变；ID、顺序数组、选项、答案、成功/重试/家长文本以及其他启蒙题和全部探索内容不变。043历史基线未重写，只在持续不变性测试中登记044的三个明确字段范围。

## 图片与语音

- 运行场景：`public/images/scenes/drinking-thirsty.png`、`drinking-empty-cup.png`（1200×675）。
- 运行图卡：`public/images/items/drinking-thirsty.png`、`drinking-take-cup.png`、`drinking-pour.png`、`drinking-drink.png`、`drinking-another-cup.png`、`drinking-carry-empty.png`（600×600）。全部注册并有实际渲染用途。
- 使用内置 image_gen；原图在同类 source 目录。完整提示：[场景与四动作](../../public/images/scenes/source/drinking-044-generation.json)、[两幅干扰选项](../../public/images/items/source/drinking-distractors-prompt.txt)。源图/运行图SHA：[image-assets.json](verification/image-assets.json)。
- 重导出并增量生成3条题干音频。4055条export/manifest逐ID与文字匹配，missing/extra/mismatch/failures均为空。中文Edge Xiaoxiao（-12%、+2Hz），英语沿用Jenny；无macOS say或mixed local。[完整性记录](verification/voice-integrity.json)。旧音频文件保留，运行manifest只引用当前内容。

## 自动检查

- `pnpm build`通过；最终`pnpm mac:install`再次执行生产构建。[构建日志](verification/build.log)、[最终安装日志](verification/mac-install-final.log)。
- `pnpm audit:curriculum`：115组1110项，0问题。[日志](verification/curriculum.log)。
- 46项回归通过：新喝水图文/填空/不变性、043边界与启蒙题、040质量、导航及题目语音切换。[日志](verification/regressions.log)。
- `pnpm audit:voice-media`：4055文件全部通过。[日志](verification/voice-audit.log)。
- 最终安装/构建可执行文件SHA-256相同，strict deep签名验证通过。[安装身份](verification/installed-app-final.json)。

## 浏览器交互

使用独立地址 `127.0.0.1:5295`，与用户原生进度隔离。1280×788：三题的初始场景、任务、错误、正确、填图、自动推进至最后、重播、暂停、手动下一步、回看保留完成态、切题与从头来均实际操作。第1题选“直接喝水”保持缺口；选择“先拿杯子”后缺口消失并出现拿杯图；第9、18题填“先倒水”。第18题最终三选项图均为64×64，没有破图、横向或纵向页面溢出。第一次成功页多1px高度，后将演示图174px调为160px，最终安装版全部操作与反馈可见。

390×844检查场景/任务可以进入，页面宽度390无横向溢出；沿用移动端纵向滚动布局，不声称移动端一屏完整。浏览器测试进度只增加到3/489。

## 真实 Mac 应用

真实Applications应用在1280×820窗口验收，截图2560×1640。期间用户仍在使用应用，征得暂停后因锁屏一度受阻；用户解锁后继续，以解锁时“先做什么”第2题作为恢复位置。未清空记录或操作未完成的探索盘面。

- 初始场景完整，人物/空杯/水壶和开始按钮清楚；[最终场景](verification/native-scene-final.png)。
- 第1题答对填图，自动播放至喝水、重播、暂停、手动前进均成功；回看再返回保留完成态。[最终演示](verification/native-solved-final.png)、[暂停第2步](verification/native-paused-step2.png)。
- 第9、18题分别展示已拿空杯的初始状态和正确缺口。原生复查发现旧干扰选项图标后新增两张语义准确的动作图，重新构建安装；[第18题最终图卡](verification/native-task18-final.png)、[成功](verification/native-solved18-final.png)。
- 退出/重开恢复第18题；最终完成检查后返回用户解锁时的第2题。启蒙完成数始终273/489，先做什么仍24/24。[恢复状态](verification/native-final-restored.txt)。

## 尚未覆盖

其余21道先做什么题的初始情境仍待逐题审定和补图，已登记TODO。本次不是全部24题恢复或全部1110项原生验收。减少动态分支经代码核查，未改用户OS偏好进行现场切换。未做儿童试玩或全语音人工听辨。未推送或发布NAS/远端。
