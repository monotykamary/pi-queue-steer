# Changelog

## Unreleased

- Expand queued prompt templates and Agent Skills at delivery, with arguments, images, short aliases such as `/bro`, and full-batch restoration if expansion fails.
- Make command rows compaction-aware: idle `/compact` uses Pi's public compaction API, `/reload` waits for direct or automatic compaction to settle, and ordinary messages stay in Pi's native compaction queue.
- Preserve stable row IDs, lanes, attachments and pause state when committed rows cross a `/reload` runtime swap, including rows added after reload scheduling and repeated queued reloads.
- Keep image-bearing command text as a normal queued message so attachments are never discarded.
- Hold queued follow-ups while Pi decides whether an error, length stop or context overflow needs retry or automatic compaction.
- Restore and pause `/compact` when compaction cannot start, and restore only an unsent all-mode tail after a synchronous partial handoff failure.
- Leave RPC, JSON and print-mode input unchanged; queue ownership is TUI-only.
- Rebind editor guards across runtime reloads and capture command rows even while slash autocomplete is visible.
- Normalize native post-compaction input classification so whitespace and immediate hidden built-ins cannot strand queued rows.
- Add deterministic AgentSession retry coverage and a reproducible real-TUI evidence harness for manual/overflow compaction, abort recovery, native ordering, repeated reloads, resources and all-mode delivery.

- Add command rows: `/compact [instructions]` and `/reload` queue in FIFO position and execute only once the agent is idle, so rows behind them wait — e.g. a queued `continue` delivers after compaction completes.
- Queue a mid-run `Enter` on `/reload` instead of surfacing Pi's built-in "wait until the agent finishes" warning; mid-run `Enter` on `/compact` uses Pi's public compaction API and holds queued rows until compaction settles.
- Restore rows queued behind a `/reload` after the runtime swap.
- Execute idle `Option+Enter` command submissions instead of letting them reach the LLM as text.

- Add `Option+X` to mark the selected row for removal — deleted on save, restored by `Escape` or a second press, and finally covering image-only rows.
- Add `Option+T` to re-lane the selected row between steering and follow-up, previewing at its destination tail before the save commits it.
- Navigate row selection through the visual timeline so lane previews and `Option+Up`/`Option+Down` movement stay aligned.

- Show steering and follow-ups as separate lanes in one delivery-ordered timeline.
- Group the lanes into stacked blue and yellow boxes with aligned inline editing.
- Add a compact looping demo in the original GitHub Dark terminal treatment, starting on a populated screen.
- Keep steering rows editable until Pi's native turn boundary.
- Honour Pi's independent `one-at-a-time` and `all` modes at active-run delivery boundaries.
- Add `Option+Down` navigation and recency-first `Option+Up` selection.
- Pin edited heads so asynchronous delivery cannot consume a row under the cursor.
- Stash unrelated composer text and remove empty text-only rows on save.
- Pause both lanes after an abort and require an explicit empty `Enter` to resume.
- Feed follow-ups into Pi's native continuation queue to preserve transcript and run semantics.

## 0.1.0 — 2026-07-16

- Add a visible, session-local FIFO for queued Pi follow-ups.
- Add inline row editing with stable queue positions and rollback on Escape.
- Preserve image attachments, editor integrations, and failed dispatches.
- Compose with existing Pi custom editors while removing nested editor chrome from the active row.
