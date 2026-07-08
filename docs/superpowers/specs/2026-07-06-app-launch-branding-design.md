# App Launch Branding Design

## Goal

Make the installed Mac app visibly branded with a logo, and give the app a short child-friendly launch moment before the existing game page appears.

## Design

The Tauri bundle declares generated icon resources so macOS can use the app logo. The React app gets a first-load splash screen using the existing brand image. The splash runs the opening animation and transitions into the existing page without requiring a click. The original `speak("小小思考屋")` launch voice was superseded on 2026-07-08 by the dedicated brand audio described in `2026-07-08-launch-children-chorus-design.md`.

## Verification

The curriculum audit checks the icon configuration and splash source. Final verification rebuilds the web app, regenerates the NAS release, reinstalls the Mac app, validates the app signature, and does a short launch check.
