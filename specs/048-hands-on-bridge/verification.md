# 048 动手搭桥验收

基线dev `965bdb38`。针对用户指出桥怎么搭交互薄弱、主图和选项小，将全部8题改为专用大画面操作。

## 完成行为
- 第1题点击两个场景端点量距离；两岸顺序不限，小熊/木板/旗子仍可试选。再次选择或重新量可修改，不通过缩略图片选择。
- 第2–8题先选木板再点河段试放。点击已放木板可拿回；替换归还旧板；同一物理板不能占两处，两块相同长度板各有身份。失败保留摆放并明确哪边还差几格。
- 河、已放板和材料区统一56单位一格；木板不会为了填满河段被拉长。正确判定检查每段和独立材料身份，不依赖历史答案选项判断摆法。第5题两种合法分配都能通过，不额外添加必须长一格的限制。
- 成功后小熊从近岸移动到对岸，可再走一遍；再搭一次只清当前题。重播不写新完成记录，切题卸载本地状态。减弱动态媒体规则直接显示到达位置，未更改用户OS设置。
- 仅8题的题干/指令/反馈/家长提示/难度说明改变，记录见[content-changes.json](content-changes.json)。保留原ID、答案value、选项顺序、模型长度和支点。原静态PNG和旧工具留作历史兼容资源，主操作不再展示缩略选项或放大弹窗。没有新增生成图片，复用本地小熊与现有精确图形体系。

## 验证
- 最终81项回归通过：[regressions-final.log](verification/regressions-final.log)。新增测试覆盖8题数据边界、所有端点组合、每道搭建题所有物理分配、同长板身份、移动/替换、缺口、语音覆盖。较旧快照保持原值，先断言048精确文案再按登记字段还原，供047/046及更旧边界测试比较。
- 生产构建、课程审计（115组1110项）、图库审计、语音媒体审计通过。初次难度说明未命中审计的推理描述词，改成明确“逐段比较长度和支点”，未放宽审计规则。
- 本地语音4210条，脚本/manifest对应，failures空、媒体0问题；中文仍为Edge Xiaoxiao -12%/+2Hz，无macOS或mixed local兜底。新操作名称和有限状态反馈全部导出。仅移除18个不再被manifest引用的旧媒体，见[voice-pruned.json](verification/voice-pruned.json)。

## 浏览器实际操作
在隔离端口5296完成全部8题的任务/错误/正确状态，并检查清空、拿回、物理板移动、替换、两种第5题解法和动画中切题，共31个记录（包含1280×788核心检查及1512×839较宽窗口）。没有旧缩略选项、断图、越界或小于44px的操作目标；实际DOM测得木板/河面每格尺度一致。[browser-states.json](verification/browser-states.json)。

第一题还使用Enter键选择端点。初次操作发现全局button:hover会覆盖定位transform，造成端点在指针下移动；已为场景控件固定定位，之后真实点击与键盘检查通过。过河动画核对了起点与终点：小熊由x358.08移到x860.40，超过右岸x810.31；不把点击成功本身当作动画完成。[interaction-edges.json](verification/interaction-edges.json)。

浏览器操作检查后，最终原生截图复核发现居中放板会在小岛处遮住彼此格线，已改成有效摆法在小岛处对接，多余长度向外侧岸伸出；过长错误试放也限制在可见画布内。81项回归重新通过，并新增所有有效分配不遮挡、所有试放完整可见的几何断言。此后重新构建安装，在最终Mac版复查第1题画面及第2–8题全部正确摆法、额外过长错误试放、第5题另一解和到岸状态：[12个复验状态](verification/native-alignment-followup.json)。

## Mac真实安装版
执行 `pnpm mac:install`，真实.app已更新；构建与安装二进制SHA一致，strict deep签名通过：[installed-app.json](verification/installed-app.json)、[最终安装日志](verification/mac-install-final.log)。重开tauri://localhost后，8题全部做任务/错误/正确检查（24核心状态），另检查到岸/重播、第5题另一解、当前题清空、拿回，加恢复原页面共30状态：[native-states.json](verification/native-states.json)。原生toggle button按实际可访问名称操作；未使用浏览器结果冒充原生验收。

开始/结束完成数均274/489；全部桥题原本已做，没有新增孩子的题目完成数。最后恢复数字规律小路第1题。[恢复状态](verification/native-final-0-restored.txt)。代表截图：[量距离](verification/native-1-solved.png)、[短板缺口](verification/native-2-wrong.png)、[完整过河](verification/native-final-8-arrived.png)。

本轮验证真实UI操作和数学关系；儿童实际试玩、全语音人工听辨、启用OS减弱动态后的设备验收仍分别保留在TODO。提交推送仅针对用户已授权dev，交付时核对远端SHA与0/0。
