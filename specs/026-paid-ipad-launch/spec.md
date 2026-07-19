# Feature Specification: Paid iPad Launch

**Feature Branch**: `dev`

**Created**: 2026-07-19

**Status**: Proposed

**Input**: User correction: "主要的是要盈利，随便发布没有意义。"

## Product Goal

Turn 小小思考屋 into a product that can complete real paid transactions from
parents. Public availability, free downloads, and GitHub traffic are not launch
success unless they lead to verified App Store proceeds.

## User Scenarios

### User Story 1 - Try Enough To Trust The Product (Priority: P1)

As a parent, I can play one complete game from each world with my child before
buying, so I can judge instruction clarity, child engagement, and difficulty
without receiving the entire catalog for free.

**Acceptance scenarios**:

1. The starter includes 数一数, 找规律火车, and 影子配对 in full.
2. Other games remain visible as part of the product but cannot be opened
   without the full entitlement.
3. Locked games explain their value to the parent without pressuring the child.

### User Story 2 - Buy Once In A Parent Area (Priority: P1)

As a parent, I can pass an adult-level parental gate and make one App Store
purchase that permanently unlocks all current games.

**Acceptance scenarios**:

1. No price, external link, or purchase control appears in the child play
   surface.
2. The parent area states the exact local App Store price, lifetime scope, no
   subscription, no ads, and local-data behavior before purchase.
3. A successful non-consumable StoreKit transaction changes the entitlement to
   full access without restarting the app.
4. Cancellation, pending approval, offline state, and transaction failure leave
   the starter usable and show a plain-language parent message.

### User Story 3 - Restore A Paid Family Purchase (Priority: P1)

As a parent, I can use Restore Purchases to recover the full entitlement on an
eligible device using the same App Store account.

**Acceptance scenarios**:

1. Restore Purchases is available only in the parent area.
2. A successful restore unlocks the full catalog.
3. A restore with no matching purchase does not claim success.

### User Story 4 - Make A Safe Kids Purchase Surface (Priority: P2)

As a parent, I can trust that the app has no ads, no third-party child
analytics, and no accidental outbound or purchase actions.

**Acceptance scenarios**:

1. All purchasing and outbound links require a parental gate.
2. The app does not collect child identity, location, microphone, photos, or
   contacts.
3. The privacy policy and App Privacy answers match actual runtime behavior.

### User Story 5 - Measure Revenue, Not Exposure (Priority: P2)

As the publisher, I can use App Store Connect transaction and proceeds reports
to determine whether unrelated families paid for the product.

**Acceptance scenarios**:

1. The launch report separates free downloads, promo codes, completed paid
   transactions, refunds, and proceeds.
2. The first proof milestone is 10 completed purchases from unrelated families.
3. The 100-family checkpoint reports proceeds, taxes/adjustments, refunds, and
   price by storefront.

## Functional Requirements

- **FR-001**: The paid launch MUST target iPad through the App Store.
- **FR-002**: The free starter MUST include exactly one complete game per world:
  `math-counting-cardinality`, `logic-pattern-train`, and
  `graphic-shadow-match`.
- **FR-003**: Full access MUST be represented by a durable entitlement, never by
  a hidden development flag in production.
- **FR-004**: Version 1.0 MUST use one non-consumable lifetime unlock and MUST
  NOT use an auto-renewable subscription.
- **FR-005**: Purchase and Restore Purchases MUST use Apple's supported StoreKit
  path for digital functionality consumed in the app.
- **FR-006**: Purchase controls, price, restore, privacy links, and outbound
  links MUST be placed behind a parental gate.
- **FR-007**: The Kids build MUST contain no advertising SDK or third-party
  analytics SDK.
- **FR-008**: The full catalog MUST remain usable offline after a verified
  entitlement has been cached according to StoreKit guidance.
- **FR-009**: Failed, cancelled, pending, or unavailable purchases MUST NOT
  remove starter access or falsely unlock the catalog.
- **FR-010**: App Store metadata MUST describe a parent-child thinking product,
  show real gameplay, state the lifetime unlock clearly, and avoid unsupported
  learning-outcome claims.
- **FR-011**: Mainland China MUST remain disabled until the publishing entity
  confirms and supplies every applicable filing or approval.
- **FR-012**: GitHub Pages MUST NOT automatically publish the fully unlocked
  product.

## Pricing And Success Criteria

- Launch price hypothesis: CNY 68 or equivalent local storefront price.
- **SC-001**: A sandbox account can buy, cancel, fail, leave pending, and restore
  the non-consumable entitlement with correct UI state.
- **SC-002**: Every locked game is inaccessible without entitlement; all three
  starter games remain completely playable.
- **SC-003**: The App Store review build passes project curriculum and voice
  audits and real-device iPad testing.
- **SC-004**: The first commercial proof is 10 completed purchases from
  unrelated families.
- **SC-005**: The first viability checkpoint is 100 paid families, with net
  proceeds and refunds reported from App Store Connect.

## Dependencies Outside The Repository

- Full Xcode installation.
- Apple Developer Program membership and Paid Apps agreement.
- App identifier, signing certificate, provisioning, App Store Connect app, and
  non-consumable product.
- Storefront and Mainland China compliance decision by the publishing entity.

