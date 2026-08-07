import assert from "node:assert/strict";
import test from "node:test";
import { CompactionWindow } from "../compaction-window.ts";

test("window is closed until begun", () => {
	const window = new CompactionWindow(60_000);
	assert.equal(window.isActive(1_000), false);
	assert.equal(window.end(), false);
});

test("begin opens the window and end closes it", () => {
	const window = new CompactionWindow(60_000);
	window.begin(1_000);
	assert.equal(window.isActive(1_500), true);
	assert.equal(window.end(), true);
	assert.equal(window.isActive(2_000), false);
	assert.equal(window.end(), false);
});

test("reopening restarts the age clock", () => {
	const window = new CompactionWindow(60_000);
	window.begin(1_000);
	window.begin(70_000);
	assert.equal(window.isActive(129_999), true);
	assert.equal(window.isActive(130_000), false);
});

test("a stale window closes itself and stays closed", () => {
	const window = new CompactionWindow(60_000);
	window.begin(1_000);
	assert.equal(window.isActive(61_000), false);
	assert.equal(window.isActive(62_000), false);
	window.begin(200_000);
	assert.equal(window.isActive(201_000), true);
});
