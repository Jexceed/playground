# 2026-10-26 提交检查点

按用户“当前代码仓的修改提交并推送”要求保存 053–059 当前阶段成果。基线为 `014a56a320a96d1fa22fa5402801dd88ab492aa8`；提交前 fetch 确认本地 main 与 origin/main 一致。059 全应用逐章审查尚未完成，剩余 91 组及亲子试玩继续保留在原任务与 TODO 中。

## 当前验证

| 检查 | 结果 |
| --- | --- |
| `pnpm export:voice-lines` | 重新导出 4287 条；逐 ID、文字、locale 与 manifest 一致 |
| `pnpm build` | 通过；Vite 保留主 JS 超过 500 kB 的体积提示 |
| `pnpm audit:curriculum` | 115 组 / 1110 题，0 问题 |
| `pnpm audit:illustrations` | 18 图集 / 74 帧，全部被引用，0 问题 |
| `pnpm audit:voice-media` | 4287/4287，0 问题；manifest.failures 为空 |
| `node --test scripts/*.test.mjs` | 282 项中 280 项通过，2 项既有失败，见下文 |
| `pnpm mac:install` | 构建、签名和安装通过，已更新 `/Applications/小小思考屋.app` |
| `codesign --verify --deep --strict` | 已安装应用通过；可执行文件 SHA-256 与构建产物一致 |

语音 provider 为 `edge-tts Python package`，中文使用 `zh-CN-XiaoxiaoNeural`；不存在 `macOS say + afconvert` 或 `mixed local`。英文听力保留现有 `en-US-JennyNeural`。

安装后重新启动真实应用，恢复至探索 → 语言花园 → 词语有朋友第 1 题，仍显示 1/9 已做。打开“高”的本地风筝大图并返回，图片与控件正常；没有提交答案或更改完成记录。本次仅做提交前启动、资源和位置恢复抽查，不增加全章节验收覆盖率。

安装可执行文件 SHA-256：`4ca3a0c6430e64e56171370d287b372644d797719b5f59a218c408317050c397`。

## 已复现的基线失败

将 `014a56a3` 的 `src/`、`scripts/` 和 `package.json` 导出到忽略目录，复用未修改的既有资源和历史验证记录，运行相同的两个失败测试。两项均以相同断言失败，未在本次提交中修改产品代码或测试来规避它们。

1. `scripts/douyin-math-export.test.mjs:8`：已生成的抖音题库首题反馈为“对，最后数到 1，所以一共有 1 个。”，源题库为“对，最后数到 1，所以一共有 1 个草莓。”；需单独同步导出产物。
2. `scripts/order-story-completion.test.mjs:54`：图片使用集合已去重，但注册列表中两个别名指向 `order-045-plant-soil.png`，造成比较时重复计数；需按唯一资源路径检查覆盖。

原始命令日志和基线复现文件保存在本地忽略目录 `.tmp/commit-20261026/`。以上两项已加入 `docs/TODO.md`；本次不将全量回归标记为全部通过。
