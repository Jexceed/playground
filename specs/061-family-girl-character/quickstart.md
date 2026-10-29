# Validation guide

1. 查看 logo 和六幅本地图，确认高马尾女孩身份与关键动作。
2. 运行 `pnpm export:voice-lines` 与 `pnpm generate:edge-voices -- --voice zh-CN-XiaoxiaoNeural --rate -12% --pitch +2Hz --python ./local-tts/.venv/bin/python --quiet --retries 3`。
3. 运行 `node --test scripts/everyday-english.test.mjs scripts/activity-language.test.mjs scripts/speech.test.mjs`、`pnpm build`、`pnpm audit:curriculum`、`pnpm audit:voice-media`，核对 manifest 与 voice-lines 一致。
4. 运行 `pnpm mac:install`，打开真实应用，依次进入三题组查看六场景及亲子对话，检查单句朗读；不替没有参加的孩子填写观察记录。
5. 在 verification/acceptance.md 记录通过项和任何未能执行的原生/儿童检查。
