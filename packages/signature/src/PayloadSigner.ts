import { createSign, createVerify, KeyObject } from "node:crypto";
import {
  ISerializableSignaturePayload,
  ISignature,
  ISignatureHeader,
} from "./interfaces/index.js";

export class PayloadSigner {
  static async sign(
    serializedPayload: string,
    privateKey: KeyObject,
    hashAlgorithm = "RSA-SHA256",
  ): Promise<string> {
    const signer = createSign(hashAlgorithm);
    signer.update(serializedPayload);
    signer.end();
    return signer.sign(privateKey).toString("base64");
  }

  static async verify<T extends ISerializableSignaturePayload>(
    signedPayload: ISignature<T>,
    publicKey: KeyObject,
  ): Promise<boolean> {
    const payloadWithHeader = {
      header: signedPayload.header,
      payload: signedPayload.payload,
    };
    const serializedPayload = JSON.stringify(payloadWithHeader);
    const verifier = createVerify(signedPayload.header.algorithm);
    verifier.update(serializedPayload);
    verifier.end();
    return verifier.verify(
      publicKey,
      Buffer.from(signedPayload.signature, "base64"),
    );
  }

  static createSignatureHeader(
    keyId: string,
    hashAlgorithm = "RSA-SHA256",
  ): ISignatureHeader {
    return {
      keyId,
      algorithm: hashAlgorithm,
      timestamp: new Date().toISOString(),
    };
  }
}
