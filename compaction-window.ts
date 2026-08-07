/**
 * Tracks whether Pi is compacting (manual `/compact`, threshold, or overflow).
 *
 * Pi core queues interactive submissions privately while `session.isCompacting`
 * and never emits the extension `input` event, showing its native queue UI
 * instead. The extension uses this window to capture Enter/Alt+Enter at the
 * editor so rows stay editable here, and to hold dispatch until Pi settles.
 *
 * `session_compact` closes successful windows and the before-event abort
 * signal closes cancelled ones, but a failed manual compaction surfaces no
 * extension-visible end event. The window therefore closes itself after
 * `maxAgeMs` as a backstop so a stale window can never wedge the queue.
 */
export class CompactionWindow {
	private openedAt: number | undefined;
	private readonly maxAgeMs: number;

	constructor(maxAgeMs: number) {
		this.maxAgeMs = maxAgeMs;
	}

	begin(now: number = Date.now()): void {
		this.openedAt = now;
	}

	/** Close the window. Returns whether a window was open. */
	end(): boolean {
		const wasOpen = this.openedAt !== undefined;
		this.openedAt = undefined;
		return wasOpen;
	}

	/** Open windows expire after `maxAgeMs` and stay closed. */
	isActive(now: number = Date.now()): boolean {
		if (this.openedAt === undefined) return false;
		if (now - this.openedAt >= this.maxAgeMs) {
			this.openedAt = undefined;
			return false;
		}
		return true;
	}
}
