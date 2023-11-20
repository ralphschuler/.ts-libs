import { ISerializableSignaturePayload } from "./ISerializableSignaturePayload.interface.js";
import { ISignatureHeader } from "./ISignatureHeader.interface.js";

export interface ISignature<T extends ISerializableSignaturePayload> {
  header: ISignatureHeader;
  payload: T;
  signature: string;
}
