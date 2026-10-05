# Navigation model

CurriculumNavigation schemaVersion 2 retains activeSectionId and locations (last CatalogLocation for each section), and adds gameLocations: Record<gameId, CatalogLocation>. A location has schemaVersion 1, worldId, gameId and roundId. Catalog IDs determine section ownership and the resolved current index.

Read migration: initialize valid defaults → seed valid previous index/stable locations → read schema 1 or 2 → normalize known per-group entries → make saved section positions authoritative for their current groups. Reading is side-effect free. Saving valid schema 1 upgrades to 2; unknown/future/malformed raw data is not overwritten. Invalid/removed groups cannot cross section boundaries; a removed round falls back within its known group.

Visit a question: update its gameLocations entry and that section's location; keep all other group/section entries. Explicit reset is an ordinary visit to round 1. Completion and practice evidence are separate stores and are never mutated by navigation.
