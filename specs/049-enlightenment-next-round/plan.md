# Implementation Plan: 启蒙连续答题与完成去向

**Branch**: `main` | **Date**: 2026-10-20 | **Spec**: [spec.md](spec.md)

## Summary

分开处理题序推进与历史完成统计。中间题永远下一题，末题先补漏，再进入同主题下一组；主题末组明确展示完成状态并允许重玩。

## Technical Context

TypeScript 5.8、React 19、Vite 7、Tauri 2；既有 localStorage 完成/续玩记录。沿用 Node test 和 Vite TS 加载器，不新增依赖。适用启蒙 40 组489题，探索行为保持原样。计算只遍历当前组或主题目录，不引入网络或后台服务。

## Constitution Check

规格先于实现；不改课程题目、答案或资源，保留解释原因的反馈。验证使用独立回归、浏览器与真实安装版。分支遵循用户当前 AGENTS.md 的 main 要求，覆盖旧 constitution 的 dev 约定。更新 CHANGELOG/TODO，build/audit/mac:install 为交付门禁。设计复核通过，无需要澄清的技术未知项。

## Project Structure

- `src/domain/enlightenment.ts`：下一题位置的纯函数，先判题序再查漏题。
- `src/services/curriculum-navigation.ts`：按主题完整目录确定下一组。
- `src/games/ProgressiveSetGame.tsx`：共享上述决策生成按钮与跳转，末组完成状态/重玩/跳题清理。
- `src/App.tsx`：记录组完成、进入下一组第1题并朗读/保存位置；普通题组切换继续保留续玩。
- `scripts/enlightenment-navigation.test.mjs`：行为回归与全部40组遍历，纳入 test:enlightenment。
- `specs/049-enlightenment-next-round/`：研究、状态、UI合同、验收步骤与证据；`docs/CHANGELOG.md`、`docs/TODO.md`。

## Validation

`pnpm test:enlightenment`；`node --test scripts/curriculum-navigation.test.mjs scripts/round-speech-navigation.test.mjs scripts/bridge-play.test.mjs scripts/activity-progress.test.mjs`；`pnpm build`；`pnpm audit:curriculum`；`pnpm export:voice-lines` 检查输出内容一致及manifest对齐；`pnpm mac:install` 后原生重玩验证与签名/二进制核对。浏览器隔离页面覆盖全部/部分完成历史，原生重玩已完成题并恢复原题。

仓库缺少 skill 指向的 `.specify/scripts/bash/update-agent-context.sh`；本轮未引入栈或规则变化，保留手工维护的 AGENTS.md。
