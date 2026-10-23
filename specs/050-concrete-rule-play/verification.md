# 050 验证记录

2026-10-23；main，基线 adb18b90。改动保留在当前工作区，未提交或推送。

## 完成内容

两组共18题：规则机由纯数字箭头改成可操作的本地圆片例子，实际选项显示数量；翻牌由选色卡填空改成直接点击大牌，初始参考、按序操作的小图、独立示范、撤销和重来都可见。主要指令与控制放大，删除重复规则条，保留简短朗读。规则机在示范阶段只读示范，进入作答后朗读正式题，防止画面显示1个时提前听到正式题的2–4个。

现有圆片 PNG 已注册在 imageGallery；没有新增场景或图片生成流程。例子不自动解正式题；翻牌允许自由尝试，不强制正确步骤。

## 自动检查

- `node --test scripts/rule-play.test.mjs scripts/exploration-framework.test.mjs scripts/activity-framework.test.mjs scripts/activity-progress.test.mjs scripts/round-speech-navigation.test.mjs`：28/28通过。覆盖9道规则机、9道翻牌的正确/错误/重试，重复翻面、撤销、清空、再次练习、完成锁定、其他grid初始状态和阶段朗读。
- `pnpm build`：通过。最终构建记录来自最后一次 `pnpm mac:install` 的 beforeBuildCommand，见 [build.log](verification/build.log)。仍有原有的主包大于500kB提醒。
- `pnpm audit:curriculum`：115组/1110题，0问题。启蒙40组/489题，探索75组/621题。
- 对改动前纯数据快照逐字段比较：18题的ID、revision、token/排序和答案保持一致；其余579道正式探索题完全相同，[scope.json](verification/scope.json)。启蒙与pilot源文件未改。
- `pnpm export:voice-lines`、Edge Xiaoxiao生成、逐条ID/文本/spokenText/文件核对、`pnpm audit:voice-media`：4224条全部对齐，failures为空，没有macOS say或mixed local。[语音对齐](verification/voice-alignment.json)。初次课程审计发现52条被新文案替代的旧文件，核实均来自旧manifest后清理；最后还清理了本轮阶段朗读调整产生的9条中间音频。最终审计通过。
- `git diff --check`：通过。

## 浏览器交互

专用本地测试origin：127.0.0.1:5298，其进度与原生用户数据隔离。

- 1280×788：18题全部执行错误提交、正确提交和重试；规则机逐题确认示范数量、选项圆片数量与标签一致，重看例子后选择保留。翻牌按屏幕操作顺序执行，全部得到原答案。[逐题记录](verification/browser-cases.json)。
- 375×812：组合规则示范、四个数量选项和五张牌均无横向溢出。发现并修复五圆片托盘溢出；最终五张大牌约53×87px。[窄屏记录](verification/responsive.json)。
- 1024×768：五张牌操作台无溢出。键盘Enter可翻面，撤销还原，独立示例牌不改正式答案；控制台无error。[操作边界](verification/interaction-boundaries.json)。
- 减少动态效果由CSS分支关闭圆片/翻面动画；没有改动用户OS设置，未将此项称为原生系统偏好实测。

## 真实 Mac 应用

最终 `pnpm mac:install` 成功，更新并打开 `/Applications/小小思考屋.app`。构建和安装可执行文件SHA-256相同，strict/deep签名验证通过：[installation.json](verification/installation.json)。

- 翻牌第1/4/7题：直接翻面；第1题撤销，第4/7题重新翻，均回到对应原始牌面。
- 规则机第1/4/7题：添加圆片；第7题再摆一份显示10个；进入正式题、重看例子与回到正式题均正常。本地圆片在真实WebKit界面可见。
- 原生没有提交答案来制造孩子的完成记录；完整正确/错误判定在隔离浏览器与自动检查中验证。两个目标题组均保持0/9，规则机恢复第1题，最终回到原有翻牌第1题。[原生案例](verification/native-cases.json)、[恢复状态](verification/native-restored.txt)。
- 安装前旧界面和位置：[native-before.txt](verification/native-before.txt)。

实际效果：[规则机示范](verification/native-machine-demo.png)、[规则机作答](verification/native-machine.png)、[组合示范](verification/native-machine-combination.png)、[翻牌](verification/native-flip.png)、[组合翻牌](verification/native-flip-combination.png)。

## 仍需观察

亲子实际试玩后确认孩子是否能理解图示步骤、解释两次翻面及“再摆一份”。工程/成人UI检查不代表儿童理解已验证；完整人工听音审查也未包含在本轮媒体完整性检查内。这些观察已记录在TODO。
