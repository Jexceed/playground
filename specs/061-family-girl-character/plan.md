# Implementation Plan: 家庭活动中的 logo 女孩

**Branch**: `main` | **Date**: 2026-10-29 | **Spec**: [spec.md](spec.md)

## Summary

用内置 image_gen 编辑 060 六幅生活场景，以现用 logo 女孩为身份参考，保留情境与动作；更新对应 alt、主角代词和本地语音，安装并打开 Mac 应用验证。

## Technical Context

- TypeScript / React 19 / Vite 7 / Tauri；沿用现有 Sharp 与 Edge 语音脚本，无新依赖。
- 本地 1200×675 PNG，生成原图保留于 scenes/source；不修改存储模型。
- 范围为六幅生活情境、12 个活动；保持题目 ID、答案、评分、进度和英文原文。
- 运行时继续离线加载本地资源；不增加渲染请求或新服务。
- 验证使用现有 node 测试、课程和语音审计、人工图像及真实 Mac 窗口检查。

## Constitution Check

设计前后均通过：场景提供解题证据；图片本地注册且来源可追溯；中文代词与语音同步；不把成人目检当成儿童理解验证。用户和 AGENTS.md 明确要求 main，优先于宪章的历史 dev 条款。setup-plan 输出的 BRANCH 是 feature 元数据，实际 Git 分支保持 main。无额外研究未知项，不创建研究子代理。

## Project Structure

- `public/images/scenes/english-daily-{morning,farewell,thanks,sorry,water,help}.png`：替换运行时图。
- `public/images/scenes/source/english-daily-*-girl-061-source.png`：保留新原图；原 060 原图保留。
- `public/images/scenes/source/family-girl-061-prompts.json`：精确提示词及参考路径。
- `public/images/scenes/source/family-girl-061-manifest.json`：源图、处理方式、尺寸和哈希。
- `src/data/imageGallery.ts`：同步六图 alt；路径稳定。
- `src/curriculum/everyday-english.ts`：仅修正指向主角的中文代词。
- `public/audio/voice-lines.json`、`public/audio/voice/manifest.json` 和本地 mp3：按标准增量生成。
- `docs/CHANGELOG.md`、`docs/TODO.md`、`docs/assets.md`：变更、试玩和素材规则。
- `specs/061-family-girl-character/verification/`：审计、应用检查及结果。

## Verification

逐图确认角色及情境 → `pnpm export:voice-lines` → 标准 Edge 生成 → 现有 everyday-English / activity-language / speech 测试 → `pnpm build` → `pnpm audit:curriculum` → `pnpm audit:voice-media` → `pnpm mac:install` → 打开 `/Applications/小小思考屋.app` 检查实际窗口，验证签名和安装二进制一致。若 Mac 锁屏，记录该边界，不伪称原生签收。

## Tooling

`.specify/extensions.yml` 不存在，无前后 hooks。仓库没有 `update-agent-context.sh`；沿用现有 AGENTS.md，不另造脚本或修改协作规则。
