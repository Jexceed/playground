# 062–065 提交前验证

2026-11-17，用户要求提交并推送到 `origin/main`。获取远端后，原始本地 HEAD 与远端 main 均为 `29163411`，无分叉或待整合远端提交。

本次保存此前已完成的 Mac 首次点击修复、数字岛条件/图解修正、完整队伍计数、头像框与毛色资源，以及配套本地语音和规格证据。按原生输入与数字岛教学呈现分成两次提交；不发布或部署其他平台。

## 本次新跑的检查

| 项目 | 结果 |
| --- | --- |
| `pnpm build` | 通过；保留既有500kB产物提示 |
| `pnpm audit:curriculum` | 118组 / 1122题，0问题 |
| `pnpm audit:voice-media` | 4411条，0问题 |
| 9个相关回归文件 | 69/69通过 |
| `git diff --check` | 通过 |

测试文件为 `queue-evidence`、`math-evidence`、`exploration-presentation`、`visible-activity-assets`、`curriculum-review-invariants`、`activity-progress`、`activity-framework`、`round-speech-navigation` 和 `desktop-release`，均位于 `scripts/`，扩展名 `.test.mjs`。

本次没有修改运行时代码或媒体，不重复安装或重做原生UI操作。已核对 `/Applications/小小思考屋.app` 的严格deep签名及可执行文件摘要，与065交付安装记录一致。此前6/8/10位普通与放大视图的实际检查见[065验收](verification.md)。完整历史套件、其他设备与儿童试玩不计为本次通过范围。

[结构化检查记录](verification/commit-checks-20261117.json)。
