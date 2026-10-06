# Pronunciation decision

- Existing Edge CLI takes plain text and caches by line ID; changing only generation rules would otherwise reuse the old MP3.
- Upstream [edge-tts Custom SSML documentation](https://github.com/rany2/edge-tts#custom-ssml) states that custom SSML is unsupported. Do not inject unsupported phoneme/lexicon markup or switch the user's standard provider.
- Use the unambiguous homophone 航 (háng) only in internal speech input for reviewed row contexts. Display and lookup text retain 行. First generate a short sample with the standard voice; keep an explicit original/spoken mapping for audit.
- Use targeted positive row-context matches, not a blanket 行 substitution. Preserve ordinary xing words even when they occur in the same sentence as a row reference.
- Fingerprint changed synthesis input in the resource filename to invalidate both generator reuse and app/browser caches. Keep original asset filenames for unchanged speech.
