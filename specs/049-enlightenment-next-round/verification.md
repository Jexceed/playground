# 049 修复与验收

2026-10-20；main 基线 `e20c6447`。以下为本轮提交前完成的实现与安装验收记录。

## 原因

`ProgressiveSetGame` 在检查当前题号前先检查历史 `allRoundsComplete`。已完成的题组无论重玩到哪题都显示“完成关卡”；点击只调用 `App.completeGame` 记进度和朗读，随后 return；第二次又被 `completedOnce` 拦住。

安装前真实 Mac 应用在“同类小侦探”第1/12题、12/12已做时复现，点击“完成关卡”后AX树和题号不变。用户截图的搭桥第2/8题属于同一共享分支。

## 改动

- 当前不是末题：按题序前进，与历史做过多少无关。
- 末题有漏题：前往第一道未完成题。补完中间漏题后仍可顺序继续。
- 末题且整组完成：有同主题下一组时显示“下一组”，从下一组第1题开始；下一组按完整目录计算，搜索筛选不影响它。普通手动选择题组仍保留各组续玩位置。
- 当前主题最后一组：点击“完成关卡”后显示既有完成提示和“再玩一遍”；重玩回第1题。显式跳题清除局部完成状态。
- 不改题目、答案、图片、语音内容和持久化schema；去重完成记录保持原逻辑。探索组件未改。

## 自动验证

- `pnpm test:enlightenment`：21/21通过，新增7项回归。遍历40组中全部非末题在零/部分/全部历史记录下的顺序推进，以及每组末题对每一种单个漏题的回跳；覆盖单题组、补完中间题、主题末组、跨部分拒绝和完成记录去重。
- `node --test scripts/curriculum-navigation.test.mjs scripts/round-speech-navigation.test.mjs scripts/bridge-play.test.mjs scripts/activity-progress.test.mjs`：24/24通过。
- `pnpm build`：通过；保留现有大于500kB的包体警告。
- `pnpm audit:curriculum`：115组/1110项，其中启蒙40组/489题，0问题。
- `pnpm export:voice-lines`：4210条，与原脚本逐字段一致（忽略导出时间；已还原时间字段避免无内容差异）。manifest的ID/text/spokenText及本地文件逐条核对通过，failures为空，Edge Xiaoxiao，无 macOS say 或 mixed local。[语音结果](verification/voice-alignment.json)。
- 首次 pnpm 启动触发运行环境的自动依赖复核并遭遇网络重试；后续在现有依赖上用 `pnpm_config_verify_deps_before_run=false` 运行命令。依赖清单和锁文件未改，package.json仅增加测试入口。

## 浏览器实际交互

隔离地址127.0.0.1:5297，专用[测试数据页](verification/fixture.html)只写该origin的测试数据。实际操作覆盖：

1. 桥第2题、8/8已做：完成后显示下一题，进入第3题；木板空置、提交等待操作。
2. 桥末题：下一组进入同类小侦探第1题，即使列表搜索“桥”且该组曾保存末题。
3. 桥只缺第2题：末题按钮回第2题；补齐后8/8已做仍进入第3题。
4. 刷新后恢复桥第3题。
5. 逻辑主题末组路线第10题：完成提示与重玩按钮可见，重玩返回第1题。
6. 记忆题下一题重新展示图卡并要求遮住再答；计时观察题第11→12题停在准备状态，不自动开始计时。
7. 普通选择题答错后保留反馈，不出现下一题按钮。

[浏览器记录](verification/browser-cases.json)。浏览器控制台无错误。没有把这些代表题操作计为489题全部UI验收。

## 真实 Mac 应用

`pnpm mac:install`成功，更新 `/Applications/小小思考屋.app` 并退出重开；[安装日志](verification/mac-install.log)。strict/deep签名验证通过，安装与构建二进制SHA-256均为：

`57859e1d5ed22085665272b0a911e3bbd74888a1bb5f6a9874f137662b8af313`

原生实际操作：

- 同类小侦探第1→2题：[记录](verification/native-choice-next.txt)。
- 桥第2题答对后的[下一题画面](verification/native-bridge-next.png)，点击到第3题：[记录](verification/native-bridge-round3.txt)。
- 桥第8题答对后进入同类小侦探第1题：[记录](verification/native-next-group.txt)。
- 路线第10题完成后有[完成反馈](verification/native-completed.txt)，点击[重玩回第1题](verification/native-replay.txt)。
- 仅重玩原本已完成的题，开始/结束均274/489；恢复同类小侦探第1题、桥第2题和路线第1题的续玩位置。[最终状态](verification/native-restored.txt)。

原生没有改写孩子的完成数据来制造漏题，漏题和零历史条件由隔离浏览器/自动回归覆盖。真实儿童理解仍保留在TODO。
