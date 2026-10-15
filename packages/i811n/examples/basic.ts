import assert from "node:assert/strict";
import { TranslationManager, Translator } from "../src/index.js";
const manager = new TranslationManager("en", {
  en: { hello: "Hello {name}" },
  de: { hello: "Hallo {name}" },
});
const translator = new Translator(manager);
manager.changeLanguage("de");
assert.equal(translator.translate("hello", { name: "Ada" }), "Hallo Ada");
