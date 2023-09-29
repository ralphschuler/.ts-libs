/**
 * Types for property and method mappings.
 */
type PropertyTypeMap = Record<string, Record<string, string>>;
type MethodTypeMap = Record<string, Record<string, Function>>;

const configProperties: PropertyTypeMap = {};
const interfaceMethods: MethodTypeMap = {};

/**
 * Decorator to collect properties with their types.
 * @param {string} type - The expected type of the property.
 */
export function ConfigProperty(type: string, defaultValue?: any) {
  return (target: object, propertyKey: string) => {
    addToMap(configProperties, target.constructor.name, propertyKey, type);
    if (defaultValue !== undefined) {
      target[propertyKey] = defaultValue;
    }
  };
}

/**
 * Decorator to collect methods.
 * @param {object} target - The target object.
 * @param {string} propertyKey - The key of the property.
 * @param {PropertyDescriptor} descriptor - The property descriptor.
 */
export function InterfaceMethod(target: object, propertyKey: string, descriptor: PropertyDescriptor) {
  addToMap(interfaceMethods, target.constructor.name, propertyKey, descriptor.value);
}

/**
 * Utility function to add an entry to a map.
 * @param {Record<string, any>} map - The map to which to add the entry.
 * @param {string} className - The name of the class.
 * @param {string} key - The key to add.
 * @param {any} value - The value to associate with the key.
 */
function addToMap(map: Record<string, any>, className: string, key: string, value: any) {
  map[className] = map[className] || {};
  map[className][key] = value;
}

/**
 * Function to validate and freeze the unified config object.
 * @param {UnifiedConfig<any>} config - The config object to validate.
 * @param {Function[]} mixins - The array of mixin classes.
 */
function validateAndFreezeConfig(config: UnifiedConfig<any>, mixins: Function[]) {
  Object.freeze(config);
  mixins.forEach((Mixin) => {
    const className = Mixin.name;
    const expectedConfig = configProperties[className] || {};
    const actualConfigKeys = Object.keys(expectedConfig);

    actualConfigKeys.forEach((key) => {
      if (config[key] === undefined) {
        throw new Error(`Missing config property: ${key} in ${className}`);
      }
      const expectedType = expectedConfig[key];
      const actualType = typeof config[key];
      if (expectedType !== actualType) {
        throw new Error(`Type mismatch for ${key} in ${className}: expected ${expectedType}, got ${actualType}`);
      }
    });
  });
}

type ExtractConfig<T> = T extends new (config: infer Config) => any ? Config : never;
type UnifiedConfig<T extends any[]> = {
  [K in keyof T]: ExtractConfig<T[K]>;
}[number];

/**
 * Function to create a new class with mixin functionality.
 * @param {...Function} mixins - The mixin classes to include.
 * @returns {Promise<new (config: UnifiedConfig<T>) => any>} - The newly created class.
 */
export async function createClass<T extends Array<new (config: any) => any>>(
  ...mixins: T
): Promise<new (config: UnifiedConfig<T>) => any> {
  // Perform any asynchronous operations here, if needed
  
  return class {
    constructor(config: UnifiedConfig<T>) {
      validateAndFreezeConfig(config, mixins);
      for (const Mixin of mixins) {
        const mixinInstance = new Mixin(config);
        Object.assign(this, mixinInstance);
      }
    }
  };
}

// Example usage
interface ILoggingMixin {
  logLevel: 'info' | 'warn' | 'error';
  log(message: string): void;
}

class LoggingMixinInstance implements ILoggingMixin {
  @ConfigProperty('string', 'info')
  logLevel: 'info' | 'warn' | 'error';

  @InterfaceMethod
  log(message: string): void {
    console.log(`[${this.logLevel}] ${message}`);
  }
}

interface ICachingMixin {
  cacheSize: number;
  setCache(key: string, value: any): void;
}

class CachingMixinInstance implements ICachingMixin {
  @ConfigProperty('number', 100)
  cacheSize: number;

  @InterfaceMethod
  setCache(key: string, value: any): void {
    // Implement caching logic here
  }
}

// Usage
(async () => {
  const MyClass = await createClass(LoggingMixinInstance, CachingMixinInstance);
  const myInstance = new MyClass({
    logLevel: 'info',
    cacheSize: 100
  });
  myInstance.log('Hello, world!');
})();
