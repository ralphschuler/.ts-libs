import assert from "node:assert/strict";
import { it } from "node:test";
import { noThrow, toNormalizedError, isError } from "./index.js";
it("normalizes hostile or cyclic values and rejected thenables without throwing", async () => {
  const cyclic: any = {};
  cyclic.self = cyclic;
  assert.ok(isError(toNormalizedError(cyclic)));
  const hostile = {
    toJSON() {
      throw Error("hostile");
    },
    toString() {
      throw Error("hostile");
    },
  };
  assert.ok(isError(toNormalizedError(hostile)));
  const thenable = {
    then(_resolve: unknown, reject: (error: unknown) => void) {
      reject("failure");
    },
  } as unknown as PromiseLike<never>;
  const result = await noThrow(() => thenable);
  assert.ok(isError(result));
  assert.equal(
    noThrow(() => false),
    false,
  );
});
