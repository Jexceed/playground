# 小小思考屋 Agent Collaboration Guidelines

## Project Overview

小小思考屋是一个面向 4 岁孩子和家长共玩的亲子思维游戏。项目当前是
React + TypeScript + Vite 单页应用，核心体验是让孩子通过看图、操作、
听语音、解释原因和复述过程来练习数感、逻辑、计划、证据推理和空间理解。

项目不是刷题软件。每个题目必须服务于亲子共玩和低龄儿童理解：

- 场景、题干、图卡、选项和反馈必须指向同一件事。
- 错误选项应代表常见误判或次优选择，不能靠绕口令、双重否定或无关干扰。
- 优先使用可审计的本地图片和本地语音资源；浏览器 TTS 只作为兜底。
- 功能和内容变更必须保留家长可追问“为什么”的空间。

## Source Of Truth

- `.specify/` 和 `specs/` 是 Spec-Driven Development 的正式流程资产。
- `AGENTS.md` 记录项目原则、协作规则和质量门禁。
- `docs/` 保存长期维护的工程文档、资产规范、变更记录和待办。
- `docs/archive/` 只保存历史资料，不作为当前实现依据。
- `references/` 是未整理的原始参考资料，不直接决定产品行为。

## Spec-Driven Development

所有非平凡变更都要先进入 Spec Kit 流程：

1. 用 `$speckit-specify` 或 `specs/<number>-<feature>/spec.md` 描述要解决的用户问题和验收标准。
2. 用 `$speckit-plan` 产出实现方案，明确影响的代码、文档、资源和验证命令。
3. 用 `$speckit-tasks` 拆成可独立验证的任务。
4. 实施后更新 `docs/CHANGELOG.md` 和 `docs/TODO.md`。
5. 结束前运行必要验证，至少包括 `pnpm build` 和 `pnpm audit:curriculum`。

当前 Spec Kit 使用 Codex skills 集成，初始化产物在 `.specify/` 和 `.agents/skills/`。

## Asset Taxonomy

- `public/images/brand/`：品牌标识。
- `public/images/characters/`：可复用角色头像，例如小猫、小狗、小兔、小熊。
- `public/images/items/`：非角色物体、动作、材料和图卡。
- `public/images/scenes/`：承载题目线索的 1200x675 场景图。
- 每类图片如有生成源图，放在同目录下的 `source/`。
- 所有应用可引用图片必须注册到 `src/data/imageGallery.ts`。
- 题目中 `sceneImage.src` 必须来自 `imageGallery.scenes`。

## Documentation Hygiene

- `docs/CHANGELOG.md` 记录已经完成的用户可见或工程重要变更。
- `docs/TODO.md` 记录下一步工作，按 P0/P1/P2 分级。
- `docs/assets.md` 记录资产目录、命名、注册和审计规则。
- 历史规划、过期数字、一次性并行任务记录必须归档到 `docs/archive/`。

## Commit And Push Policy

- Do not make frequent commits or pushes to `main` while a design or implementation direction is still being discussed.
- Before pushing to `main`, wait for the user to confirm the方案 or explicitly ask for a release-style/big-version commit.
- Use `main` for confirmed milestones only. Keep intermediate exploration and rollback points off `main`.

## Local Checkpoint Policy

- Use a local `dev` branch for work-in-progress checkpoints.
- It is acceptable to commit locally on `dev` after meaningful steps so the project can be rolled back safely.
- Prefer small, descriptive local commits on `dev` over untracked or hard-to-recover changes.
- Do not push `dev` unless the user explicitly asks.

## Working Rules

- Keep the worktree clean before switching context when feasible.
- Never discard user changes unless explicitly asked.
- When unsure whether a change is ready for `main`, keep it on `dev` and report what has been changed and verified.
