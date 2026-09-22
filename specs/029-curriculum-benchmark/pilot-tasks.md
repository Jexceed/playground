# Tasks: First Playable Increment

本轮只交付pilot-scope.md，主tasks.md的完整范围仍保留。

- [x] T001 检查规格清单14/14通过，冻结旧题哈希于verification/legacy-baseline.json。
- [x] T002 在scripts/lib/load-ts-module.mjs及load-game-data.mjs接入模块图构建加载。
- [x] T003 在src/domain/activity.ts和evaluation.ts定义响应语义与判定器，先写独立测试。
- [x] T004 在src/engine/activity-session.ts实现编辑、撤销、提交、提示及记忆阶段。
- [x] T005 在src/services/activity-progress.ts记录新活动事实和稳定ID定位，兼容保留旧记录。
- [x] T006 在src/curriculum/pilot/制作24个原创活动并保存authoring/pilot.md的来源与独立解题记录。
- [x] T007 在public/images/items/thinking-symbols/制作确定性图卡PNG/source并注册src/data/imageGallery.ts。
- [x] T008 在src/curriculum/catalog.ts汇总旧题与新活动，保持旧内容原值。
- [x] T009 在src/games/ActivitySetGame.tsx与src/styles.css实现可点击/拖放的完整玩法与亲子反馈。
- [x] T010 在src/App.tsx接入新关卡、进度与续玩，保持单应用、无版本入口。
- [x] T011 更新scripts/export-voice-lines.mjs，生成标准Edge语音并审计完整性。
- [x] T012 更新scripts/audit-curriculum.mjs及新增活动审计，覆盖实际44组513题和所有新资源。
- [x] T013 完成语义、旧题完整性和适用回归测试，执行pnpm build和pnpm audit:curriculum。
- [ ] T014 完成浏览器实际交互与桌面/触屏视觉检查，保存verification/pilot-qa.md。
- [ ] T015 执行pnpm mac:install并打开真实应用验证新题、声音与持久化。
- [x] T016 更新docs/CHANGELOG.md、docs/TODO.md、本规格状态并保存本地dev检查点。

## 当前验收边界

T014：24题浏览器完整操作、1280×720布局和鼠标拖放已通过；更窄尺寸、自动计时/后台中断UI专项待解锁补完。
T015：mac:install、签名与二进制一致性检查已通过；真实.app打开/操作验收被Mac锁屏阻挡，保持未完成。
