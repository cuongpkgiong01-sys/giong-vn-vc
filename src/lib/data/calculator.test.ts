import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { generateReceiptNumber } from "./calculator.ts";

describe("generateReceiptNumber", () => {
  it("uses month sequence with day-month-year suffix", () => {
    assert.equal(generateReceiptNumber("2026-08-24", 0), "001_24_08_2026");
    assert.equal(generateReceiptNumber("2026-08-24", 4), "005_24_08_2026");
  });
});
