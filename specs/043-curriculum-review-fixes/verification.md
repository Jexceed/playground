# 043 修正与安装验收

日期：2026-10-11。基线：dev `d8dcbf2c`。工作区：`/Users/chiang/.codex/worktrees/curriculum-benchmark/playground`。

## 交付范围

- 启蒙34题、探索50项发生本次授权修改；其余题目逐项深度相等。仍为40组489题与75组621项。
- 启蒙矩阵双图候选、逆时针题面、分类干扰、整理目标/混放结果、桌面过河目标、相关流程干扰和缺失图卡措辞已修正。分类9–11的答案使用本地图卡与中文名称，避免图片旁再重复一个emoji。
- 探索的square、白黄翻面规则、横竖斜夹子规则、前/右侧/俯视图箭头、前后反馈、日历起算、空白卡、故事语序及地图材料均已修正。
- L09全9项及L11/G16第7–9、E07第4–6共18项revision升为2；ID、答案合同及旧历史保留。表示/释义小修正不提升revision。
- 三张内置image-gen生成图已落地并实际使用：播种、开盒、关盒。E01另有8张代码生成的词义比较图。当前18资源组74图卡均有可渲染引用，无未使用注册卡。
- 生成提示与来源：[generation.json](../../public/images/items/exploration-art/source/review-043-generation.json)；运行图/源图及哈希：[image-assets.json](verification/image-assets.json)。原种植图集及源图字节不变，只替换逻辑第2帧。

## 自动验证

- `pnpm build` 与 `pnpm mac:install` 的实际构建通过；标准Applications安装完成，安装与构建的可执行文件SHA一致，strict deep codesign验证通过。最终身份见 [installed-app.json](verification/installed-app.json)。
- `pnpm audit:curriculum`：115组1110项，0问题；[日志](verification/curriculum-final.log)。
- `pnpm audit:illustrations`：18组74卡，全部使用，0问题；[日志](verification/illustrations-final.log)。
- 启蒙、探索、活动框架、进度、导航、语音、媒体、清理等相关回归121/121通过；[日志](verification/regressions-121.log)。其后的原生文字压缩和中文标签修正另跑17项针对回归，全部通过；[最终日志](verification/final-regressions-17.log)。
- 独立不变性测试使用编辑前快照和明确题号/字段范围，不以重写旧基线消除失败。原种植图片、题目身份、答案合同及历史保留有独立断言。见 [独立复审](independent-review.md)。
- 语音最终4055条，export/manifest对齐、failures=[]，全部媒体检查通过。中文Edge Xiaoxiao（-12%、+2Hz），英语沿用Jenny；无macOS say或mixed local。仅清理manifest不再引用的旧课程媒体。
- 初次使用worktree相对Python路径遇到ENOENT；保留失败日志后，使用主项目已安装的Edge虚拟环境绝对路径成功完成。没有切换到macOS临时声音。

## 浏览器与真实Mac应用

浏览器使用独立测试origin `127.0.0.1:5294`；用户的原生进度不用于提交测试答案。浏览器矩阵第6题分别提交错误与正确候选，提示/判定相符，跳到最后一题不伪造整组完成。播种图实际进入排序候选；开/关图可独立放大。

真实Applications应用在1280×820窗口（2560×1640 Retina截图）检查：

| 场景 | 结果/证据 |
|---|---|
| E01第1题，新开关图卡 | 两侧图片与中文标签清楚；放大/返回不误选，已连仍0/2。`native-antonyms.png` |
| E07第4题 | 本地听力经历播放→响应，三选项均为真正正方形。`native-square-4.png` |
| G16第7题 | 前/右侧/俯视箭头一致，候选完整。初版两条长说明使最下方统计越界，压缩为一句后重新生成语音/安装，完整题面和底部控件可见。`native-views-7-final.png`是通过版本，`native-views-7.png`保留初始问题。 |
| L11第8题 | 横竖斜规则在作答前可见，棋盘、六候选和按钮完整。`native-board-8.png` |
| L09第9题 | 白黄两面规则与三次操作同时可见，格位、托盘与提交可达。`native-toggle-9.png` |
| L06第7题 | 四个事件、强化播种帧及放大/返回可用；原有9/9完成事实仍显示。`native-sowing-7.png` |
| 启蒙矩阵第6题 | 所有选项统一双图，无唯一区别性插图。`native-matrix-6.png` |
| 分类机第9题 | 红圆/红方/蓝圆均可辨；最终去除答案旁重复emoji，保留中文名称。`native-sorter-9-final.png` |
| 错了怎么改第6题 | 分类目标与混放结果一致，三个候选可见。`native-sort-goal-6.png` |
| 转一转方向第5题 | 逆时针序列没有顺时针场景干扰。`native-counterclockwise-5.png` |

应用退出/重启后恢复原来的探索→生活实验室→用品放对地方第1题。安装前后探索累计均为75/621；启蒙显示273/489。本轮原生不提交评分答案、不清空记录；临时查看过的题组恢复到进入时题号。`native-before.txt`、`native-restored.txt`、`native-final-restored.txt`与`native-actions.json`保存状态及操作证据。

## 验收边界

本次为源码、独立规则、资源完整性、浏览器提交及上述真实Mac代表题面的验收。没有声称1110项本轮全部原生作答、全语音人工听辨、儿童适龄试玩或其他设备验收完成；这些范围保留在TODO。未推送、未发布NAS或远端。
