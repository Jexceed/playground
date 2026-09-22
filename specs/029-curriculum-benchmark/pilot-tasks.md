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
- [x] T010 在src/App.tsx接入新关卡、进度与续玩，保持单应用、无V1/V2标签；一级入口修正由T017–T019承接。
- [x] T011 更新scripts/export-voice-lines.mjs，生成标准Edge语音并审计完整性。
- [x] T012 更新scripts/audit-curriculum.mjs及新增活动审计，覆盖实际44组513题和所有新资源。
- [x] T013 完成语义、旧题完整性和适用回归测试，执行pnpm build和pnpm audit:curriculum。
- [x] T014 完成浏览器实际交互与桌面/触屏视觉检查，保存verification/pilot-qa.md。
- [x] T015 执行pnpm mac:install并打开真实应用验证新题、听题入口与持久化；本地语音媒体/浏览器播放已验证，原生扬声器输出未录音监听。
- [x] T016 更新docs/CHANGELOG.md、docs/TODO.md、本规格状态并保存本地dev检查点。
- [x] T017 明确启蒙/探索目录归属，在主题之上提供双入口，分开列表、题量与成长记录。
- [x] T018 按部分保存稳定ID续玩，兼容旧位置且保护另一部分记录，完成行为验证。
- [x] T019 验证双入口桌面/窄屏交互，更新真实Mac安装、截图和产品说明。

## 当前验收边界

T014：24题浏览器操作、1280×720/1024×700/375×812布局、鼠标拖放、手机尺寸点击、自动计时/保持隐藏/重看已通过；真实Mac最小化触发中断并要求重新观察，已补完。
T015：mac:install、签名与二进制一致性检查通过；解锁后完成真实.app双入口、错误/正确判定、点击/拖放、退出重开和原记录保留检查。原生听题按钮已操作，工具不采集扬声器声音；音频可解码及本地播放链路另有媒体/浏览器证据。
T017–T019：分区目录与存储行为测试、浏览器和原生截图见verification/section-navigation-qa.md。
