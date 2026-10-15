export interface IEncryptedKeys {
  privateKey: {
    ciphertext: string;
    iv: string;
    salt: string;
    tag: string;
  };
  publicKey: string;
}
