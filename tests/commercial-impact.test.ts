import assert from "node:assert/strict";
import test from "node:test";
import { commercialRecords, salesDistricts } from "../content/commercial-impact";

test("every commercial record includes a source and disclosure label", () => {
  for (const record of commercialRecords) {
    assert.match(record.sourceUrl, /^https:\/\//);
    assert.ok(record.statusLabel.length > 0);
    assert.ok(record.period.length > 0);
  }
});

test("sales districts progress toward the franchise milestone", () => {
  assert.equal(salesDistricts.at(-1)?.metric, "470M+");
  assert.ok((salesDistricts.at(-1)?.buildingCount ?? 0) > (salesDistricts[0]?.buildingCount ?? 0));
});

test("undisclosed revenue is not represented as zero", () => {
  const online = commercialRecords.find((record) => record.id === "online-disclosure");
  assert.equal(online?.status, "not-disclosed");
  assert.equal(online?.metric, "—");
});
