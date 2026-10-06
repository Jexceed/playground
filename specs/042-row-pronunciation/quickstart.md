# Validation

1. Run focused pronunciation and speech tests, including original lookup, no-local/error fallback, preserved words, cache identity and all current row contexts.
2. Run pnpm export:voice-lines; inspect the complete before/after row ledger. Generate using pnpm generate:edge-voices -- --voice zh-CN-XiaoxiaoNeural --rate -12% --pitch +2Hz --python /Users/chiang/Documents/Projects/playground/local-tts/.venv/bin/python --quiet --retries 3.
3. Prune only unreferenced runtime files with pnpm prune:voice-assets -- --write. Run pnpm audit:voice-media and pnpm audit:curriculum; confirm matching 4043 lines, no failures or mixed/macOS fallback.
4. Save representative actual clips (numeric/letter rows and an unchanged xing control) for audition. Record exactly what could be heard/verified.
5. Run pnpm mac:install (includes build), verify installed hash/signature, reopen the actual app and exercise a representative row-related question's listening control. Preserve progress and restore the original entry.
