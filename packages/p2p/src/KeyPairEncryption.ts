export export class KeyPairEncryption {
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
    this.privateKey = privateKey.export({ type: 'pkcs1', format: 'pem' }).toString();
    this.publicKey = publicKey.export({ type: 'pkcs1', format: 'pem' }).toString();
  }

  public getPublicKey(): string {
    return this.publicKey;
  }

  public encrypt(data: Buffer, publicKey: string): Buffer {
    return publicEncrypt(publicKey, data);
  }

  public decrypt(data: Buffer): Buffer {
    return privateDecrypt({ key: this.privateKey, passphrase: '' }, data);
  }

  public sign(data: Buffer): Buffer {
    const sign = createSign('SHA256');
    sign.update(data);
    sign.end();
    return sign.sign(this.privateKey);
  }

  public verify(data: Buffer, signature: Buffer, publicKey: string): boolean {
    const verify = createVerify('SHA256');
    verify.update(data);
    verify.end();
    return verify.verify(publicKey, signature);
  }
}
