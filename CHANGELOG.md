# Changelog

## Unreleased

### Added

- Reorder the selected row within its lane while editing with `Option+Shift+Up` and `Option+Shift+Down`. Positions keep stable row IDs and attachments, apply to dispatch order immediately and roll back with the rest of the editing session on `Escape`.
- Queue `Option+Enter` submissions while the agent is stopped: they land in the follow-up lane, paused, and an empty-composer `Enter` sends the next row. Skill and prompt-template invocations such as `/bro simplify this` park the same way and autoexpand when reached. Plain `Enter` keeps Pi's immediate send, and Pi built-ins, extension commands, unknown slash input and `!` bash pass straight through.
- Add `/queue-drain` to empty both lanes into the run as steering, in timeline order. Command rows stay queued, a drain during row editing is refused, and an idle drain starts the run with the head row and steers the rest at the first turn.

## 0.2.0 - 2026-08-09

### Added

- Add independent steering and follow-up lanes in one delivery-ordered timeline, with stacked blue and yellow boxes and a compact looping demo.
- Add multi-row inline editing with visual navigation, stable row IDs, snapshot rollback, empty-row removal, image-only row support, safe head pinning and composer-draft restoration.
- Add `Option+X` removal marks and `Option+T` lane toggles, including destination previews and explicit save semantics.
- Add FIFO command rows for text-only `/compact [instructions]` and `/reload`; image-bearing matches remain normal messages so attachments are preserved.
- Expand queued prompt templates and Agent Skills at delivery, including arguments, images and non-shadowing short aliases such as `/bro`; unsupported extension commands pause for editing or removal.

### Changed

- Preserve Pi's native steering and continuation timing, independent `one-at-a-time` and `all` modes, normal transcript entries and explicit pause/resume after aborts.
- Coordinate command rows with manual and automatic compaction, retries and Pi-native post-compaction input. Native queued input can run before extension-owned command rows after compaction completes.
- Queue busy `/reload` submissions rather than surfacing Pi's wait warning, and hold `/reload` until direct or automatic compaction settles.
- Preserve committed row IDs, lanes, attachments and pause state across direct and repeated `/reload` runtime swaps, including rows added after reload scheduling. Unsaved edit drafts do not cross reload.
- Keep queue ownership TUI-only so RPC, JSON and print-mode input remain unchanged.
- Keep Pi package ranges unpinned so compatibility validation follows current Pi releases.

### Fixed

- Hold follow-ups while Pi decides whether errors, length stops or context overflows require retry or automatic compaction.
- Restore and pause `/compact` when compaction cannot start, restore expansion failures without reordering and restore only the unsent all-mode tail after a synchronous partial handoff failure.
- Rebind editor guards across runtime reloads, capture command rows while slash autocomplete is visible and normalize native-input classification so hidden or whitespace input cannot strand queued rows.

### Validation

- Add 81 automated tests plus a reproducible real-TUI evidence harness for manual and overflow compaction, abort recovery, native ordering, repeated reloads, resource expansion and all-mode delivery.

## 0.1.0 — 2026-07-16

- Add a visible, session-local FIFO for queued Pi follow-ups.
- Add inline row editing with stable queue positions and rollback on Escape.
- Preserve image attachments, editor integrations, and failed dispatches.
- Compose with existing Pi custom editors while removing nested editor chrome from the active row.
