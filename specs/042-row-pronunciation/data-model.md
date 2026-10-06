# Speech data

A voice line retains id, kind, text, locale, contexts and gains optional spokenText when pronunciation input differs. A manifest entry repeats spokenText for audit; its text stays the runtime key. The field is not rendered as product text.

Corrected clip filenames include a hash of effective spoken text and voice parameters. Ordinary entries preserve their existing paths. The audit compares current expected spokenText with both exporter and manifest metadata, preventing stale clips from silently passing when rules change.
