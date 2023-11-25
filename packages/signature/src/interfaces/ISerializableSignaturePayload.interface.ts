export interface ISerializableSignaturePayload {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | ISerializableSignaturePayload
    | ISerializableSignaturePayload[];
}
