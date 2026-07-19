# Revenue Model And First Paid Launch

## Commercial Decision

The first paid channel is the iPad App Store, not GitHub Pages and not an
unsigned desktop download.

The product is designed for a four-year-old and a parent to play together.
iPad gives that family a familiar touch device, a trusted purchase surface,
Ask to Buy, StoreKit purchase restoration, and a Kids/Education discovery
surface. The existing responsive React experience can be reused through Tauri
iOS, but it must become an app-like paid product rather than a repackaged
website.

## Offer

- Free starter: one complete game in each world.
  - 数字岛：数一数
  - 逻辑屋：找规律火车
  - 图形工坊：影子配对
- Full unlock: all 40 games and 489 rounds.
- Launch price hypothesis: CNY 68 in Mainland China if eligible, with equivalent
  local pricing in other storefronts.
- Purchase type: one non-consumable lifetime unlock.
- No subscription in version 1.0. A recurring fee is not justified until the
  product has a reliable recurring content cadence.
- No ads, account requirement, or child-facing external purchase links.

The ¥68 hypothesis is anchored by current App Store offers rather than by the
amount of engineering work:

- Bimi Boo lists a comparable preschool full unlock at ¥68:
  https://apps.apple.com/cn/app/id1052704329
- 脑力大冒险 lists a Pro upgrade at ¥98:
  https://apps.apple.com/cn/app/id1493167435
- Thinkrolls 1 sells 207 levels for USD 5.99:
  https://apps.apple.com/us/app/id917176209

The product should earn a higher price later only after parent-visible session
planning, progress explanations, stronger art consistency, and proven repeat
use justify it.

## Unit Economics

Apple Developer Program membership costs USD 99 per year. For qualifying
developers, Apple's Small Business Program commission is 15% in most
storefronts. Apple announced a 12% rate for qualifying paid app and In-App
Purchase transactions in the Mainland China iOS/iPadOS storefront beginning
March 15, 2026.

At a CNY 68 price and 12% commission, proceeds are approximately CNY 59.84 per
purchase before tax, refunds, currency effects, and other adjustments:

```text
68 × (1 - 0.12) = 59.84
```

Commercial milestones:

1. First proof: 10 completed purchases from unrelated families.
2. Initial signal: 30 paid families and at least CNY 1,795 in proceeds before
   tax and adjustments.
3. Viability checkpoint: 100 paid families and approximately CNY 5,984 in
   proceeds before tax and adjustments.
4. Do not call free downloads, testers, redeemed promo codes, or page views
   revenue validation.

## Funnel

1. Parent finds the App Store product page.
2. Parent installs the free starter.
3. Parent and child finish at least one complete starter game.
4. A parent-only area explains the remaining 37 games, privacy, price, and
   lifetime access.
5. An adult passes a parental gate and starts the App Store purchase.
6. StoreKit confirms the non-consumable entitlement locally.
7. Restore Purchases recovers the entitlement on another eligible device.

The child surface must never display price pressure, countdowns, loot boxes,
streak loss, or manipulative purchase prompts.

## Distribution And Compliance Gates

- Kids category target: age band 5 and under, primary category Education.
- External links and purchase opportunities must be behind a parental gate.
- No third-party advertising or analytics SDK in the Kids build.
- A privacy policy, App Privacy answers, screenshots of real gameplay, review
  notes, and a fully functioning purchase are required before review.
- Mainland China availability is not automatic. Apple states that some apps
  require a valid ICP filing and games require an approval number. The
  publishing entity must confirm the correct classification and documents
  before enabling that storefront.
- If Mainland China eligibility is not ready, the first paid release can target
  other storefronts with Chinese-speaking families while the filing track
  continues. This is a commercial sequencing decision, not a compliance
  workaround.

## Current Readiness

Ready:

- 40 games, 489 rounds, three worlds.
- 1,801 audited local Mandarin voice entries.
- Mobile-width browser layout already works at 375×812.
- No account, advertising SDK, third-party analytics SDK, or cloud child data.
- Local privacy notice exists.

Not ready:

- Full Xcode is not installed; only Command Line Tools are present.
- No valid Apple code-signing identity is installed.
- Apple Developer Program and Paid Apps agreement status are unknown.
- No iOS target, StoreKit entitlement provider, parental gate, paywall, Restore
  Purchases, sandbox transaction test, TestFlight build, or App Store listing.
- Mainland China filing and game-approval classification are unresolved.

## Sources

- Apple Developer Program membership and commissions:
  https://developer.apple.com/programs/whats-included/
- App Store Small Business Program:
  https://developer.apple.com/app-store/small-business-program/
- Kids Category and parental gates:
  https://developer.apple.com/app-store/review/guidelines/
- China storefront commission change:
  https://developer.apple.com/news/?id=dadukodv
- Mainland China compliance information:
  https://developer.apple.com/help/app-store-connect/reference/app-information/app-information
- Tauri distribution:
  https://v2.tauri.app/distribute/
