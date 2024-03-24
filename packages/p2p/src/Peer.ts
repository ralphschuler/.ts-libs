import * as net from "net";
import { EventEmitter } from "events";
import { KeyPairEncryption } from "./KeyPairEncryption.js";
import { PeerInfo } from "./types/index.js";

export class Peer extends EventEmitter {
  private socket: net.Socket | null = null;
  public info: PeerInfo;
  private keyPairEncryption: KeyPairEncryption;

  constructor(info: PeerInfo, keyPairEncryption: KeyPairEncryption) {
    super();
    this.info = info;
    this.keyPairEncryption = keyPairEncryption;
  }

  public connect(): void {
    if (this.socket) {
      console.log("Already connected to peer.");
      return;
    }

    this.socket = net.createConnection(
      { host: this.info.hostname, port: this.info.port },
      () => {
        this.emit("connected");
      },
    );

    this.socket.on("close", () => {
      this.emit("close");
    });

    this.socket.on("error", (err) => {
      this.emit("error", err);
    });
  }

  public disconnect(): void {
    this.socket?.end();
  }

  public send(data: Buffer): void {
    if (!this.socket) {
      console.log("Cannot send data, not connected to peer.");
      return;
    }

    const signedData = this.keyPairEncryption.sign(data);
    const encryptedData = this.keyPairEncryption.encrypt(
      data,
      this.info.publicKey,
    );

    this.socket.write(encryptedData);
  }
}
