# Implementation Plan: Paid iPad Launch

**Branch**: `dev` | **Date**: 2026-07-19 | **Spec**: [spec.md](./spec.md)

## Strategy

Build the revenue boundary before distribution:

1. Add a platform-neutral entitlement model with `starter`, `full`, `pending`,
   and `unavailable` states.
2. Add catalog access policy for exactly three starter games.
3. Add a parent area and adult-level parental gate.
4. Add one non-consumable StoreKit purchase plus Restore Purchases through a
   Tauri iOS plugin boundary.
5. Initialize and test the iOS/iPad target after full Xcode is installed.
6. Prepare App Store metadata, privacy answers, screenshots, review notes,
   pricing, and storefront selection.
7. Validate sandbox transactions, then TestFlight, then submit.
8. Measure completed purchases and proceeds from App Store Connect.

## Product Decisions

- Free-to-try, not fully free.
- Lifetime unlock, not subscription.
- Kids 5 and under + Education positioning, subject to App Review.
- No third-party ads or analytics.
- Local progress remains available without an account.
- Mainland China is a separate compliance gate, not assumed.

## Technical Boundaries

- React code owns catalog presentation, parental gate, and entitlement-aware UI.
- A typed purchase adapter owns platform status, products, purchase, and
  restore.
- The web/desktop development adapter may simulate states only in explicit
  development/test builds and must never grant a production entitlement.
- StoreKit is authoritative on iPad.
- No secret, receipt, or entitlement is hard-coded into the frontend bundle.

## Verification

- Unit tests for starter/full catalog access and parental gate state.
- Contract tests for purchase success, cancellation, pending, unavailable,
  failure, and restore.
- Existing build, curriculum, voice, speech, and release tests.
- Real iPad layout and touch review.
- StoreKit sandbox transaction matrix.
- TestFlight installation and fresh-device Restore Purchases.
- App Store Connect product and proceeds verification after launch.

