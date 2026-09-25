# 实施方案：故事图片展示

实际分支dev；日期2026-09-25；基线fb884bf；规格[spec.md](spec.md)。

## 技术与研究
沿用React/TypeScript、GalleryImage.frame、现有dialog放大模式与Edge语音导出，不引入库或新素材。根因是排序候选80px和亲子图84px固定上限，辅助手册又占多行。没有未解决技术选择或需要委派的研究项。研究结论见research.md。

## 设计
1. ParentActivity为有storyCards的任务把模式按钮与简短材料放一行；四张图片扩大至约136～144px，保留完整裁切与可读标题。长步骤的编号、前后按钮和进度合到同一行。
2. 现有插画排序题扩大候选图片，在完成后扩大结果图。带反序参照的L06保持已验证并排结构，并按有限宽度适配图片。
3. 新ImageViewer复用ActivityImage，每次只放大一帧；上一张/下一张和方向键切换，Escape/关闭返回。放大按钮是选卡按钮的兄弟元素，避免嵌套button或误选答案；已摆图片也能查看。状态与会话响应分离，阶段变化及切题清空查看状态。
4. 新增公共界面文案至ACTIVITY_COPY并导出标准本地语音；不修改题干/答案/revision。

## 宪章与范围
图卡为主、保留亲子解释；035补图不回滚；素材与题目引用不变；当前Mac一页完整操作，保留三栏。先完成设计与任务，后修改代码。无extension hooks，无update-agent-context脚本。设计前后无违反宪章项。

## 文件
src/interactions/ImageViewer.tsx（新增）、ParentActivity.tsx、src/games/ActivitySetGame.tsx、src/domain/activity.ts、src/styles.css、语音导出产物、docs与本规格证据。

## 验证
用CUA按1280×788内容区查看E03九题，以及P02、L06、A05共享组件。量测默认图片尺寸、页面高度和按钮可达；检查大图裁切、键盘关闭/切换、放大不改答案、关闭保留答案，完成态可查看。复用84项已有回归，不新增只镜像CSS的测试。pnpm build、audit:curriculum、audit:illustrations、audit:voice-media；mac:install后标准.app复核。当前Mac锁屏，先完成可独立进行的预览与构建，原生签收单独记录。
