# Contributor guidance

## Commands

- Install dependencies: `npm install`
- Type-check: `npm run check`
- Test: `npm test`
- Full verification: `npm run ci`

## Invariants

- Use Pi's public extension APIs; do not patch Pi core.
- Keep queue state and edit drafts session-local and out of the transcript.
- Preserve FIFO order, stable item IDs, image attachments, and failed-dispatch restoration.
- Preserve configured Pi keybindings by matching action IDs rather than hard-coded escape sequences.
- Compose with previously installed custom editors and retain their input behavior.
- Treat row edits as snapshots: save in place; Escape rolls back the entire editing session, including removal marks and lane toggles.
- Row saves never change delivery lanes implicitly; only the explicit lane toggle re-lanes a row, to the destination tail, on save.
- Active-run dispatch pauses only when the oldest row has an unsaved edit or while Pi is compacting; submissions typed during a compaction window are captured at the editor into the queue (Pi core emits no input events then), and the window must always close — via `session_compact`, its abort signal, a fresh input event, or its age cap.
- `Option+Enter` submissions typed while the agent is stopped queue into the follow-up lane, paused, and send on an explicit empty-composer `Enter`; plain `Enter`, `/…` commands and `!` bash keep passing straight to Pi.

Keep tests close to these invariants and visually verify TUI changes in a real Pi session.
