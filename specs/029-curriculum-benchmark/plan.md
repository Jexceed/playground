# Implementation Plan: 基于上实资料的思维活动扩展

**Branch**: `dev` | **Date**: 2026-09-22 | **Spec**: [spec.md](spec.md)

## Summary

在一个 React/Tauri 应用中自然扩展课程。以用户提供的本地资料为研究输入，先建立来源—能力题族—活动—验证的链路，再增建多选、槽位回填、记忆阶段和约束操作引擎。保留当前40游戏489轮及进度，不建立年龄版本分支、不增加V1/V2入口。

M0设计已完成。用户随后要求先实现框架与少量题目，首个4组24题增量已实现并通过浏览器验证，Mac构建/安装已完成。真实应用与剩余UI专项待手动解锁，见[pilot-scope.md](pilot-scope.md)、[pilot-tasks.md](pilot-tasks.md)和[验证记录](verification/pilot-qa.md)。完整71题族范围继续保留。

## Technical Context

**Language/Version**: TypeScript、Node.js、现有 Tauri Rust 壳；版本沿用仓库锁文件（当前安装 TypeScript 5.9.3）。
**Primary Dependencies**: 现有 React 19、Vite 7、Tauri 2，无新增框架或后端。
**Storage**: 本地版本化学习记录；初期继续浏览器 localStorage，新增迁移与校验层。
**Testing**: 现有 Node 测试、课程审计、TypeScript/Vite构建；新增判定语义和迁移用例，代表交互真实运行验收。
**Target Platform**: 先 Web/Tauri 主应用。保留现有抖音数字岛范围，按显式 capability 检查出口；iPad商业发行另属既有规格。
**Project Type**: 一个前端工程、模块化课程与纯数据判定层。
**Performance Goals**: 离线可玩；点击/拖动即时反馈；代表性1280×820桌面和触屏尺寸能看清线索、选项、槽位。
**Constraints**: 原有资产分类、图像注册、Edge中文音色及本地资源审计；不复制整套原教材到发布包，不默认自动口语评分或上传录音。
**Scale/Scope**: 121个参考文件，56 PDF共1301物理页、47 JPG、16 MP4、1 DOCX、1 PPTX；能力矩阵是完整建设范围，24题仅为首个交互试点。

## Constitution Check

- Child-centered learning integrity：保留亲子操作、解释、复述。按用户已确认的6–8岁目标，将宪章范围由学龄前扩至幼小阶段，原有低龄体验继续保留。
- Spec-driven traceability：本特性含spec、research、来源证据、矩阵、模型、契约、tasks和quickstart。
- Auditable local assets：原始资料不成为运行资源；原创图卡、场景和语音继续注册及审计。交互线框/高亮等控件不能掩盖缺失的题目素材。
- Verification before completion：本轮检查文档一致性并运行现有build、audit；实施还须语音、交互、迁移、截图、真实Mac构建与安装。
- Documentation hygiene：同步AGENTS、宪章、CHANGELOG、TODO、内容和资产边界。研究证据作为本规格正式依据，原始下载目录保持原样。

设计后复查：以上约束均纳入方案。儿童实测、完整逐题答案审定和新运行时验证尚未执行，作为实施门禁而非当前已通过项。

## Decisions And Research

见 [research.md](research.md)、[coverage-matrix.md](coverage-matrix.md)、[source-index.md](source-index.md) 和 evidence/ 下的分组研究。

关键决定：
1. 课程按能力域和题族拆分；年龄用于推荐，发行版本号不进入题目业务身份。
2. 题族、交互、判定、呈现和会话阶段分开建模。相同题族可有单选入门和操作进阶。
3. 准确复用既有入门任务，不把同名游戏计成高阶覆盖；保留所有旧ID。
4. 数据/判定无React和平台API依赖；小游戏复用经校验的数据出口，不能复用不了就改写成不等价单选。
5. 先构建时加载类型化课程，运行时外置JSON题库仍为独立后续特性；content/占位状态不变。
6. 几何答案关键关系由确定性规则描述，按同一描述制作/校验本地图片及交互区域；不依赖随机生成图的几何精度。
7. 主应用逐步增加记忆、语言、生活能力入口；先用领域注册表兼容现有math/logic/graphic标识，避免直接移动旧题破坏续玩。
8. 对齐题族的全范围，不按1301页或“1000题”标题承诺同等独立题量。

## Project Structure

### Documentation

```text
specs/029-curriculum-benchmark/
├── spec.md
├── plan.md
├── research.md
├── coverage-matrix.md
├── coverage-matrix.json
├── source-index.md
├── source-inventory.json
├── review-ledger.json
├── baseline-curriculum.json
├── data-model.md
├── contracts/activity-session.md
├── quickstart.md
├── tasks.md
├── checklists/requirements.md
└── evidence/                  # 分组研究及机器阅读记录，不含整份原题
```

