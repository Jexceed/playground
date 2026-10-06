# Audio contract

- Row meaning (第一行, 第3行, A行, 每行, 行列) is pronounced hang2; xing meanings stay unchanged.
- The visible/accessible question text and original-text audio lookup do not change.
- A corrected Chinese line gets an auditable spokenText and a new local URL. Locale-specific English is not rewritten.
- Browser fallback and optional segmented rendering use the same preparation rules. Chunking cannot split away the context before pronunciation is decided.
- Preserve playback cancellation/navigation and required-listening success gates.
