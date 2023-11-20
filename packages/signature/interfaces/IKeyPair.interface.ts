import { KeyObject } from 'node:crypto';

export interface IKeyPair {
  privateKey: KeyObject;
  publicKey: KeyObject;
}