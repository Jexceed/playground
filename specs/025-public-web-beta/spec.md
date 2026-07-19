# Feature Specification: Public Web Beta

**Feature Branch**: `dev`

**Created**: 2026-07-19

**Status**: In progress

**Input**: User description: "先把小小思考屋发布到市场上，用最直接的方式获得真实家庭反馈。"

## User Scenarios & Testing

### User Story 1 - Open The Beta Without Installing (Priority: P1)

As a parent, I want to open 小小思考屋 from one public link on a phone,
tablet, Mac, or Windows computer so that I can try it with a child without
installing an unsigned desktop package.

**Independent Test**: Open the public project-pages URL on desktop and a
375x812 mobile viewport, wait for the launch screen to finish, and confirm the
game, images, and local voice manifest load from the deployed subpath.

### User Story 2 - Understand The Beta And Its Privacy Boundary (Priority: P2)

As a parent, I want a plain-language explanation of the product, supported
devices, beta status, and data behavior so that I can decide whether to let a
child use it.

**Independent Test**: Read the repository landing page and hosted privacy page
without opening source files, and confirm they explain that progress stays in
the current browser, no account is required, and no advertising or analytics
SDK is included.

### User Story 3 - Publish A Verified Build Repeatably (Priority: P3)

As a maintainer, I want a manual and main-branch GitHub Pages workflow so that
the public beta is built from a known revision and cannot silently skip the
project quality gates.

**Independent Test**: Inspect the workflow and run its local equivalents to
confirm locked dependency installation, public-web release tests, production
build, curriculum audit, voice audit, and Pages artifact deployment.

## Requirements

- **FR-001**: The first market release MUST be a public Web Beta that opens
  without installation on modern mobile and desktop browsers.
- **FR-002**: The deployed app MUST work below the repository subpath
  `/playground/`; images, launch audio, curriculum audio, icons, and built JS/CSS
  MUST NOT assume deployment at the domain root.
- **FR-003**: Local NAS and Tauri builds MUST retain their existing root-path
  behavior.
- **FR-004**: The deployment workflow MUST run `pnpm build`,
  `pnpm audit:curriculum`, `pnpm audit:voice-media`, and public-web release
  tests before deployment.
- **FR-005**: The public entry documentation MUST state the audience, beta
  status, supported devices, direct Web Beta URL, and desktop download option.
- **FR-006**: A hosted privacy notice MUST state what is and is not stored or
  transmitted by the application.
- **FR-007**: The first Web Beta MUST NOT add advertising, third-party analytics,
  child accounts, sign-in, payment, or cloud progress synchronization.
- **FR-008**: Publishing MUST remain a deliberate maintainer action: local
  preparation does not authorize pushing `dev`, merging to `main`, enabling
  GitHub Pages, or changing repository settings without confirmation.

## Success Criteria

- **SC-001**: A family can reach playable content from the public link in one
  browser navigation and no installer flow.
- **SC-002**: Desktop 1280x720 and mobile 375x812 checks show no horizontal
  overflow and no failed runtime images.
- **SC-003**: All 489 curriculum rounds and all 1,801 active local voice entries
  continue to pass their audits.
- **SC-004**: A Web Beta build under `/playground/` loads its HTML, JS, CSS,
  images, launch audio, and voice manifest without root-path 404s.
- **SC-005**: The public privacy notice is accessible at
  `/playground/privacy.html`.

## Assumptions

- GitHub Pages is the fastest first public channel because the repository and
  release pipeline already live on GitHub.
- Mac App Store, Microsoft Store, iOS App Store, Android stores, production code
  signing, payments, and automatic updates are later distribution phases.
- Initial learning feedback is collected manually; privacy-invasive analytics
  are intentionally excluded from this beta.

