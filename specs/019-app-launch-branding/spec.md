# Feature Specification: App Launch Branding

**Feature Branch**: `dev`

**Created**: 2026-07-06

**Status**: Draft

**Input**: User description: "App needs a logo; add a simple launch animation with voice, for example a child-like '小小思考屋', then enter the current page; review whether the packaging refactor left issues."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mac App Shows Brand Logo (Priority: P1)

As a parent installing the app on the current Mac, I want the installed app bundle to carry the 小小思考屋 logo so it looks like a real app in Finder and Launchpad.

**Why this priority**: The installed app currently has the product name but no bundle icon resource.

**Independent Test**: Build and install the Mac app, then inspect the bundle resources and `Info.plist` for icon configuration.

**Acceptance Scenarios**:

1. **Given** the app is built with Tauri, **When** the bundle is inspected, **Then** the app has icon resources and an icon declaration.
2. **Given** the app is copied to `/Applications`, **When** it is inspected, **Then** it remains signed and launchable.

---

### User Story 2 - Launch Splash With Voice (Priority: P2)

As a child and parent opening the app, I want a short, branded launch moment with logo animation and a spoken "小小思考屋", so entering the game feels intentional and warm.

**Why this priority**: The app should feel installable and child-friendly, not just a wrapped browser page.

**Independent Test**: Build the app and inspect source/audit checks proving a splash view, click-to-enter control, animation styles, and `speak("小小思考屋")` trigger exist.

**Acceptance Scenarios**:

1. **Given** the app first opens, **When** the splash screen is shown, **Then** the logo is visible with a simple animation and an enter button.
2. **Given** the user clicks the enter button, **When** audio APIs allow playback, **Then** the app speaks "小小思考屋" and transitions to the existing game page.
3. **Given** audio playback fails or is blocked, **When** the enter button is clicked, **Then** the app still enters the game page.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Tauri config MUST declare app icon resources.
- **FR-002**: The installed Mac app MUST be rebuilt and reinstalled after icon configuration changes.
- **FR-003**: The app MUST show a branded splash screen before the main game page in normal first-load flow.
- **FR-004**: Splash entry MUST be user-initiated so the "小小思考屋" voice has a browser/WebView gesture.
- **FR-005**: The splash MUST reuse the registered local brand logo image.
- **FR-006**: The splash voice MUST use the existing `speak` audio pipeline, with local voice assets preferred and TTS fallback.
- **FR-007**: If voice playback fails, the app MUST still enter the current game page.
- **FR-008**: Final verification MUST rerun build, curriculum audit, release tests, NAS release generation, and Mac install.

### Asset & Documentation Impact *(mandatory for this project)*

- **Assets**: Reuse existing brand image and generated Tauri icon assets; no new child-facing curriculum images.
- **Docs**: Update `docs/CHANGELOG.md` and relevant deployment docs if commands or packaging outcomes change.
- **Audit Coverage**: `pnpm audit:curriculum` must check app launch branding source and Tauri icon config.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `pnpm audit:curriculum` fails if the splash source or Tauri icon config is removed.
- **SC-002**: `pnpm mac:install` installs `/Applications/小小思考屋.app` with valid local signature.
- **SC-003**: The NAS release package still generates after splash changes.

## Assumptions

- Browser/WebView autoplay policy requires a user gesture before reliable voice playback, so the splash uses an explicit enter button.
- "Child-like" voice quality is approximated through the existing warm Mandarin voice pipeline in this phase; a dedicated child voice asset can be produced later if needed.
