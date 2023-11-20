import crypto, { CryptoKey } from "node:crypto";
import { Buffer } from "node:buffer";
import {
  ISerializableSignaturePayload,
  ISignature,
  ISignatureHeader,
} from "./interfaces/index.js";

export class PayloadSigner<T extends ISerializableSignaturePayload> {
  static async sign(
    serializedPayload: string,
    privateKey: CryptoKey,
    hashAlgorithm: string,
  ): Promise<string> {
    const textBuffer = Buffer.from(serializedPayload);
    const signature = await crypto.subtle.sign(
      {
        name: hashAlgorithm,
        saltLength: 32,
      },
      privateKey,
      textBuffer,
    );
    return Buffer.from(signature).toString("hex");
  }

  static async verify<T extends ISerializableSignaturePayload>(
    signedPayload: ISignature<T>,
    publicKey: CryptoKey,
  ): Promise<boolean> {
    const payloadWithHeader = {
      header: signedPayload.header,
      payload: signedPayload.payload,
    };
    const serializedPayload = JSON.stringify(payloadWithHeader);
    const textBuffer = Buffer.from(serializedPayload);
    const signatureBuffer = Buffer.from(signedPayload.signature, "hex");

    return await crypto.subtle.verify(
      {
        name: signedPayload.header.algorithm,
        saltLength: 32,
      },
      publicKey,
      signatureBuffer,
      textBuffer,
    );
  }

  static createSignatureHeader(
    keyId: string,
    hashAlgorithm: string = "RSA-OAEP",
  ): ISignatureHeader {
    return {
      keyId,
      algorithm: hashAlgorithm,
      timestamp: new Date().toISOString(),
    };
  }
}
