# Validation Guide: 课程对标扩展

## Current Delivery

首个增量已实现并安装：44组513题，包含原40组489题与4组24题互动试点。28项自动化测试、24题浏览器流程和课程/语音审计通过；真实Mac应用打开操作被锁屏阻挡。当前证据见[验证记录](verification/pilot-qa.md)。

## Earlier Design Checkpoint

本轮是来源研究、规格、计划与任务交付。新课程/交互尚未实现，未改运行资源，未执行Mac重装。
基线为dev的98b0c64。原工作目录main及其未跟踪文件保持原样。

2026-09-22本轮已验证：
- source inventory：121文件、56 PDF共1301页；无字节级重复，语义重复另记。
- 通过实际加载数据确认40游戏489轮：math122、logic319、graphic48。
- pnpm build通过；pnpm audit:curriculum为0问题。
- 使用独立工作树依赖，frozen lockfile安装；没有变更锁文件。
- 当前Codex工具提供pnpm11.19.0；仓库packageManager声明11.7.0。本轮验证工具版本记账，不据此修改项目版本。
- 仓库codex-pnpm.sh仍指向旧runtime/bin/pnpm，首次调用失败；改用已发现的runtime/bin/fallback/pnpm完成同一命令。未因本次设计修改运行脚本。
- Spec Kit没有update-agent-context.sh；AGENTS按实际决定人工同步。
- 来源、矩阵、任务及本地链接一致性检查在文档定稿后执行，结果记入CHANGELOG。

## Implementation Prerequisites

从tasks.md依赖顺序执行，先保持旧题快照与进度兼容。新增内容进入相应题族前：
1. 打开来源完整相关页及答案，确认题干/图/声音是否完整；记录所用locator。
2. 独立推导规则及所有合法答案，说明误选违反什么条件。
3. 对原题歧义、音轨缺失或成人复杂度做原创改编；保存review记录。
4. 制作一致的题图、交互区域、反馈、提示和家长追问。

## Baseline Commands

```bash
pnpm build
pnpm audit:curriculum
```

Codex本机若旧wrapper路径不可用，可在当前工作树用已发现运行时：
```bash
PATH="/Users/chiang/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" /Users/chiang/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm build
```

这只是本轮环境路径，不写死进发布代码。

## Meaningful Semantic Checks

- 多选集合顺序不影响判定，错选可取消。
- 重复图卡按unlimited/once/counted库存处理；合法空白和漏填不同。
- 两种合法路径/拼法都通过，一种破坏约束的近似解失败；连桥网络逐项验证度数、双桥、不交叉与整体连通。
- 撤销/暂存不增加提交错误次数；跳过不是错误选项。
- 记忆观察素材在作答时隐藏；重看/重听计支持；切后台不消耗未知时长。
- 音频切题立即取消旧播放，缺音不跳过必要听取阶段。
- 旧存档迁移两次结果一致；畸形数据不覆盖原存档；未知值保持未知。
- 新记录题序改变仍续到原ID；旧版本无法确认时保留历史并回到主题选择，不猜索引或把游戏完成展开成全部题目完成。
- 亲子活动记录为观察，不伪造自动正确率。
- 英语听辨使用英语本地语音并按语言目标验收。
- 平台出口遇不支持kind明确失败/排除，不静默改题。

## Asset And Local App Acceptance

改动题干、指令、选项、反馈、提示或家长文字后：
```bash
pnpm export:voice-lines
pnpm generate:edge-voices -- --voice zh-CN-XiaoxiaoNeural --rate -12% --pitch +2Hz --python ./local-tts/.venv/bin/python --quiet --retries 3
pnpm audit:voice-media
pnpm build
pnpm audit:curriculum
pnpm mac:install
```

英文音频使用实施阶段经独立配置/审计的locale与voice流程，不把中文命令当英文完整生成步骤。
打开真实/Applications/小小思考屋.app，验证启动、离线资源、语音、各交互、刷新/重启续玩。保留安装与测试结果。
几何题在真实尺寸核对细线、接触、重叠、镜像、视图、候选差异；联系表只能筛查，关键页必须单题检查。

## Full Benchmark Acceptance

逐行检查coverage-matrix：所有纳入题族达到矩阵声明的适用台阶与变式目标（默认三台阶各三题；亲子观察按不同活动条件验收，例外有明确理由）；独立答案、素材、音频、流程、亲子说明及验证证据齐全。
referenceOnly和needsSourceCheck各有明确理由，不混入已实现分子。待核验条目必须做出最终处置才能宣称全范围完成。
分别报告来源处理率、题族实现率、可玩活动数和代表用户校准情况。24题试点完成不得关闭其余任务。
亲子校准至少6、7、8岁各两组，记录实际理解/独立程度/提示和解释，不用通过率对孩子贴能力标签。
