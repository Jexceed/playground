# Plan: 探索质量与来源覆盖复核
Branch: dev | 2026-09-23 | spec.md

## Scope and method
以当前621项探索为产品检查范围，分别记录597项新编、24项试点。对照029 spec/plan/tasks/matrix的目标，并由原资料完整页抽检查找被宽题族隐藏的子任务。库存121文件全量比对，不把哈希或联系表阅读说成逐题验收。
研究分为数学/逻辑、图形、源文件完整性三个独立只读任务；主线程审查记忆/语言/生活、语音脚本与触发、UX及汇总。依据speckit-plan Phase0的研究代理流程，代理不得改代码或用户原资料。

## Technical context
沿用React/TypeScript/Vite/Tauri、Node测试和本地Edge语音。PDF使用本地提取/渲染与视觉核对；无新增服务。图片和音频文件不上传第三方研究服务。引用原文只做短证据，不提交整份教材。

## Confirmed corrective work
1. helpers.choice给纯图A/图1等候选标记按实际显示顺序重编号，tokenId/答案图片不变，消除固定正确标签。
2. G20仅约束可从最终图面观察到的遮挡关系；用独立排列/像素比较验证同图合法解不再误判。
3. N08统一整张纸的外框后再细分，N10将未自动收集的单双解释明确放入亲子追问。
4. 覆盖审计区分结构数量与语义等价；新人工分族记录独立存档，不能输出“已有71族=全资料覆盖”的结论。
5. 浏览器复现G14旋转后预览不变，修正AdvancedInteraction使预览和实际放置共用旋转后占格；不改变部件、答案或题目身份。
其他需要新引擎/大量内容的缺口进入029的追踪任务，不在复核中静默缩成单选。

## Files
src/curriculum/exploration/helpers.ts、graphic.ts、math.ts；src/domain/layer-visibility.ts；scripts内容回归/覆盖报告；specs/032-exploration-quality-audit下分族报告、来源边界、语音/UX证据；docs/CHANGELOG、TODO、curriculum-benchmark。

## Gates
Spec、计划与任务先于修复。保留启蒙数据与原完成事实；修复不改变原题含义/身份，若必须改答案含义另增revision。不保证儿童适龄性，也不声称未听音频已人工验收。跑必要build/curriculum/voice/tests，修改体验后mac:install及标准Applications真实app验证；本地dev提交，不推送。
本032先修已确认错误，与只读来源研究独立推进；报告汇总后单独在029运行Convergence，只追加剩余建设任务，期间不改业务代码。无extension hooks，仓库缺update-agent-context脚本，现有AGENTS原则不改。
