import { IEncryptedKeys } from "./interfaces/index.js";
import { Buffer } from "node:buffer";
import crypto, { CryptoKey } from "node:crypto";

export class KeyPairEncryption {
  static async encrypt(
    privateKey: CryptoKey,
    publicKey: CryptoKey,
    passphrase: string,
  ): Promise<IEncryptedKeys> {
    const privateKeyData = await crypto.subtle.exportKey("pkcs8", privateKey);
    const publicKeyData = await crypto.subtle.exportKey("spki", publicKey);

    const passphraseBuffer = Buffer.from(passphrase, "utf-8");
    const passphraseKey = await crypto.subtle.importKey(
      "raw",
      passphraseBuffer,
      "PBKDF2",
      false,
      ["deriveKey"],
    );

    const iv = crypto.getRandomValues(new Uint8Array(16));
    const derivedKey = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: iv, iterations: 10000, hash: "SHA-256" },
      passphraseKey,
      { name: "AES-CBC", length: 256 },
      false,
      ["encrypt"],
    );

    const encryptedPrivateKey = await crypto.subtle.encrypt(
      { name: "AES-CBC", iv: iv },
      derivedKey,
      privateKeyData,
    );

    return {
      privateKey: {
        data: encryptedPrivateKey,
        iv: iv,
      },
      publicKey: publicKeyData,
    };
  }

  static async decrypt(
    encryptedKeys: IEncryptedKeys,
    passphrase: string,
  ): Promise<{ privateKey: CryptoKey; publicKey: CryptoKey }> {
    const { privateKey, publicKey } = encryptedKeys;

    const passphraseBuffer = Buffer.from(passphrase, "utf-8");
    const passphraseKey = await crypto.subtle.importKey(
      "raw",
      passphraseBuffer,
      "PBKDF2",
      false,
      ["deriveKey"],
    );

    const derivedKey = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: privateKey.iv,
        iterations: 10000,
        hash: "SHA-256",
      },
      passphraseKey,
      { name: "AES-CBC", length: 256 },
      false,
      ["decrypt"],
    );

    const decryptedPrivateKeyData = await crypto.subtle.decrypt(
      { name: "AES-CBC", iv: privateKey.iv },
      derivedKey,
      privateKey.data,
    );

    const decryptedPrivateKey = await crypto.subtle.importKey(
      "pkcs8",
      decryptedPrivateKeyData,
      { name: "RSA-PSS", hash: "SHA-256" }, // Changed to RSA-OAEP
      false,
      ["sign"],
    );

    const decryptedPublicKey = await crypto.subtle.importKey(
      "spki",
      publicKey,
      { name: "RSA-PSS", hash: "SHA-256" }, // Changed to RSA-OAEP
      false,
      ["verify"],
    );

    return { privateKey: decryptedPrivateKey, publicKey: decryptedPublicKey };
  }
}
