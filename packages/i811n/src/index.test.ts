import assert from "node:assert/strict";
import { it } from "node:test";
import { TranslationManager, Translator } from "./index.js";
it("switches between arbitrary languages and interpolates literal values safely", () => {
  const manager = new TranslationManager("en", {
    en: { greeting: "Hello {name} {name}" },
    de: { greeting: "Hallo {name}" },
  });
  const translator = new Translator(manager);
  assert.equal(translator.translate("greeting", { name: "$&" }), "Hello $& $&");
  manager.changeLanguage("de");
  assert.equal(
    translator.translate("greeting", { name: "Ralph" }),
    "Hallo Ralph",
  );
  assert.match(translator.translate("absent"), /not found/);
});
