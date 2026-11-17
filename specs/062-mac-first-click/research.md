# Research

## Confirmed decision

- Decision: Enable `acceptFirstMouse` for the existing Tauri main window.
- Rationale: The installed wrapper uses `tauri::generate_context!()` with no window override. Its source configuration omits the setting. The installed CLI schema describes it as permitting a click on an inactive macOS window to also reach the webview, with default false. The locally resolved Wry 0.55.1 implementation returns this field from its `acceptsFirstMouse:` override.
- Sources: `src-tauri/src/main.rs`, `src-tauri/tauri.conf.json`, `node_modules/@tauri-apps/cli/config.schema.json`; local Cargo registry `wry-0.55.1/src/wkwebview/class/wry_web_view.rs` and `tauri-2.11.5/src/webview/webview_window.rs`.
- Alternatives: Rebinding every button to pointerdown/pointerup or synthesizing a second click would interfere with native click/keyboard/drag semantics and does not address a click discarded before reaching the page.

## Findings and limits

- Exploration single-choice and submit controls already use `onClick`; no double-click handlers were found in `src/`.
- Prior real Mac checks selected an answer in 数量结构屋 and 移一移比多少 with one click, and submitted 数量结构屋 with one click. A short movement within the numeric answer also selected it.
- Image readiness disables editing until required media load; answering does not wait for narration to finish. No proof of a stuck ready state was found in the reported examples.
- Local exploration progress is about 70 KB in WebKit storage, not evidence of an oversized progress history blocking all input.
- Automation may bring the target app to the foreground before sending input. A successful automated app-switch/click does not independently establish inactive-window click-through behavior.
- This finding is a concrete focus-related cause, not a reproduced explanation of every occurrence reported by the user.

## Workflow

No extension hooks file exists. The current checkout has no `update-agent-context.sh`; existing AGENTS guidance already covers the unchanged stack and is preserved. The user-provided main-branch instruction overrides the historical constitution's dev-branch sentence.
