# 实施方案：任务配图与材料完整性

实际分支dev；规格[spec.md](spec.md)；2026-09-26。

## 技术与范围
沿用React19、TypeScript、Vite、现有GalleryImage分帧、ActivityImage与ImageViewer。存储仍为本地静态资源和现有进度。没有新依赖、外部服务接口或待决定的技术选型；无需研究代理。目标为当前Mac1280×820，浏览器内容1280×788。

先为75题组记录表示类型和问题，再修A05/P01的缺事件/用途图，以及E04/L07/P06缺操作依据、亲子材料误配。内置imagegen生成四个独立图集：六事件、九用途、九材料、四材料；每格独立注册与使用。颜色形状卡/粗线模板沿用确定性图示，不让生成式绘图决定精确几何。

## Constitution Check
儿童理解、真实现场证据与多种解释保留；A05原音频/答案不变，不在记忆阶段泄露图。所有资产、文案、检验有来源记录；旧进度不删除。非平凡变更已写规格，新增材料/步骤按影响更新revision。最终运行pnpm build、audit:curriculum、audit:illustrations、audit:voice-media、必要回归、mac:install与原生验收。更新CHANGELOG/TODO/assets。设计前后均无原则例外。

## 代码与资源
- src/data/explorationArt.ts、imageGallery.ts：新图集坐标/注册；非方形图集以列/行划分正确单帧。
- public/images/items/exploration-art/及source：新PNG原图与运行文件，保留旧资源。
- src/curriculum/exploration/presentation.ts、language.ts、logic.ts、life.ts：显式按题族/变式映射，修正材料与提供的图。
- src/interactions/MatchingInteraction.tsx、ParentActivity.tsx、ImageViewer.tsx、ActivitySetGame.tsx、styles.css：用途图可看清/独立放大，辅助图在亲子记录模式收起，三栏保持。
- scripts/exploration-presentation.test.mjs、audit-illustration-usage.mjs及lib：新增资产回归、更新清单与泛化图集几何门禁。
- specs/037-task-visual-completeness/：提示词、资产清单、全题组巡检与实际验收证据。

## 验证顺序
先资产逐图视觉核对，再题库/答案回归与本地资源审计，再CUA检查受影响题目、干扰态、完成态、提示与放大。安装标准.app后真实重启检查，并收尾035/036的待验收项。原生受锁屏阻挡时准确保留待办。

.specify/extensions.yml与update-agent-context脚本不存在，无需执行hook/上下文脚本。后续任务按依赖顺序执行；无新增技术选择/未知依赖。

UI巡检追加：G17在task-diagrams.ts以现有原语画俯视人物和方向箭头，graphic.ts继续用原方向关系与答案，styles.css只扩大该题族证据图。P01后3题改准确准备清单并升revision2；E03准备文案说明内置图片，不改玩法与revision。对应T007/T008一并验收。
