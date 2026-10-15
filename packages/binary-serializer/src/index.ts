import "reflect-metadata";

// Types and Decorators
export type BasicDataType = "number" | "boolean";
export type DataType =
  | BasicDataType
  | { type: "string"; length: number }
  | { type: "array"; itemType: DataType; itemCount: number }
  | { type: "Serialized"; class: Function };

function addSchema(target: any, propertyKey: string, typeData: DataType) {
  const schema = { ...(Reflect.getMetadata("schema", target) || {}) };
  schema[propertyKey] = typeData;
  Reflect.defineMetadata("schema", schema, target);
}

export function Serializable(target: Function) {
  Reflect.defineMetadata("Serializable", true, target);
  target.prototype.getSchema = function () {
    return Reflect.getMetadata("schema", this);
  };
  target.prototype.serialize = function () {
    const binarySerializer = new BinarySerializer(this.getSchema());
    return binarySerializer.serialize(this, this.getSchema()).getBuffer();
  };
  target.prototype.deserialize = function (buffer: Buffer) {
    const binarySerializer = new BinarySerializer(this.getSchema());
    return Object.assign(
      this,
      binarySerializer.setBuffer(buffer).deserialize(this.getSchema()),
    );
  };
}

export function Serialized(target: any, propertyKey: string) {
  const propertyType = Reflect.getMetadata("design:type", target, propertyKey);
  if (Reflect.getMetadata("Serializable", propertyType)) {
    addSchema(target, propertyKey, { type: "Serialized", class: propertyType });
  }
}

export function AsNumber(target: any, propertyKey: string) {
  addSchema(target, propertyKey, "number");
}

export function AsBoolean(target: any, propertyKey: string) {
  addSchema(target, propertyKey, "boolean");
}

export function AsString(length: number) {
  return function (target: any, propertyKey: string) {
    addSchema(target, propertyKey, { type: "string", length });
  };
}

export function AsArray(itemType: DataType | Function, itemCount: number) {
  return function (target: any, propertyKey: string) {
    if (typeof itemType === "function") {
      const primitiveTypes = new Map<Function, BasicDataType>([
        [Number, "number"],
        [Boolean, "boolean"],
      ]);
      const primitiveType = primitiveTypes.get(itemType);
      if (primitiveType) {
        addSchema(target, propertyKey, {
          type: "array",
          itemType: primitiveType,
          itemCount,
        });
        return;
      }
      if (!Reflect.getMetadata("Serializable", itemType)) {
        throw new Error("Array type must be Serializable");
      }
      addSchema(target, propertyKey, {
        type: "array",
        itemType: { type: "Serialized", class: itemType },
        itemCount,
      });
    } else {
      addSchema(target, propertyKey, { type: "array", itemType, itemCount });
    }
  };
}
export class BinarySerializer {
  private buffer: Buffer;
  private offset: number;
  private schema: { [key: string]: DataType };

  constructor(schema: { [key: string]: DataType }) {
    this.schema = schema;
    const bufferSize = this.calculateBufferSize(schema);
    this.buffer = Buffer.alloc(bufferSize);
    this.offset = 0;
  }

  private calculateBufferSize(schema: { [key: string]: DataType }): number {
    let size = 0;
    for (const type of Object.values(schema)) {
      if (type === "number") {
        size += 4;
      } else if (type === "boolean") {
        size += 1;
      } else if (typeof type === "object" && type.type === "string") {
        if (!Number.isInteger(type.length) || type.length < 0)
          throw new RangeError("Invalid string width");
        size += type.length;
      } else if (typeof type === "object" && type.type === "array") {
        if (!Number.isInteger(type.itemCount) || type.itemCount < 0)
          throw new RangeError("Invalid array length");
        size +=
          this.calculateBufferSize({ item: type.itemType }) * type.itemCount;
      } else {
        size += this.calculateBufferSize(type.class.prototype.getSchema());
      }
    }
    if (!Number.isSafeInteger(size) || size < 0 || size > 16 * 1024 * 1024)
      throw new RangeError("Invalid or oversized binary schema");
    return size;
  }

  private serializeValue(value: any, type: DataType): void {
    if (type === "number") {
      this.buffer.writeUInt32LE(value, this.offset);
      this.offset += 4;
    } else if (type === "boolean") {
      if (typeof value !== "boolean") throw new TypeError("Expected a boolean");
      this.buffer.writeUInt8(value ? 1 : 0, this.offset);
      this.offset++;
    } else if (typeof type === "object" && type.type === "string") {
      if (
        typeof value !== "string" ||
        value.includes("\0") ||
        Buffer.byteLength(value) > type.length
      )
        throw new RangeError(
          "String exceeds fixed UTF-8 width or contains NUL",
        );
      this.buffer.fill(0, this.offset, this.offset + type.length);
      this.buffer.write(value, this.offset, type.length, "utf8");
      this.offset += type.length;
    } else if (typeof type === "object" && type.type === "array") {
      const len = type.itemCount;
      if (!Array.isArray(value) || value.length !== len)
        throw new RangeError("Expected exact array length");
      for (let i = 0; i < len; i++) {
        this.serializeValue(value[i], type.itemType);
      }
    } else {
      this.serializeObject(value, type.class.prototype.getSchema());
    }
  }

  serialize(data: any, schema: { [key: string]: DataType }): this {
    this.offset = 0;
    this.buffer = Buffer.alloc(this.calculateBufferSize(schema));
    return this.serializeObject(data, schema);
  }

  private serializeObject(
    data: any,
    schema: { [key: string]: DataType },
  ): this {
    for (const [key, type] of Object.entries(schema).sort(([left], [right]) =>
      left < right ? -1 : left > right ? 1 : 0,
    )) {
      this.serializeValue(data[key], type);
    }
    return this;
  }

  private deserializeValue(type: DataType): any {
    if (type === "number") {
      const value = this.buffer.readUInt32LE(this.offset);
      this.offset += 4;
      return value;
    } else if (type === "boolean") {
      const value = Boolean(this.buffer.readUInt8(this.offset));
      this.offset++;
      return value;
    } else if (typeof type === "object" && type.type === "string") {
      const value = this.buffer
        .toString("utf-8", this.offset, this.offset + type.length)
        .replace(/\0+$/, "");
      this.offset += type.length;
      return value;
    } else if (typeof type === "object" && type.type === "array") {
      const len = type.itemCount;
      const arr = [];
      for (let i = 0; i < len; i++) {
        arr.push(this.deserializeValue(type.itemType));
      }
      return arr;
    } else {
      return this.deserialize(type.class.prototype.getSchema());
    }
  }

  deserialize(schema: { [key: string]: DataType }): any {
    if (this.offset + this.calculateBufferSize(schema) > this.buffer.length)
      throw new RangeError("Truncated binary buffer");
    const result: { [key: string]: any } = {};
    for (const [key, type] of Object.entries(schema).sort(([left], [right]) =>
      left < right ? -1 : left > right ? 1 : 0,
    )) {
      result[key] = this.deserializeValue(type);
    }
    return result;
  }

  getBuffer(): Buffer {
    return Buffer.from(this.buffer.subarray(0, this.offset));
  }

  setBuffer(buffer: Buffer): this {
    this.buffer = buffer;
    this.offset = 0;
    return this;
  }
}
