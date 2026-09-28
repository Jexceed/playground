# Data and state

GameConfig / GameRound keep stable group and round IDs, choices' semantic values, answer, local visual evidence and educational explanation. Preserve the original ID set and storage schema.

Observation state: ready → observing → answering → answered. Entering or revisiting a timed round starts ready; explicit start reveals briefly, then hides. An explicit second glance clears the pending selection and starts a new observation; interruption returns to readiness. Interrupted timed observation returns to ready. Memory-camera observation uses manual hiding. No selection or submission while a gated observation is visible.

Completion is based on actual completed round IDs, not round ordinal. Navigating to the final round does not complete skipped rounds or claim their ability tags. Historical facts remain unchanged.

Review ledger records group ID, round count, review surfaces, findings, disposition and evidence. A pending group cannot count as verified. Baseline hashes/IDs protect exploration and legacy identity.
