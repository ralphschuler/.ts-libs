import {
  ISerializableSignaturePayload,
  ISignature,
} from "./interfaces/index.js";
import { PayloadSigner } from "./PayloadSigner.js";
import { KeyPairManager } from "./KeyPairManager.js";
import { UnknownKeyIdError } from "./errors/index.js";

export class Signature<T extends ISerializableSignaturePayload> {
  private keyPairManager: KeyPairManager;

  constructor() {
    this.keyPairManager = new KeyPairManager();
    void this.keyPairManager.createNewKeyPair("key-1");
  }

  public async signData(
    payload: T,
    hashAlgorithm = "RSA-SHA256",
  ): Promise<ISignature<T>> {
    this.keyPairManager.validateKeyPairExistence();
    const keyId = this.keyPairManager.rotateToNextKeyId();
    const keyPair = this.keyPairManager.findKeyPairById(keyId);

    const signatureHeader = PayloadSigner.createSignatureHeader(
      keyId,
      hashAlgorithm,
    );

    const payloadWithHeader = {
      header: signatureHeader,
      payload,
    };

    const serializedPayload = JSON.stringify(payloadWithHeader);
    const signature = await PayloadSigner.sign(
      serializedPayload,
      keyPair.privateKey,
      hashAlgorithm,
    );

    return {
      header: signatureHeader,
      payload,
      signature,
    };
  }

  public async verifySignature(signedPayload: ISignature<T>): Promise<boolean> {
    this.keyPairManager.validateKeyPairExistence();
    let keyPair;
    try {
      keyPair = this.keyPairManager.findKeyPairById(signedPayload.header.keyId);
    } catch (error) {
      if (error instanceof UnknownKeyIdError) return false;
      throw error;
    }

    if (!keyPair) return false;

    return await PayloadSigner.verify(signedPayload, keyPair.publicKey);
  }
}
