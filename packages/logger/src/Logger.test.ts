import assert from "node:assert/strict";
import { it } from "node:test";
import { Logger } from "./Logger.js";
import { LogLevel } from "./enums/LogLevel.js";
it("honors explicit DEBUG=0 and suppresses lower severities at INFO without exiting on fatal", () => {
  const output: string[] = [];
  const stream = {
    write: (value: string) => {
      output.push(value);
      return true;
    },
    isTTY: false,
  } as unknown as NodeJS.WriteStream;
  const debug = new Logger("{level}: {message}", LogLevel.DEBUG, stream);
  debug.debug("visible debug");
  assert.ok(output.some((value) => value.includes("visible debug")));
  output.length = 0;
  const logger = new Logger("{level}: {message}", LogLevel.INFO, stream);
  logger.debug("suppressed debug");
  assert.equal(output.length, 0);
  logger.info("visible info");
  logger.error("visible error");
  logger.fatal("visible fatal");
  assert.ok(output.some((value) => value.includes("visible info")));
  assert.ok(output.some((value) => value.includes("visible error")));
  assert.ok(output.some((value) => value.includes("visible fatal")));
});
