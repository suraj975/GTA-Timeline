import assert from "node:assert/strict";
import test from "node:test";
import { clampProgress, progressLabel } from "../lib/animation/progress";
import { eraChapters, games, gamesByEra } from "../content/games";
import { trailers } from "../content/trailers";

test("clampProgress constrains invalid and out-of-range values", () => {
  assert.equal(clampProgress(Number.NaN), 0);
  assert.equal(clampProgress(-2), 0);
  assert.equal(clampProgress(0.45), 0.45);
  assert.equal(clampProgress(3), 1);
});

test("progressLabel describes every transformation stage", () => {
  assert.equal(progressLabel(0), "The map comes alive");
  assert.equal(progressLabel(0.4), "The city rises");
  assert.equal(progressLabel(0.55), "The camera descends");
  assert.equal(progressLabel(0.75), "Entering the tunnel");
  assert.equal(progressLabel(1), "Welcome to Liberty City");
});

test("the public timeline contains every curated chapter across four eras", () => {
  assert.equal(games.length, 18);
  assert.equal(eraChapters.length, 5);
  assert.deepEqual(
    ["2d", "3d", "hd", "future"].map((era) => gamesByEra(era as "2d" | "3d" | "hd" | "future").length),
    [4, 6, 7, 1],
  );
  assert.equal(new Set(games.map((game) => game.id)).size, games.length);
});

test("the trailer theatre uses unique YouTube video identifiers", () => {
  assert.equal(trailers.length, 6);
  assert.equal(new Set(trailers.map((trailer) => trailer.id)).size, trailers.length);
  assert.ok(trailers.every((trailer) => /^[\w-]{11}$/.test(trailer.id)));
});
