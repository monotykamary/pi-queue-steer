# Compaction and reload validation

This document records the deterministic validation matrix for compaction-aware command rows. The implementation remains extension-only and uses public Pi extension APIs.

## Automated suite

The Pi package ranges are intentionally unpinned. The lockfile records the versions used for a reproducible checkout, but the package manifest does not declare an artificial Pi compatibility target.

Run the resolved dependency set:

```bash
npm ci --ignore-scripts
npm run ci
```

Refresh to the current Pi packages before compatibility review:

```bash
npm update --ignore-scripts \
  @earendil-works/pi-ai \
  @earendil-works/pi-coding-agent \
  @earendil-works/pi-tui
npm run ci
```

The suite covers queue/edit invariants, command classification, images, one-at-a-time and all-mode delivery, synchronous partial handoff restoration, non-TUI pass-through, prompt and Skill expansion, manual compaction success/failure, automatic overflow compaction, retry ordering, repeated reload restoration, and compaction/native-input ordering.

Latest result with Pi 0.84.1: 81 tests passed.

## Real TUI evidence

`test/tui-evidence.sh` starts the real Pi 0.84.1 TUI under tmux with a deterministic faux provider. It uses actual terminal key sequences, public compaction lifecycle events, public provider registration, actual runtime reloads, and Pi's real native compaction queue.

Run:

```bash
./test/tui-evidence.sh /tmp/pi-queue-tui-evidence
```

The output directory contains plain terminal captures, provider-call logs, lifecycle-event logs, and runtime-initialization logs. Run it immediately before review so `summary.txt` records the exact Pi version, commit and working-tree state under test. A release evidence run should report `working tree: clean`.

The latest complete run reported:

```text
pi: 0.84.1
commit: <reviewed commit>
working tree: clean
manual events: {"event":"session_before_compact","reason":"manual"} {"event":"session_before_compact","reason":"manual"}
overflow events: {"event":"session_before_compact","reason":"overflow"} {"event":"session_before_compact","reason":"threshold"}
runtime initializations across two queued reloads: 3
captures: abort-paused, manual-reload-resources, native-before-command, automatic-overflow, all-mode
```

The three runtime initializations are the initial load plus two queued `/reload` rows. The final queued message ran after both reloads.

The semantic capture excerpts were:

```text
[compaction]
Compacted from 798 tokens
FAUX RESPONSE: after manual compaction

Error: Compaction failed: Summarization failed: synthetic TUI summary failure
FAUX RESPONSE: after failed compaction

Operation aborted
follow-ups (1) · paused
enter resume · option+up edit · escape keep paused
FAUX RESPONSE: after abort resume

Reloaded keybindings, extensions, skills, prompts, themes, and context files
FAUX RESPONSE: after repeated reload

PROMPT EXPANDED: first=alpha all=alpha beta default=fallback
[skill] bro
FAUX RESPONSE: <skill name="bro" ...>
```

The native post-compaction ordering capture showed the ordinary native message finishing before the extension-owned command, and `/reload` never reached the model:

```text
[compaction]
Compacted from 785 tokens
ordinary native during compaction
FAUX RESPONSE: ordinary native during compaction
Reloaded keybindings, extensions, skills, prompts, themes, and context files
```

The overflow event log recorded `reason: "overflow"`, the TUI rendered a compaction entry, and `overflow-provider-calls.jsonl` proved the queued follow-up completed exactly once. `all-mode-provider-calls.jsonl` proved all three rows reached Pi exactly once in FIFO order; the all-mode capture rendered them together before the final response.

## Public API boundary

`ExtensionAPI.sendUserMessage` and the TUI editor submit callback return `void`. The extension can restore synchronous handoff failures and preflight/expansion failures, but it cannot prove every later asynchronous acceptance or rejection without risking duplicate delivery. Queued `/reload` likewise has no result channel. These limits are documented in the README and are not hidden by timing heuristics.
