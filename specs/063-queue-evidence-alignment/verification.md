# 063 验证与安装

2026-11-14，main 本地交付。用户补充范围确认为探索数字岛；已有 062 的 Mac 首次点击修正和其他本地文档改动保留，没有提交或推送。

## 修正范围

核对探索数字岛 16 组 / 144 题的最终题库、实际组件与模型，记录见[逐组审查](reviews/math-consistency.md)。13 题有内容或呈现字段变化，见[精确清单](content-changes.json)：

- N09 九题：前三题画面与提示直接使用左起名次和后面人数，后六题区分左右名次与两组人数；选择指令改为总人数。
- N10 第 7–9 题：标明原来，在原有小块中划掉要拿走的一块，剩余数保持问号。放大图沿用同一模型。
- N05 第 6 题：10 加 7 已经有一个十，取消机械的凑十/拆成 0 和 7 文案。

全部 ID、答案、选项和进度结构保留。历史冻结快照未改；比较辅助函数先严格核对本次声明的新值，再还原声明字段。回归验证错误答案、未声明改值不会被隐藏。

## 自动验证

| 检查 | 结果 |
| --- | --- |
| `pnpm build` | 通过；保留既有大于 500 kB 的构建提示 |
| `pnpm audit:curriculum` | 118 组 / 1122 题，0 问题；启蒙 40 / 489，探索 78 / 633 |
| quickstart 中九个相关测试文件 | 59/59 通过 |
| N01–N08 独立语义审查 | 72 题，405 项断言通过；48 次可见图片引用，46 个独立图片 |
| N10–N16 独立算式/实际组件 SSR 审查 | 63 题通过；`--require-action-cue` 确认仅 N10 后三题各划去一块且不印答案 |
| N09 题干/渲染/算式/资源/历史边界回归 | 包含在 59 项测试中，九题全部覆盖 |
| `pnpm audit:voice-media` | 4405 条，0 问题 |
| `git diff --check` | 通过 |

运行命令和复跑方法见 [quickstart.md](quickstart.md)。没有把相关回归等同于整个历史测试套件。

## 语音

运行 `pnpm export:voice-lines`，再按项目默认参数生成 Edge Xiaoxiao 语音。本次新增 23 个 clip，15 个旧 clip 已备份至 `.tmp/063-retired-voice/` 并从运行目录清理。

脚本与 manifest 的 4405 个 ID、原文、locale、实际朗读输入和解码后的本地路径全部对齐，failures 为空。中文为 `zh-CN-XiaoxiaoNeural`，保留既有英文 `en-US-JennyNeural`；无 `macOS say + afconvert` 或 `mixed local`。见[对齐结果](verification/voice-alignment.json)与[退役资源清单](verification/retired-voice.json)。未把媒体审计当作人耳发音审查。

## Mac 安装与实际画面

`pnpm mac:install` 成功执行构建、签名、复制并刷新 `/Applications/小小思考屋.app`。退出旧进程后重新打开实际安装版完成检查。严格 deep 签名通过，安装可执行文件与构建产物 SHA-256 一致：

`f30d3490e958ff51199b1effaaf7edf691e8051499fb9887179dbc8dbb563a23`

见[安装产物校验](verification/installed-bundle.json)。实际检查包括：

- N09 第 1、2、4、7、9 题：当前窗口中三个阶段的图文对应、共同小兔的位置和数量标签正确；[首题](verification/native-n09-round1.png)、[左右名次](verification/native-n09-round4.png)、[两组人数](verification/native-n09-round7.png)。
- N09 首题单击 6 可选中，清空恢复未选；未提交答案，题组仍为 0/9 已做。
- N10 第 7、9 题及第 9 题放大图：原数量、单个划除标记、拿走一小块与问号均可见；[第7题](verification/native-n10-round7.png)、[第9题](verification/native-n10-round9.png)、[放大图](verification/native-n10-enlarged.png)。第 7 题单击 22 可选中，随后清空，题组仍为 0/9 已做。
- N05 第 6 题：题干为“10加7等于多少？”，一根十条与七个圆片对应；[原生画面](verification/native-n05-round6.png)。该组原有 3/9 已做未增加，之后恢复到进入检查前的第 1 题。
- N10 的续玩位置恢复到任务开始时的第 1 题；最终打开 N09 原有续玩的第 2 题，展示已修正的画面。未提交新完成记录或清除已有完成记录。

144 题是题库/模型语义覆盖，不是 144 次原生逐题试玩。其他主题、完整设备矩阵、人耳试听和真实儿童理解仍未全面验证，后续观察已写入 `docs/TODO.md`。
