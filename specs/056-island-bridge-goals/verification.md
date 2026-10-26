# 056 验证记录

2026-10-24，main。保留053–055工作，本次未提交或推送。

## 实现

9道小岛连桥用明确的“要N座桥”及N个可数桥图格表达目标。当前桥数填入格子，缺少的空着，超额桥另列为红色图格，并显示“还差N座/刚好/多N座”。不再把裸目标数字与“已连X”叠在岛上。一座桥同时填两端小格的规则有独立小图；点选岛会朗读该岛具体要求。

图格只表达数量，不指示答案方向。原graph、degree、fixed/max、答案、ID、revision与进度不变。9题仅instruction/clues/hints/success更新；其他1101题不变。原节点位置、桥段几何、双桥循环、两次点岛搭桥、undo/clear保留。过量仍可尝试和调整；本岛“刚好”不代替全图连通/交叉判分。route分支保留自己的表现和操作。

## 自动检查

- 130/130相关回归通过，见verification/tests.log。其中新增8项岛模型/SSR回归、3项语音缓存回归，另包含已有桥、route、视觉、课程边界、053–055和媒体质量回归。
- 全1110题经精确声明文字还原后与本轮起点hash一致；篡改graph不会被还原掩盖，未知文案被拒绝。历史冻结JSON未改。
- 每个固定/单/双桥精确计入两端，数量目标、缺少、匹配、超额及移除都可表示。自定义“每岛数目匹配但不连通”与交叉图仍判错；没有把目标图格作为新评分器。
- 实际SSR验证目标图格数量、已填/空/超额分类，并确认route不出现岛目标控件。
- pnpm build通过，仍有既有大于500kB主包提示；audit:curriculum：115组/1110题，0问题；audit:voice-media：4259/4259，0问题；git diff --check通过。

## 本地语音与缓存修复

标准Edge Xiaoxiao脚本/manifest共4259条，文本逐条匹配，failures为空，没有macOS say或mixed local。九题的主提示与每岛目标都存在本地文件，见verification/audio-alignment.json。

验证时发现：ID按文本前80字符生成，长提示后半句改变时ID可能不变；旧生成器只检查媒体时长，会把旧音频当作新文本的缓存。已改为同时核对旧manifest原文本、实际发音文本、locale、voice/rate/pitch和src。未知输入来源不复用。这个检查独立于媒体完整性。

定向重生成了本次确认受影响的6条主提示：4岛录音从约26.7秒变为34.4秒，6岛从约31.1秒变为38.7秒，SHA均改变，补入了收回新桥/保留现成桥的说明。见verification/voice-cache-repair.json；这不是对其他历史语音逐字听审的声明。移除了4条已被替代的旧语音及1条本轮中间版本，见voice-prune.json。

使用复用的真实Audio诊断页面，主提示、A岛目标和图示说明都到达ended，无TTS回退；见verification/browser-audio-ended.json。覆盖的是播放和媒体来源，非人工声卡输出转录。

## 浏览器

独立5307 origin，原生用户进度不受影响。

- 全部9题先提交超额错误状态，再调整为原答案并提交，全部正确；每岛都与实际桥数一致。
- 复现用户截图的A4/B3/C2/D3状态后，A与D显示“多1座”和单独红色多余桥格；B、C显示“刚好”。
- 单次加桥更新两个端点，撤销同时恢复；清空保留现成桥。
- 最大超额（6座、目标2）仍完整显示4个额外桥格；没有越出岛按钮，见extra-layout.json。
- 375×812页面宽375；六岛地图宽460、可单独横向滚动，岛按钮宽112。两次点岛搭桥及Enter搭桥有效，点A岛命中具体目标本地语音。
- 公共主按钮保持rgb(65,125,95)。目标数字带单位和用途，不再显示“已连”叠加。

证据：browser-cases.json、same-scenario.png、desktop-start.png、six-islands-start.png、maximum-extra.png、mobile-left.png、mobile-right.png、mobile-keyboard-node-voice.json。

## Mac交付与待办

pnpm mac:install成功，安装与构建可执行文件SHA相同，严格深度签名通过，详见verification/installation.json及mac-install.log。

本轮原生工具仍报告Mac锁屏，已有手动解锁请求尚未完成。安装文件包含053–056修改，但当前原生进程尚未确认重启并载入新版。原生代表检查不计为完成；056及054/055一并列入TODO P0。解锁后先记录最新用户位置/未提交状态，再重启应用检查，不以旧快照覆盖期间用户的新活动，不提交答案制造完成记录。

## 流程与限制

spec/plan/research/data-model/UI契约/quickstart和任务齐全。setup-plan/setup-tasks已运行，当前无扩展钩子；仓库没有update-agent-context脚本，AGENTS保持。没有新增委派或更改框架主题。实际儿童是否能理解数量图格、双端计数和局部“刚好”仍待亲子观察，已列入TODO。


## 2026-10-25 原生补验收完成

此前锁屏阻塞已解除。已在安装SHA `e9379c78c9c614c26e4763a1c5c78b212cd889b623886f96171932e659c45bd2` 的真实应用确认新版界面，执行：第1题单/双桥与两端配额；A、D超额1，B、C刚好；撤销、清空保留现成桥；第7题六岛显示。保存对应native截图及AX记录，见verification/native-acceptance.json。未提交答案、未使用提示，本组完成数前后均为1/9。各被访问题组题号已恢复，最终回到接续检查时的探索/生活实验室/用品放对地方第9题。本文此前的待解锁状态为历史记录，当前状态以本节为准。
