# 051 美术重做验收

2026-10-23；在main现有050工作区上继续，保留此前内容和语音修改。本轮未提交或推送。

## 最终效果

- 使用内置image_gen分别生成规则机、浅木托盘、奶白云朵卡和金黄太阳卡4张透明PNG。原图及提示词保存在 `public/images/items/rule-play/source/`，运行时副本只等比例缩小，保留透明通道；全部注册到imageGallery.items。
- 操作区统一浅木、奶油白、青绿和陶土橙；移除原来层层描边的灰绿示意板。规则机本身可点击演示；两面卡片通过同一按钮中的双面贴图做3D翻转。
- 圆片数量、步骤、题号和选择状态由数据渲染，不在生成图片中固化。正式题的答案仍由儿童选择。局部样式没有替换全应用导航。
- 课程、答案、ID、revision、进度和文案沿用050。本轮重新导出voice-lines后逐条比较相同，并保留原文件时间字段；voice-lines及manifest SHA-256均与本轮开始时一致。

## 自动验证

- 28项相关回归通过：`rule-play`、`exploration-framework`、`activity-framework`、`activity-progress`、`round-speech-navigation`。
- `pnpm build`通过，最终构建证据来自最后一次mac:install；仍有现有主包超过500kB的提示。
- `pnpm audit:curriculum`：115组/1110题，0问题。
- 4张运行时贴图：本地文件、透明通道、正比例尺寸和哈希检查通过；合计约2.47MB。源图、生成提示和缩放说明齐全。[资产与语音记录](verification/assets-and-voice.json)。
- 4224条现有Edge语音文本、spokenText、文件路径一致，failures为空。未重新生成或变更语音包；本轮未做完整人工听音审查。
- `git diff --check`通过。

## 浏览器

使用隔离的127.0.0.1:5301进度，未写入真实Mac用户的完成数据。

- 18题全部执行错误提交、正确提交和重试；规则机逐题核对小例子数量、正式题选项图片个数，重看例子保留已选答案；九道翻牌全部按题面序列得到正确结果。[逐题记录](verification/browser-cases.json)。图片无加载失败，控制台无error。
- 1280×788：全部九道卡牌的可操作区域均在桌面内部；规则机控件及圆片也在桌面内部。[边界记录](verification/table-boundaries.json)。原始scrollWidth检查报告的内部越界来自跨槽箭头、卡牌微倾斜和背景阴影，并未超出操作台或页面。
- 375×812：两份圆片完整显示，五张卡按钮约54×72px；页面没有横向溢出。Enter翻面、撤销恢复通过。[响应布局](verification/responsive.json)。
- 减少动态效果分支关闭翻面/进场动画及按钮过渡；未改变用户OS设置进行额外实机测试。

## 原生安装与交互

`pnpm mac:install`成功，更新并打开 `/Applications/小小思考屋.app`。安装与构建二进制SHA-256相同，strict/deep签名通过：[安装记录](verification/installation.json)。

- 真实WebKit中检查了木卡、机身、托盘、圆片的透明边、大小和组合效果；第一张白面实际翻为黄面，截图确认太阳图案正确显示，撤销回白面。
- 翻牌第1/4/7题通过翻面、撤销或重新翻；规则机第1/4/7题通过添入、双份示范、正式题切换与重看，双份例子显示10个。[六个代表题记录](verification/native-cases.json)。
- 验收中Mac锁屏，用户解锁后继续完成；没有将中断步骤算作通过。解锁时用户已转到“关系接力”第1题，结束时恢复该最新位置。两个改动题组的续玩位置也恢复第1题，没有提交原生答案或增加完成记录。[最终位置](verification/native-restored.txt)。

实际应用截图：[规则机](verification/native-machine-ready.png)、[圆片加入后](verification/native-machine-demo.png)、[双份示范](verification/native-machine-double.png)、[翻牌](verification/native-flip.png)、[翻面后](verification/native-flipped.png)、[五张牌](verification/native-flip-five.png)。

## 观察边界

当前完成技术与成人视觉验收。真实儿童对新材质、图示和动作的理解效果仍需亲子试玩，已保留在TODO。美术方向是否符合用户偏好，以用户查看实际应用后的反馈为准。
