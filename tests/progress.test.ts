import assert from "node:assert/strict";
import test from "node:test";
import { clampProgress, progressLabel } from "../lib/animation/progress";

test("clampProgress constrains invalid and out-of-range values", () => {
  assert.equal(clampProgress(Number.NaN), 0);
  assert.equal(clampProgress(-2), 0);
  assert.equal(clampProgress(0.45), 0.45);
  assert.equal(clampProgress(3), 1);
});

test("progressLabel describes every transformation stage", () => {
  assert.equal(progressLabel(0), "Top-down view");
  assert.equal(progressLabel(0.4), "Buildings gaining depth");
  assert.equal(progressLabel(0.7), "Camera rotating to street level");
  assert.equal(progressLabel(1), "Third-person city view");
});
