import {
  createSign,
  createVerify,
  publicEncrypt,
  privateDecrypt,
  generateKeyPairSync,
  createCipheriv,
  createDecipheriv,
} from 'crypto';
import { Readable, Writable } from 'stream';

export class KeyPairEncryption {
  private privateKey: string;
  private publicKey: string;

  constructor(publicKey?: string, privateKey?: string) {
    if (!publicKey || !privateKey) {
      this.generateKeys();
    } else {
      this.publicKey = publicKey;
      this.privateKey = privateKey;
    }
  }

  public generateKeys(): void {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
    });
    this.privateKey = privateKey
      .export({ type: 'pkcs1', format: 'pem' })
      .toString();
    this.publicKey = publicKey
      .export({ type: 'pkcs1', format: 'pem' })
      .toString();
  }

  public getPublicKey(): string {
    return this.publicKey;
  }

  public encryptStream(dataStream: Readable, publicKey: string): Readable {
    const encryptedStream = new Readable({
      read() {},
    });
    dataStream.on('data', (chunk) => {
      const encrypted = publicEncrypt(publicKey, chunk);
      encryptedStream.push(encrypted);
    });
    dataStream.on('end', () => {
      encryptedStream.push(null);
    });
    return encryptedStream;
  }

  public decryptStream(encryptedStream: Readable): Readable {
    const decryptedStream = new Readable({
      read() {},
    });
    encryptedStream.on('data', (chunk) => {
      const decrypted = privateDecrypt(
        { key: this.privateKey, passphrase: '' },
        chunk
      );
      decryptedStream.push(decrypted);
    });
    encryptedStream.on('end', () => {
      decryptedStream.push(null);
    });
    return decryptedStream;
  }

  public signStream(dataStream: Readable): Readable {
    const sign = createSign('SHA256');
    dataStream.pipe(sign);
    const signatureStream = new Readable({
      read() {},
    });
    sign.on('finish', () => {
      signatureStream.push(sign.sign(this.privateKey));
      signatureStream.push(null);
    });
    return signatureStream;
  }

  public verifyStream(
    dataStream: Readable,
    signature: Buffer,
    publicKey: string
  ): Promise<boolean> {
    const verify = createVerify('SHA256');
    dataStream.pipe(verify);
    return new Promise((resolve) => {
      verify.on('finish', () => {
        resolve(verify.verify(publicKey, signature));
      });
    });
  }
}
