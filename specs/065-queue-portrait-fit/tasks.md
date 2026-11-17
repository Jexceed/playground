# Tasks：队伍头像比例与毛色

## Setup / Foundation

- [x] T001 在 `specs/065-queue-portrait-fit/` 完成规格、方案、模型和验收契约。
- [x] T002 在 `public/images/characters/queue-065/source/` 保存六个imagegen编辑源图和精确prompt，逐张检查透明边缘与姿势。

## US1（P1）：按头像缩放高亮

独立验收：6/8/10位普通和放大时，头像和高亮均为近方形，计数对齐。

- [x] T003 [US1] 更新 `src/interactions/QueueCountingEvidence.tsx` 和 `queue-counting.css`，将高亮/阴影绑定头像wrapper。

## US2（P1）：毛色辨认朋友

独立验收：同一队伍每位使用不同图片，动物物种、小兔身份和数学条件不变。

- [x] T004 [US2] 规范化六张PNG并注册到 `src/data/imageGallery.ts`，记录 `source/manifest.json`。
- [x] T005 [US2] 更新 `src/domain/queue-counting.ts`、`src/domain/activity-assets.ts` 的imageKey分配与实际依赖。
- [x] T006 [US2] 更新 `scripts/queue-evidence.test.mjs` 与历史gallery比较，验证唯一性和条件不变。

## Validation / Delivery

- [x] T007 运行相关回归、build、curriculum及语音完整性检查；浏览器测量保存到 `verification/`。
- [x] T008 执行 `pnpm mac:install`，保存实际Mac普通/放大图和安装校验至 `verification/`。
- [x] T009 更新 `docs/assets.md`、`docs/CHANGELOG.md`、`docs/TODO.md` 和本规格 `verification.md`。

依赖：T001→T002/T003→T004→T005→T006→T007→T008→T009。图片生成与独立布局修改可并行；同一文件修改顺序进行。先验收框比例，再验收毛色接入。
