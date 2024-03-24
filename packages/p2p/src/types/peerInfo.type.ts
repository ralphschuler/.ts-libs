export type PeerInfo = {
  id: string;
  hostname: string;
  port: number;
  publicKey: string;
  annotations: {
    [key: string]: string
  }
}
