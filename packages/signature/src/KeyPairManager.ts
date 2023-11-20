import crypto from "node:crypto";
import { IKeyPair, IEncryptedKeys } from "./interfaces/index.js";
import { NoKeyPairGeneratedError, UnknownKeyIdError } from "./errors/index.js";
import { KeyPairEncryption } from "./KeyPairEncryption.js";

export class KeyPairManager {
  private keyIdToKeyPairMap: Map<string, IKeyPair> = new Map();
  private lastUsedKeyId: string | null = null;

  public get keyPairs(): number {
    return this.keyIdToKeyPairMap.size;
  }

  public validateKeyPairExistence(): void {
    if (this.keyIdToKeyPairMap.size === 0) {
      throw new NoKeyPairGeneratedError();
    }
  }

  public rotateToNextKeyId(): string {
    const keyIds = Array.from(this.keyIdToKeyPairMap.keys());
    if (!this.lastUsedKeyId) {
      this.lastUsedKeyId = keyIds[0];
    }
    const nextKeyId =
      keyIds[(keyIds.indexOf(this.lastUsedKeyId) + 1) % keyIds.length];
    this.lastUsedKeyId = nextKeyId;
    return nextKeyId;
  }

  public findKeyPairById(keyId: string): IKeyPair {
    const keyPair = this.keyIdToKeyPairMap.get(keyId);
    if (!keyPair) {
      throw new UnknownKeyIdError(
        Array.from(this.keyIdToKeyPairMap.keys()),
        keyId
      );
    }
    return keyPair;
  }

  public async createNewKeyPair(keyId: string): Promise<void> {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: "RSA-PSS",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["sign", "verify"]
    );

    const publicKey = keyPair.publicKey;
    const privateKey = keyPair.privateKey;

    this.keyIdToKeyPairMap.set(keyId, { privateKey, publicKey });
  }

  public async getPersistableKeyPair(
    keyId: string,
    passphrase: string
  ): Promise<string> {
    this.validateKeyPairExistence();
    const keyPair = this.findKeyPairById(keyId);
    const encryptedKeys = await KeyPairEncryption.encrypt(
      keyPair.privateKey,
      keyPair.publicKey,
      passphrase
    );
    return JSON.stringify(encryptedKeys);
  }

  public async loadKeyPairFromJSON(
    keyId: string,
    json: string,
    passphrase: string
  ): Promise<void> {
    const encryptedKeys: IEncryptedKeys = JSON.parse(json);
    const { privateKey, publicKey } = await KeyPairEncryption.decrypt(
      encryptedKeys,
      passphrase
    );

    this.keyIdToKeyPairMap.set(keyId, { privateKey, publicKey });
  }
}
