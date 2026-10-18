# 045 全部24题验证

工作于2026-10-18至2026-10-19（Asia/Shanghai）。基线dev `39871af4`，工作区 `/Users/chiang/.codex/worktrees/curriculum-benchmark/playground`。

## 交付与范围

“先做什么”24题全部接入：先情境、再任务、回看、正确补图和顺序演示。题号1/9/18原有喝水图保留，其余21题补齐，未把第2题及后续题留为TODO。

- 新增16张1200×675初始场景、84张600×600动作卡；加上原喝水图，整组共18场景、90动作图，覆盖84个实际步骤位置与72个选项位置，缺失图片0。每张新注册动作卡都有真实题面引用。[覆盖统计](verification/coverage.json)、[逐题合同](verification/visual-contract.json)。
- 原ID、sequence、choices、answer、成功/重试/家长文案与全部其他启蒙/探索内容保持不变。三个喝水题的数据逐项不变，另外21题只改instruction/sceneImage/sequenceStory。新冻结快照[baseline.json](verification/baseline.json)与回归独立核对；043/044历史快照未改。
- 按题号解析图片，区分交通/模型桥的“走过去”、干净/脏手的“拿饼干”、分类/混装的“放进盒子”、未播种/已有干芽的“等开花”。成功态收起重复禁用选项，五步图卡长文字换行，保持图片大小。

## 绘图要求与来源

按用户指定，三个绘图代理均显式选用 **gpt-6.1-sol**，调用内置 **image_gen**。没有把该名称伪装成图像工具底层模型参数，也未以SVG/emoji绘画替代插图。

- [nature清单](art-nature.json)：门锁、小鱼、种植、模型桥，6场景/29动作卡。
- [daily清单](art-daily.json)：卫生点心、写字、书包、雨衣，5场景/26动作卡。
- [plans清单](art-plans.json)：搭塔、玩具分类、积木分类、交通，5场景/29动作卡。
- 运行图片在 `public/images/scenes/order-045-*.png` 与 `public/images/items/order-045-*.png`；32张源PNG及32份prompt/来源/裁切JSON保留在同类source目录。[逐文件SHA-256与路径](verification/image-assets.json)。
- 主代理复核了12组源图及重要独立修正：blocks.sort改为在桌面分堆、盒子空置；traffic.look修正手部与指灯动作；bridge.reachCarrot明确兔子够不到对岸；plant.drySprout新增可见干裂土。交通均有成人陪同，桥题均为桌面玩具模型。
- Atlas单格经裁切与规范尺寸处理，600×600是运行尺寸。metadata保留真实原始尺寸，没有宣称所有单格原生600分辨率。

## 自动验证

- `pnpm build`通过；最终`pnpm mac:install`重新生产构建并安装。[build.log](verification/build.log)、[mac-install.log](verification/mac-install.log)。
- 52项回归全部通过，包含整组视觉合同、图片存在/尺寸/引用、填空规则、字段边界、旧质量、导航和语音切题。[最终回归日志](verification/regressions-final.log)。
- `pnpm audit:curriculum`：115组1110项，0问题；[日志](verification/curriculum.log)。`audit:illustrations`也通过，原探索图集保留。[日志](verification/illustrations.log)。
- 4068条语音export/manifest逐ID和文字对齐，无缺失/多余/不匹配/failures；全部4068媒体检查通过。中文Edge Xiaoxiao，-12%、+2Hz；英语沿用Jenny；无macOS say/mixed local。[完整性](verification/voice-integrity.json)、[媒体审计](verification/voice-media.log)。
- 只清理manifest已不引用的24条旧“按图卡从左到右”题干mp3（包括044留下的3条旧文件），保留路径和SHA记录；旧Git提交仍可追溯。[清单](verification/retired-voices.json)。
- 初次独立测试暴露legacy导出将🟢规范为“绿灯”，补充同义映射后通过；初次课程审计发现上述音频残留，清理后通过。失败日志保留为`regressions-initial-failure.log`和`curriculum-before-prune.log`。

## 浏览器逐题交互

独立测试origin `127.0.0.1:5295`，1280×788窗口。24题各执行情境→开始→选择原正确答案→检查填图→暂停，共72状态。全部破图0、页面纵横溢出0、图卡文字越界0；每题作答前1个缺口、成功后0缺口且恰好填1个位置。[72状态数据](verification/browser-states.json)，对应`browser-<题号>-scene/task/solved.png`。

第2题另测错误推门（保留缺口）、正确选项回看后保留选择、成功手动第2步；模型桥重播自动推进至第4步胡萝卜后停止。[自动播放](verification/browser-autoplay.json)。最终reachCarrot修图后重载并重新检查第11题。

初次长题完成页超出22px；完成态收起重复选项后修正，保留`door-solved-initial.png`与`door-solved-layout-fixed.png`。390×844五步题也能操作、无破图/横向/文字溢出，沿用纵向滚动布局，不声称窄屏一屏完整。[窄屏数据](verification/mobile-layout.json)。

## 真实 Mac 应用

安装位置 `/Applications/小小思考屋.app`。安装与构建的可执行文件SHA相同，strict deep签名验证通过：[安装身份](verification/installed-app.json)。

用户同意暂停后，在1280×820窗口（2560×1640截图）实际执行全部24题的情境、任务、正确完成/暂停，合计72原生状态。每题都记录了完整中文步骤列表；原始待补按钮在成功后消失，播放器可用。所有24题操作中的启蒙完成数均保持273/489，题组仍24/24。没有清空记录。[原生状态数据](verification/native-states.json)，逐题截图`native-<题号>-scene/task/solved.png`。

用户截图里的第2题现有完整门锁情境：[场景](verification/native-2-scene.png)、[任务](verification/native-2-task.png)、[完成演示](verification/native-2-solved.png)。五步和长题样本：[第10题](verification/native-10-task.png)、[第19题完成](verification/native-19-solved.png)、[第24题](verification/native-24-task.png)。

检查中用户浏览了其他题组，自动点击暂停并获得再次暂停使用的确认后继续。原生自动检查器适配旧按钮名“放回水里”，并按步骤按钮而非整段题干检测“待补位置”，没有为通过测试改变题目。最终回到第2题场景，原有进度保留；[最终位置](verification/native-final-location.txt)。

## 验收边界

本轮完整覆盖“先做什么”24题，未声称其他题组的场景/动作资源都已重做或1110题全部原生验收。未进行儿童试玩、全语音人工听辨或现场切换OS减少动态偏好；这些与本次图片/交互完成范围分开记录。未推送或发布远端。
