import {
  ISerializableSignaturePayload,
  ISignature,
} from "./interfaces";
import { PayloadSigner } from "./PayloadSigner";
import { KeyPairManager } from "./KeyPairManager";

export class Signature<T extends ISerializableSignaturePayload> {
  private keyPairManager: KeyPairManager;

  constructor() {
    this.keyPairManager = new KeyPairManager();
    this.keyPairManager.createNewKeyPair("key-1").then(
      () => this.keyPairManager.createNewKeyPair("key-2").then(
        () => this.keyPairManager.createNewKeyPair("key-3")
      )
    );
  }

  public async signData(payload: T, hashAlgorithm: string = "RSA-PSS"): Promise<ISignature<T>> {
    this.keyPairManager.validateKeyPairExistence();
    const keyId = this.keyPairManager.rotateToNextKeyId();
    const keyPair = this.keyPairManager.findKeyPairById(keyId);

    const signatureHeader = PayloadSigner.createSignatureHeader(
      keyId,
      hashAlgorithm
    );

    const payloadWithHeader = {
      header: signatureHeader,
      payload,
    };

    const serializedPayload = JSON.stringify(payloadWithHeader);
    const signature = await PayloadSigner.sign(
      serializedPayload,
      keyPair.privateKey,
      hashAlgorithm
    );

    return {
      header: signatureHeader,
      payload,
      signature,
    };
  }


  public async verifySignature(signedPayload: ISignature<T>): Promise<boolean> {
    this.keyPairManager.validateKeyPairExistence();
    const keyPair = this.keyPairManager.findKeyPairById(signedPayload.header.keyId);

    if (!keyPair) return false;

    return await PayloadSigner.verify(signedPayload, keyPair.publicKey);
  }
}
