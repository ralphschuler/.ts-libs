// Type Definitions
interface Translations {
  en: {
    welcome: string;
    goodbye: string;
  };
  fr: {
    welcome: string;
    goodbye: string;
  };
  // Add other languages here...
}

type LanguageCode = keyof Translations;
type TranslationKeys<T extends LanguageCode> = keyof Translations[T];

// Translation Manager
class TranslationManager<T extends Translations> {
  private currentLanguage: LanguageCode;
  private translations: T;

  constructor(defaultLanguage: LanguageCode, translations: T) {
    this.currentLanguage = defaultLanguage;
    this.translations = translations;
  }

  getCurrentLanguage(): LanguageCode {
    return this.currentLanguage;
  }

  changeLanguage(language: LanguageCode): void {
    this.currentLanguage = language;
  }

  getTranslations(): T[LanguageCode] {
    return this.translations[this.currentLanguage];
  }
}

// Translator
class Translator<T extends Translations> {
  private manager: TranslationManager<T>;

  constructor(manager: TranslationManager<T>) {
    this.manager = manager;
  }

  translate<K extends TranslationKeys<LanguageCode>>(
    key: K,
    variables?: Record<string, string>,
  ): string {
    const translations = this.manager.getTranslations();
    let translation =
      translations[key] ||
      `[${key}] not found in ${this.manager.getCurrentLanguage()}`;
    if (variables) {
      translation = Object.keys(variables).reduce((acc, varKey) => {
        return acc.replace(new RegExp(`{${varKey}}`, "g"), variables[varKey]);
      }, translation);
    }
    return translation;
  }
}

// Example Usage
const translations: Translations = {
  en: { welcome: "Welcome, {name}!", goodbye: "Goodbye, {name}!" },
  fr: { welcome: "Bienvenue, {name}!", goodbye: "Au revoir, {name}!" },
};

const translationManager = new TranslationManager<Translations>(
  "en",
  translations,
);
const translator = new Translator<Translations>(translationManager);

console.log(translator.translate("welcome", { name: "Alice" })); // Welcome, Alice!
translationManager.changeLanguage("fr");
console.log(translator.translate("goodbye", { name: "Bob" })); // Au revoir, Bob!
