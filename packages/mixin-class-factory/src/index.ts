import "reflect-metadata";

type PropertyTypeMap = Record<string, Record<string, string>>;
type MethodTypeMap = Record<string, Record<string, Function>>;

export function ConfigProperty(type: string, defaultValue: any) {
  return function (target: any, propertyKey: any): void {
    const constructor = target.constructor;
    const properties =
      Reflect.getMetadata("configProperties", constructor) || new Map();
    properties.set(propertyKey, { type, defaultValue });
    Reflect.defineMetadata("configProperties", properties, constructor);
  };
}

export function InterfaceMethod() {
  return function (target: any, propertyKey: any): void {
    const constructor = target.constructor;
    const methods =
      Reflect.getMetadata("interfaceMethods", constructor) || new Map();
    methods.set(propertyKey, target[propertyKey as keyof typeof target]);
    Reflect.defineMetadata("interfaceMethods", methods, constructor);
  };
}

function validateAndFreezeConfig(
  config: UnifiedConfig<any>,
  mixins: Function[],
) {
  Object.freeze(config);
  mixins.forEach((Mixin) => {
    const className = Mixin.name;
    const expectedConfig: Map<string, any> =
      Reflect.getMetadata("configProperties", Mixin) || new Map();
    expectedConfig.forEach((value, key) => {
      if ((config as any)[key] === undefined) {
        throw new Error(`Missing config property: ${key} in ${className}`);
      }
      if (value.type !== typeof (config as any)[key]) {
        throw new Error(
          `Type mismatch for ${key} in ${className}: expected ${
            value.type
          }, got ${typeof (config as any)[key]}`,
        );
      }
    });
  });
}

type ExtractConfig<T> = T extends new (config: infer Config) => any
  ? Config
  : never;
type UnifiedConfig<T extends any[]> = {
  [K in keyof T]: ExtractConfig<T[K]>;
}[number];

export async function createClass<T extends Array<new (config: any) => any>>(
  ...mixins: T
): Promise<new (config: UnifiedConfig<T>) => any> {
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
