import assert from "node:assert/strict";
import { createClass } from "../src/index.js";
class Named {
  constructor(public config: { name: string }) {}
  getName() {
    return this.config.name;
  }
}
const Composed = await createClass(Named);
assert.equal(new Composed({ name: "Ada" }).getName(), "Ada");
