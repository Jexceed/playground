# 小小思考屋 Agent Collaboration Guidelines

## Project Overview

小小思考屋是一个面向幼儿与小学低年级孩子和家长共玩的亲子思维游戏。
现有内容以约 4 岁体验为基础，下一阶段面向 6–8 岁扩展，保留原有低龄
内容和进度。项目当前是 React + TypeScript + Vite 单页应用，核心体验是
通过看图、操作、听语音、解释原因和复述过程练习思维能力。

项目不是刷题软件。每个题目必须服务于亲子共玩和低龄儿童理解：

- 场景、题干、图卡、选项和反馈必须指向同一件事。
- 错误选项应代表常见误判或次优选择，不能靠绕口令、双重否定或无关干扰。
- 优先使用可审计的本地图片和本地语音资源；浏览器 TTS 只作为兜底。
- 功能和内容变更必须保留家长可追问“为什么”的空间。

## Curriculum Expansion

- 保持一个应用，一级入口明确为“启蒙”和“探索”，其下再按主题/能力/难度
  组织。原题归启蒙，对标新内容归探索，题组列表和续玩分别呈现；儿童流程
  不使用 V1/V2 标签，不以年龄建立永久代码分支或复制两套应用。
- 上实资料对标以 `specs/029-curriculum-benchmark/` 的来源索引、能力矩阵、
  规格和任务为依据；下载目录中的原始材料仍不是可直接发布的题库。
- 来源查看、能力分类、逐题答案审定和儿童试玩是不同验证层次；文件数、
  页数、题本/答案/重复截图不能直接累计为独立题量或实现覆盖率。
- 新内容覆盖数与量、关系与逻辑、图形与空间、记忆与注意、语言与表达、
  生活与探究。适合口述或实物操作的活动保留亲子观察，不伪造自动评分。
- 年龄是推荐与试玩校准目标；难度由规则、步骤、记忆、表征和支持强度
  描述。现有 L1–L6 不直接换算为年龄。
- 原题升级须保留稳定身份；进度迁移保留旧数据，未知历史信息保持未知。
  同名游戏不能未经规则、交互和表征复核就计为对标完成。

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

## Generation And Release Workflows

语音、图片和发布不是临时产物，必须按可审计流水线处理：

- 改动任何题干、指令、选项、反馈或家长提示后，必须重新导出语音脚本：
  `pnpm export:voice-lines`。
- 默认标准语音包是 Edge `zh-CN-XiaoxiaoNeural`，使用：
  `pnpm generate:edge-voices -- --voice zh-CN-XiaoxiaoNeural --rate -12% --pitch +2Hz --python ./local-tts/.venv/bin/python --quiet --retries 3`。
- macOS `say` 语音只能作为 Edge/F5 不可用时的临时补缺兜底；最终验收或发布前，
  `public/audio/voice/manifest.json` 必须与 `public/audio/voice-lines.json`
  对齐，`failures` 为空，并报告是否仍存在 `macOS say + afconvert` 或
  `mixed local`。
- 使用 image-gen 或其他工具生成的图片，必须落到对应 `public/images/...`
  目录，源图放同类目录的 `source/` 下；不能只留在 `.codex/generated_images`
  或聊天附件里。
- 运行时图片必须注册到 `src/data/imageGallery.ts`；具体物体和高频图卡应优先
  使用本地 PNG 资产，只有缺少资产时才允许临时使用内置 SVG/emoji 视觉兜底。
- 场景图必须是承载题目线索的 1200x675 PNG；不能为了装饰添加会压缩题面、
  干扰证据或重复答案表面的 `sceneImage`。
- NAS/静态部署的标准产物来自 `pnpm build` 和 `pnpm release:nas`，不要在 NAS
  上运行 `pnpm dev`、Vite 或源码题库服务。
- Mac 端签收不能只看浏览器或 Vite preview；涉及启动页、图标、语音、本地资源、
  持久化或发布体验时，必须用 `pnpm mac:build` 生成真实 `.app` 并打开测试。
  本机里程碑安装用 `pnpm mac:install`。
- 完成任何会影响本地使用体验的代码、内容或资源修改后，必须运行
  `pnpm mac:install` 更新 `/Applications/小小思考屋.app`，并在交付说明中报告
  安装或失败原因。

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
