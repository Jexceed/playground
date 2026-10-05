# Research: group resume

- Decision: keep one navigation store, upgrade it to schema 2 with per-group stable locations. Existing locations already preserve launch/section state, but App.chooseGame/chooseWorld explicitly reset the index. Reusing this store avoids parallel competing defaults.
- Decision: migrate valid schema 1 and seed old stable/index locations without touching completion keys. Unknown or malformed stored versions remain read-only, following the existing protection behavior.
- Decision: remember the last visited question, including a deliberate jump or reset. Inferring the next incomplete question from completion facts would not reproduce the user's stopping point.
- Decision: initialize ProgressiveSetGame's state from its requested index; the component is already keyed by game.id in App. The current first-round initial state and game-id reset effect can briefly show the wrong evidence before synchronization.
- Alternatives: a separate localStorage key per game complicates migration; answer-draft persistence and theme-level last-group memory are outside this request.
