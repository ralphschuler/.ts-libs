export type Translations = Record<string, Record<string, string>>;
export class TranslationManager<T extends Translations> {
  private currentLanguage: keyof T;
  constructor(
    defaultLanguage: keyof T,
    private readonly translations: T,
  ) {
    this.currentLanguage = defaultLanguage;
    this.changeLanguage(defaultLanguage);
  }
  getCurrentLanguage(): keyof T {
    return this.currentLanguage;
  }
  changeLanguage(language: keyof T): void {
    if (!Object.hasOwn(this.translations, language))
      throw new RangeError("Unknown language: " + String(language));
    this.currentLanguage = language;
  }
  getTranslations(): T[keyof T] {
    return this.translations[this.currentLanguage];
  }
}
export class Translator<T extends Translations> {
  constructor(private readonly manager: TranslationManager<T>) {}
  translate(key: string, variables: Record<string, string> = {}): string {
    const entries = this.manager.getTranslations();
    if (!Object.hasOwn(entries, key))
      return (
        "[" +
        key +
        "] not found in " +
        String(this.manager.getCurrentLanguage())
      );
    return entries[key].replace(/\{([^{}]+)\}/g, (placeholder, name: string) =>
      Object.hasOwn(variables, name) ? variables[name] : placeholder,
    );
  }
}
