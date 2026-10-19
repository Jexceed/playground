# Plan: Hands-on Bridge
Branch: dev; Date: 2026-10-19; Spec: spec.md

## Technical context
React19/TypeScript5.8/Vite/Tauri，复用本地小熊与精确SVG。无新依赖/图片生成/存储迁移。新增纯函数bridge-play.ts处理河段/材料身份/放置/判定，BridgePlayBoard.tsx负责大场景、可达按钮和运动；ProgressiveSetGame保持完成记录与导航，桥题走专用attempt分支。

## Constitution check
通过：直接操作服务于儿童比较与计划；状态与图义一致；同尺度不拉伸错误板；题目身份稳定；语音可审计；不以工程通过冒称儿童试玩通过。Spec/plan/tasks先于实施。无扩展hooks；项目无update-agent-context脚本，技术栈未变化。

## Design
720单位统一viewBox，河格与材料每格同宽；舞台占满中列。材料为独立索引（同长也不同），每段最多一块。支持>=gap即连通；第5题接受左右5/4与4/5。尚未摆满或太短不得调用onRoundComplete。错误保留摆放；下一题/重置清空本地状态。第一题点两端产生测量线，先后不限，非两岸组合不给正确完成。独立清空和重做当前题，原从头来改明确回第1题。动画仅在实际搭通后运行，重播不写进度。

## Verification
新增纯状态/几何/两解/重复材料/第一题组合回归及已有回归。pnpm export:voice-lines；标准Edge绝对Python增量生成与清理旧未引用媒体；pnpm build、audit:curriculum、audit:illustrations、audit:voice-media。浏览器8题实际点击（不是改React状态）成功失败全测；Mac安装后验证所有8题及当前题清空、改放、重播和续玩/完成数。文档与dev提交推送沿用会话授权。
