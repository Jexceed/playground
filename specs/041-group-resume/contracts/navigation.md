# User-facing navigation contract

- Launch returns to the last selected section, group and question.
- Selecting a previously visited group returns to its last visited question; a new group starts at question 1.
- Selecting the already visible group or theme does not clear the current answer/session.
- A theme's existing default group selection uses that group's saved question.
- Switching sections retains their independent locations and every group's memory.
- “从头来” deliberately moves the current group to question 1 and remembers that position.
- Persist location only; transient answers and observation phases follow existing fresh-entry behavior. Timed observations never resume midway or bypass readiness.
