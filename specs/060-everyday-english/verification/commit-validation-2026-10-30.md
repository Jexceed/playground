# 060/061 提交前验证

用户于 2026-10-30 要求提交并推送。目标为 `origin/main`，验证前本地与远端均为 `8fb7e58cfcb8419a1a4a6e9b9e51bfac34ebc539`。本次提交包含完整的日常英语功能、六图女孩形象、语音、正式流程文件及对应验证资料。

## 回归范围修正

首次全量检查为 276/294 通过。除原有两项失败外，16 项历史快照检查仍把新英语题组计入原 1110 项比较范围。新增测试专用 `withoutEverydayEnglish`，只排除明确列出的三个题组、十二个活动身份和六个图库注册项；所有旧题字段、答案、修订号和原哈希继续受检查。该视图不改写生产目录、通用数据加载器或任何冻结基线。

额外的三项保护测试验证不修改输入、保留所有旧字段和未知新增内容，以及拒绝复用旧题身份或把无关图片塞入已批准的新图库 key。完整回归最终为 **295/297 通过**，无新增失败。

## 基线对照

用 `git archive 8fb7e58c` 在临时目录提取 `scripts/`、`src/`、`package.json` 和 `index.html`；依赖及未变动的历史规格/旧资源通过只读使用的软链接访问。对该源码快照运行相同的 `node --test scripts/*.test.mjs`，结果 **280/282 通过**。两边失败名称和断言原因相同：

1. `douyin-math-export.test.mjs`：导出文件中第一道数数题成功反馈仍为“1 个”，源题已明确为“1 个草莓”。
2. `order-story-completion.test.mjs`：注册表的两个别名指向同一张 soil-pot 图片；测试把含重复路径的数组与实际使用路径集合比较。

上述两项继续在 TODO 跟踪，本次没有改动抖音产物或削弱这两项断言。汇总见 [commit-validation.json](commit-validation.json)，测试输出见 [当前完整回归](commit-full-tests.txt) 与 [基线完整回归](commit-baseline-tests.txt)（仅去除行尾空白）。

## 其余验证

- `pnpm build`：通过，仅保留既有主包超过 500 kB 的 Vite 提示。
- `pnpm audit:curriculum`：118 组 / 1122 项，0 问题。
- `pnpm audit:illustrations`：0 问题。
- `pnpm audit:voice-media`：4397 文件，0 问题；脚本与 manifest 的 ID、文本和语言一致，failures=[]，无 macOS say 或 mixed local。
- `git diff --check`：通过。
- Mac 安装和逐图原生验收见 [061 验收](../../061-family-girl-character/verification/acceptance.md)。本轮新增修改仅为测试与文档，生产代码/图片/语音仍是已安装验收的内容，未重复安装。亲子试玩和人耳听音验收仍待进行。

没有执行 NAS、抖音或其他对外发布；提交推送与部署分别处理。
