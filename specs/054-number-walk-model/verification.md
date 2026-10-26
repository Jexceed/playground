# 054 验证记录

2026-10-24，main。保留已有053语音修复，未提交或推送。

## 实现范围

全部9道“两位朋友走格子”增加结构化numberWalk模型；起点、带方向的步长、次数均来自原题参数，模型没有终点字段。复用已注册的兔子和狗狗PNG，通过红蓝底座、方向跳格小示意、成对足印表达规则。角色位置来自孩子的orderedPlacement双槽响应；起始显示角色但答案仍为空。

选择朋友后点数字格或拖角色到数字格；同格时两位朋友分行显示。共享撤销、清空、判分和完成锁定不变。原静态数字条、三段小字和重复牌库由该模型替代。全局框架和绿色提交按钮保持原样。

9题仅instruction和presentation变更，变更记录为content-changes.json；1101道其他题数据保持一致，全部ID、revision、答案、选项顺序和进度结构不变。旧历史快照不改，严格核对新字段后仅在历史测试中逆转这两类已声明变更。

## 自动验证

- 104/104相关回归通过，见verification/tests.log。包括11项新number-walk回归及053语音、翻牌、图片审查、旧课程边界、桥/连线与呈现回归。
- 新回归验证9题模型与原答案、全量题库边界、初态不代答、所有数字可放、错误/正确、同格、undo/clear和完成锁定；真实组件SSR覆盖每题12格、同格角色和disabled；语音先读规则且不泄露终点。
- pnpm build通过（保留既有大于500kB主包提示）。audit:curriculum：115组/1110题、0问题。
- 标准Edge语音导出/生成后4224条完全对齐，9条新提示、9条本轮旧提示移除。audit:voice-media：4224/4224、0问题；failures为空，无macOS say或mixed local。见verification/audio-model-alignment.json及voice-prune.json。
- git diff --check通过。

## 浏览器实际检查

独立5305 origin，不改原生完成记录。

- 九题各执行错误放置/提交，再按原答案放置/提交，全部正确；图片无破损、页面无横向溢出。见verification/browser-cases.json。
- 第1题同格6/6时两位角色清楚可见；撤销回到红6、蓝未填；清空回到初始1/9且答案?/?。
- 拖红色角色从1到3成功；键盘选择蓝色并放到7成功。见verification/interaction-boundaries.json。
- 375×812：页面宽375，棋盘自身可横滚，数字格46×48px；选择蓝色滚到其当前位置，左右两端均可操作，最终可放5/1。见verification/mobile.json及截图。
- 紧凑桌面布局保留完整按钮；1280×820时主提交按钮底部约774px。仅压缩模型内部留白，没有覆盖公共按钮样式。
- 规则小喇叭命中对应本地clue音频；完整主提示与三个规则音频均由导出/manifest逐一核对。本轮没有把资源检查称为全量人工听审。

## Mac安装

pnpm mac:install成功；构建和安装二进制SHA一致，strict/deep签名通过：

a286ed27f3fca39dcc4f5914e84c6c4ce0c70811b1f1fd0f3a8e69e4271f9a43

安装记录verification/installation.json及mac-install.log。重新打开后Mac锁屏，原生代表操作和位置恢复暂待手动解锁；已发出解锁请求，不以浏览器验证替代原生签收。

安装前位置：探索/逻辑屋/小岛连桥第1题，1/9已做，未提交桥数A–B2、B–C1、C–D1、D–A2。记录在verification/native-before.txt。恢复时不提交答案或使用提示。

## 流程

正式spec/plan/research/data-model/UI契约/quickstart与7项任务已建立。setup-plan/setup-tasks执行成功，无扩展钩子；update-agent-context脚本在仓库不存在，保留现有AGENTS。组件实现与独立回归分别由子代理完成，父代理负责整合、视觉复看、语音和交付。

实际儿童试玩仍需观察规则小图和双足印是否能被理解；技术通过不替代年龄校准，已写入TODO。


## 2026-10-25 原生补验收完成

此前锁屏阻塞已解除。已在安装SHA `e9379c78c9c614c26e4763a1c5c78b212cd889b623886f96171932e659c45bd2` 的真实应用确认新版界面，执行：第1题双角色同格6；撤销蓝色、清空恢复起点1和9；第7题双步长显示。保存对应native截图及AX记录，见verification/native-acceptance.json。未提交答案、未使用提示，本组完成数前后均为0/9。各被访问题组题号已恢复，最终回到接续检查时的探索/生活实验室/用品放对地方第9题。本文此前的待解锁状态为历史记录，当前状态以本节为准。
