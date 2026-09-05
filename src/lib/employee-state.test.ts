import assert from "node:assert/strict";
import test from "node:test";
import { consolidateEmployeeNames } from "./app-state";

test("custom employee names are preserved alongside default staff", () => {
  const names = consolidateEmployeeNames(["Phạm Kiên Cường"], [
    "Phạm Kiên Cường",
    "Nguyễn Văn A",
    "Trần Thị B",
  ]);

  assert.deepEqual(names, ["Nguyễn Văn A", "Phạm Kiên Cường", "Trần Thị B"]);
});
