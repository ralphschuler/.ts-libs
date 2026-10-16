import { isString, throws } from "../src/index.js";
const value: unknown = "TypeScript";
isString(value);
throws(() => {
  throw new Error("An expected failure");
});
