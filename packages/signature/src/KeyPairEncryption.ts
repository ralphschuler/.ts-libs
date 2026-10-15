import { IEncryptedKeys } from "./interfaces/index.js";
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
  createPrivateKey,
  createPublicKey,
  KeyObject,
} from "node:crypto";

export class KeyPairEncryption {
  static async encrypt(
    privateKey: KeyObject,
    publicKey: KeyObject,
    passphrase: string,
  ): Promise<IEncryptedKeys> {
    const salt = randomBytes(16);
    const iv = randomBytes(12);
    const key = scryptSync(passphrase, salt, 32);
    const cipher = createCipheriv("aes-256-gcm", key, iv);
    const encryptedPrivateKey = Buffer.concat([
      cipher.update(privateKey.export({ type: "pkcs8", format: "der" })),
      cipher.final(),
    ]);

    return {
      privateKey: {
        ciphertext: encryptedPrivateKey.toString("base64"),
        iv: iv.toString("base64"),
        salt: salt.toString("base64"),
        tag: cipher.getAuthTag().toString("base64"),
      },
      publicKey: publicKey
        .export({ type: "spki", format: "der" })
        .toString("base64"),
    };
  }

  static async decrypt(
    encryptedKeys: IEncryptedKeys,
    passphrase: string,
  ): Promise<{ privateKey: KeyObject; publicKey: KeyObject }> {
    const { privateKey, publicKey } = encryptedKeys;

    const key = scryptSync(
      passphrase,
      Buffer.from(privateKey.salt, "base64"),
      32,
    );
    const decipher = createDecipheriv(
      "aes-256-gcm",
      key,
      Buffer.from(privateKey.iv, "base64"),
    );
    decipher.setAuthTag(Buffer.from(privateKey.tag, "base64"));
    const privateDer = Buffer.concat([
      decipher.update(Buffer.from(privateKey.ciphertext, "base64")),
      decipher.final(),
    ]);
    return {
      privateKey: createPrivateKey({
        key: privateDer,
        format: "der",
        type: "pkcs8",
      }),
      publicKey: createPublicKey({
        key: Buffer.from(publicKey, "base64"),
        format: "der",
        type: "spki",
      }),
    };
  }
}
