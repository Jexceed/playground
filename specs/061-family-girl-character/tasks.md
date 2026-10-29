# Tasks: 家庭活动中的 logo 女孩

## Phase 1: Setup

- [x] T001 保存原工作区和六图的修改前状态到 `/tmp/playground-girl-061-baseline/`，完成 `specs/061-family-girl-character/spec.md` 和规划文件。

## Phase 2: Foundation

- [x] T002 在 `public/images/scenes/source/family-girl-061-prompts.json` 记录 logo 身份参考、逐图动作约束和精确提示词。

## Phase 3: US1 统一女孩形象

- [x] T003 [US1] 编辑六幅 `public/images/scenes/english-daily-*.png`，新原图保存到同类 `source/english-daily-*-girl-061-source.png`。
- [x] T004 [US1] 逐图验收角色、情境、尺寸并写入 `public/images/scenes/source/family-girl-061-manifest.json`，同步 `src/data/imageGallery.ts` 的 alt。

独立验收：六图原男孩均改为 logo 女孩，关键物体和动作完整，蓝裙朋友可区分。

## Phase 4: US2 图文语音和本机一致

- [x] T005 [US2] 修正 `src/curriculum/everyday-english.ts` 中涉及主角的代词，导出 `public/audio/voice-lines.json` 并增量生成标准 Edge 语音，核对 manifest。
- [x] T006 [US2] 运行现有相关测试、构建、课程和语音审计，结果保存到 `specs/061-family-girl-character/verification/`。
- [x] T007 [US2] 运行 `pnpm mac:install`，打开真实应用查看三题组六幅图和播放；在 `specs/061-family-girl-character/verification/acceptance.md` 记录签收及边界。六图与放大查看通过；英语示范按钮已触发，声音质量的人耳签收未计为通过。

独立验收：活动 ID 和答案不变；中文文字和声音一致；已安装应用可见新女孩。

## Phase 5: Documentation

- [x] T008 更新 `docs/CHANGELOG.md`、`docs/TODO.md` 和 `docs/assets.md`，完成 `specs/061-family-girl-character/verification/acceptance.md`。

## Dependencies and implementation strategy

T001 → T002 → T003 → T004 → T006 → T007 → T008。T005 在 T002 后可与独立图片编辑同时推进，T006 必须等 T004/T005 完成。六图编辑可独立进行，先做早晨图验证角色，再复用一致描述完成其他图。最小交付是 US1 的六图与注册；完整交付仍包括 US2 的语音与安装。

无新增机械单元测试；使用已有内容契约和图像/应用目检。任务共 8 项，其中 US1 两项、US2 三项。当前无扩展 hooks。
