import { createConnection, Socket } from "node:net";
import { EventEmitter } from "node:events";
import type { KeyPairEncryption } from "./KeyPairEncryption.js";
import type { PeerInfo } from "./types/index.js";
import { encodeFrame, FrameDecoder } from "./framing.js";

/** Plain framed TCP experiment. Encryption requires a separately designed trust protocol. */
export class Peer extends EventEmitter {
  private socket: Socket | null = null;
  constructor(
    public readonly info: PeerInfo,
    _keyPairEncryption?: KeyPairEncryption,
  ) {
    super();
  }
  async connect(): Promise<void> {
    if (this.socket) throw new Error("Peer is already connected");
    const socket = createConnection({
      host: this.info.hostname,
      port: this.info.port,
    });
    this.socket = socket;
    const decoder = new FrameDecoder();
    socket.on("data", (chunk) => {
      try {
        for (const frame of decoder.read(chunk)) this.emit("data", frame);
      } catch (error) {
        this.emit("peerError", error);
        socket.destroy();
      }
    });
    socket.on("close", () => {
      this.socket = null;
      this.emit("close");
    });
    socket.on("error", (error) => this.emit("peerError", error));
    await new Promise<void>((resolve, reject) => {
      socket.once("error", reject);
      socket.once("connect", () => {
        socket.off("error", reject);
        this.emit("connected");
        resolve();
      });
    });
  }
  disconnect(): void {
    this.socket?.destroy();
    this.socket = null;
  }
  send(data: Buffer): boolean {
    if (!this.socket || this.socket.connecting || this.socket.destroyed)
      throw new Error("Peer is not connected");
    return this.socket.write(encodeFrame(data));
  }
}
