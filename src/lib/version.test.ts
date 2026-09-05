import assert from "node:assert/strict";
import test from "node:test";
import { APP_VERSION, highestVersion, nextVersion } from "./version";

test("nextVersion increments semver in the requested pattern", () => {
  assert.equal(nextVersion(APP_VERSION), "1.2.1");
  assert.equal(nextVersion("1.2.9"), "1.3.0");
  assert.equal(nextVersion("1.3.0"), "1.3.1");
});

test("highestVersion picks the newest version from multiple records", () => {
  assert.equal(highestVersion(["1.2.0", "1.2.1", "1.2.9", "1.3.0"]), "1.3.0");
  assert.equal(highestVersion(["1.2.2", "1.2.10"]), "1.2.10");
});
