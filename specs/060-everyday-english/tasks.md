# Tasks: 语言花园的日常英语

## Phase 1: Setup

- [x] T001 完成 `specs/060-everyday-english/spec.md`、设计与验收方案，保持 main。

## Phase 2: Foundation

- [x] T002 在 `src/domain/activity.ts`、播放调用与 `src/curriculum/activity-voice-lines.ts` 贯通 speechLocale 和 dialogue。

## Phase 3: US1 情境表达

- [x] T003 [P] [US1] 生成六幅 `public/images/scenes/english-daily-*.png`，保留 source 和提示词，注册 `src/data/imageGallery.ts`。
- [x] T004 [P] [US1] 创建 `src/curriculum/everyday-english.ts` 的三组/12 活动并接入 `src/curriculum/catalog.ts` 和导航。
- [x] T005 [US1] 在 `scripts/everyday-english.test.mjs` 验证图片、答案、原创来源边界和稳定身份。

独立验收：六个情境选择可以进入并判定，图/问/选/解释一致。

## Phase 4: US2 亲子对话

- [x] T006 [US2] 在 `src/games/ActivitySetGame.tsx` 和 `src/interactions/` 展示双语逐句示范，`src/styles.css` 支持清晰换行。
- [x] T007 [US2] 在 `scripts/everyday-english.test.mjs` 验证亲子观察不生成自动正确率、对话导出 en-US。

独立验收：六项亲子活动可复听/换角色/记录支持程度。

## Phase 5: US3 语音体验

- [x] T008 [US3] 在 `src/games/ActivitySetGame.tsx` 给已完成的听辨保留 stimulus 复听。
- [x] T009 [US3] 导出 `public/audio/voice-lines.json` 并生成标准中英语音，审计 manifest/failures。

独立验收：原听辨完成后可听英语，新英文选项和对话使用英文语音。

## Phase 6: Delivery

- [x] T010 更新 `docs/CHANGELOG.md`、`docs/TODO.md`、`docs/assets.md`。
- [x] T011 构建、课程/资源审计与相关测试，将结果记入 `specs/060-everyday-english/verification/`。
- [x] T012 运行 `pnpm mac:install` 更新 `/Applications/小小思考屋.app`，验证签名与构建/安装二进制一致。
- [ ] T013 完成人耳听音验收：061 已补齐真实 Mac 窗口、六图及示范播放入口检查，原锁屏阻碍已解除；工具未采集扬声器声音，发音、音量和音色仍待人工确认。
- [x] T014 在提交前为 040–059 历史快照建立明确的原题库比较范围；保留 3 组/12 项英语内容的独立测试，验证未知新增内容和旧题变化不会被过滤，再完成全套回归及基线对照。297 项中 295 通过；其余两项与 `8fb7e58c` 一致，无新增失败。

## Dependencies and Parallel Work

T001 → T002；T003/T004 可并行且在 T002 的数据契约下协作；T006/T008 可同一 UI 任务完成；T009 必须等所有文案稳定；T011/T012 在资源齐全后执行。先内容与图，再交互与语音，最后真实安装验证。

## Tooling Note

本仓库无 `update-agent-context.sh`，已尝试运行且确认不存在；不生成替代脚本。无需修改已有 AGENTS.md。
