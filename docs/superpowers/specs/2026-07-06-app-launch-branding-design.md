# App Launch Branding Design

## Goal

Make the installed Mac app visibly branded with a logo, and give the app a short child-friendly launch moment before the existing game page appears.

## Design

The Tauri bundle declares generated icon resources so macOS can use the app logo. The React app gets a first-load splash screen using the existing brand image. The splash automatically attempts `speak("小小思考屋")`, runs the opening animation, and transitions into the existing page without requiring a click. If autoplay policy blocks audio, the transition still completes.

## Verification

The curriculum audit checks the icon configuration and splash source. Final verification rebuilds the web app, regenerates the NAS release, reinstalls the Mac app, validates the app signature, and does a short launch check.
