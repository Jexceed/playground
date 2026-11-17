# 验证

1. 执行 plan.md 中相关测试命令，独立核对6/8/10人的九题条件；旧快照比较不得忽略答案变化。
2. `pnpm export:voice-lines`，再执行项目标准 `pnpm generate:edge-voices -- --voice zh-CN-XiaoxiaoNeural --rate -12% --pitch +2Hz --python ./local-tts/.venv/bin/python --quiet --retries 3`。
3. 按当前manifest备份/清理本次退役语音，运行 `pnpm build`、`pnpm audit:curriculum`、`pnpm audit:voice-media`。
4. `pnpm mac:install`，打开安装版检查队伍第1/2/3/4/7/9题，确认人数、箭头、绿色/蓝色编号、小兔交点、式子、听图解、放大与选择操作。保留已有完成记录。
5. 记录安装校验、真实截图与技术边界；更新CHANGELOG和TODO。儿童试玩与人耳发音评价另行记录。
