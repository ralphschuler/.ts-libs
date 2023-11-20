import { ISerializableSignaturePayload } from "./ISerializableSignaturePayload.interface";
import { ISignatureHeader } from "./ISignatureHeader.interface";

export interface ISignature<T extends ISerializableSignaturePayload> {
  header: ISignatureHeader;
  payload: T;
  signature: string;
}