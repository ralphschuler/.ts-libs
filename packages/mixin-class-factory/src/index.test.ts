import assert from "node:assert/strict";
import { it } from "node:test";
import { createClass, ConfigProperty } from "./index.js";
it("copies prototype methods and applies config defaults without freezing caller objects", async () => {
  class Greeting {
    constructor(public config: { name: string }) {}
    greet() {
      return "Hello " + this.config.name;
    }
  }
  ConfigProperty("string", "Ada")(Greeting.prototype, "name");
  const Mixed = await createClass(Greeting);
  const config = {};
  const instance = new Mixed(config as any);
  assert.equal(instance.greet(), "Hello Ada");
  assert.equal(Object.isFrozen(config), false);
});
it("rejects member collisions", async () => {
  class A {
    method() {
      return 1;
    }
  }
  class B {
    method() {
      return 2;
    }
  }
  const Mixed = await createClass(A, B);
  assert.throws(() => new Mixed({}), /collision/);
});