### Proposed Runtime Modules (not yet implemented)

```text
src/
├── App.tsx                    # 保留启动与壳，逐步接入目录
├── curriculum/
│   ├── catalog.ts             # 应用/审计/语音/出口共同入口
│   ├── domains.ts             # 稳定领域注册表
│   ├── legacy-adapter.ts      # 无损承接现有GameConfig
│   ├── math/
│   ├── logic/
│   ├── graphic/
│   ├── memory/
│   ├── language/
│   └── life/
├── domain/
│   ├── activity.ts
│   ├── response.ts
│   └── evaluators/            # 集合/序列/格位/图/几何/约束
├── engine/
│   ├── session.ts
│   ├── memory-protocol.ts
│   └── support-events.ts
├── interactions/             # 单选、多选、摆放、连线、路径、构形、亲子观察
├── services/
│   ├── progress/
│   └── speech/
├── data/imageGallery.ts       # 当前图片注册入口保留
└── games/ProgressiveSetGame.tsx # 先保留，按验证结果逐步拆分
scripts/lib/load-game-data.mjs # 升级为加载统一catalog，兼容当前出口
scripts/audit/                # 按通用规则+题族分开审计
public/images/                # 现有分类
public/audio/                 # 中文标准音色；扩展语种显式配置
src-tauri/                    # 主应用桌面壳
doyingame/                    # 既有数字岛，保持原范围
```

**Structure Decision**: 先在同一工程内模块化，不复制 AppV1/AppV2，不立刻迁移成复杂monorepo。legacy-adapter是过渡层，旧题仅有一个权威数据来源。

## Delivery Sequence

### M0 研究与范围冻结（本次）
完成来源库存、分组研究、题族矩阵、规则与交互契约、分阶段任务。对资料中的重复、缺失音频、成人图推、答案歧义和年龄标签分别记账。保留实际阅读方式，不能把联系表浏览当逐题验收。

### M1 兼容底座与24题交互试点
冻结旧ID基线，统一课程加载和领域注册，加入响应联合类型、会话状态、存档迁移。四类试点：多选、顺序回填、多槽位填格、分阶段记忆，各6个原创活动。仍可玩原课程。完成试点仅验证引擎，不算全面内容交付。

### M2 数理、逻辑、图形空间完整建设
按矩阵逐族完成：守恒/分合/凑破十/序数/数量关系/货币时间，关系排序/约束填格/路径/规则迁移，多属性矩阵/变换/组合/叠合/视图/折剪。默认每族三台阶、每阶三变式；矩阵明确适用台阶及有理由的例外，先独立解题再做素材。

### M3 记忆注意、语言和生活亲子活动
加入视觉集合/位置/顺序/逆序记忆、听觉工作记忆、故事理解/复述、复合指令、视觉搜索与抑制、生活探究和实物活动。英语听辨使用独立语种资产；不能从缺声截图猜原音轨。开放活动记录家长观察。

### M4 全面验收与里程碑
逐族核对全部纳入范围，清理待核验条目，验证各难度台阶、旧记录、音画一致性、线下活动说明及六组亲子试玩。发布前执行build、curriculum、voice-media、桌面真实安装；只在用户确认里程碑后合入/推送main，不推送dev。

## Baseline And Branch Handling

当前工作树以既有dev为基线（98b0c64），保留其网页、iPad规划和抖音工作。原工作目录保持main和未跟踪doyingame，不切换、不清理。研究文档可在dev作本地检查点；不为年龄建立永久分支。

现有Spec Kit脚本用feature_directory解析上下文，输出的BRANCH有时是特性目录名；真实分支以git branch --show-current为准。当前集成没有update-agent-context.sh，直接更新AGENTS并记录这一工具差异，不伪称脚本已运行。

## Validation

- 本轮：检查来源ID唯一、路径存在、页码合法、121来源均有阅读记录；检查矩阵来源和旧游戏ID；Spec/TODO/任务状态一致；运行 `pnpm build`、`pnpm audit:curriculum`。
- 实施：测试答案语义、合法多解、库存/空白、撤销、记忆生命周期、语音取消、旧进度幂等迁移；不要仅做匹配源代码字符串的断言。
- 改文案后：`pnpm export:voice-lines`，按标准Edge命令生成，再运行 `pnpm audit:voice-media` 和课程审计。
- 涉及本地体验后：`pnpm mac:install`（包括mac:build/sign），打开真实应用验证启动、离线、语音、交互和持久化。
- 所有实施命令、验收场景和本轮证据状态见 [quickstart.md](quickstart.md)。

## Complexity Tracking

不新增服务、账号或远端内容系统。复杂度集中在资料实际要求的响应类型、阶段化记忆、多解判定和内容审计；这些是全面对标所需边界。
