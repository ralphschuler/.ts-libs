import { MDNS } from "@ralphschuler/mdns";
import type { DNSRecord, DNSType } from "@ralphschuler/mdns";
import type { DNSTypeMap } from "@ralphschuler/mdns";
import { EventEmitter } from "node:events";
import { createServer, Server, Socket } from "node:net";
import { Peer } from "./Peer.js";
import { PeerInfo } from "./types/index.js";
import { FrameDecoder } from "./framing.js";

/** A small TCP peer discovery experiment with an explicit start/stop lifecycle. */
export interface PeerDiscovery {
  start?(): void;
  query(name: string, type: DNSType): Promise<DNSRecord[]>;
  announce(
    name: string,
    type: Exclude<DNSType, "ANY">,
    ttl: number,
    data: DNSRecord["data"],
  ): void;
  destroy(): Promise<void>;
}

export class P2P extends EventEmitter {
  private readonly peers = new Map<string, Peer>();
  private server: Server | undefined;
  private readonly sockets = new Set<Socket>();

  public constructor(
    private port: number,
    private readonly annotations: Record<string, string> = {},
    private readonly mdns: PeerDiscovery = new MDNS(),
    private readonly advertisedHost = "localhost",
  ) {
    super();
  }

  public async start(): Promise<void> {
    if (this.server) return;
    this.mdns.start?.();
    this.server = createServer((socket) => this.handleSocket(socket));
    await new Promise<void>((resolve, reject) => {
      this.server?.once("error", reject);
      this.server?.listen(this.port, () => {
        this.server?.off("error", reject);
        resolve();
      });
    });
    const address = this.server.address();
    if (address && typeof address !== "string") this.port = address.port;
    this.mdns.announce("_p2plib._tcp.local", "SRV", 120, {
      priority: 0,
      weight: 0,
      port: this.port,
      target: this.advertisedHost,
    });
    this.emit("listening", this.port);
  }

  public async discoverPeers(): Promise<PeerInfo[]> {
    const records = await this.mdns.query("_p2plib._tcp.local", "SRV");
    return records.flatMap((record) => {
      if (record.type !== "SRV") return [];
      const data = record.data as DNSTypeMap["SRV"];
      const info: PeerInfo = {
        id: `${data.target}:${data.port}`,
        hostname: data.target,
        port: data.port,
        publicKey: "",
        annotations: { ...this.annotations },
      };
      if (!this.peers.has(info.id)) this.peers.set(info.id, new Peer(info));
      return [info];
    });
  }

  public async destroy(): Promise<void> {
    for (const socket of this.sockets) socket.destroy();
    this.sockets.clear();
    for (const peer of this.peers.values()) peer.disconnect();
    this.peers.clear();
    await this.mdns.destroy();
    if (this.server)
      await new Promise<void>((resolve) => this.server?.close(() => resolve()));
    this.server = undefined;
  }

  private handleSocket(socket: Socket): void {
    this.sockets.add(socket);
    const decoder = new FrameDecoder();
    const peerId = `${socket.remoteAddress}:${socket.remotePort}`;
    socket.on("data", (data) => {
      try {
        for (const frame of decoder.read(data))
          this.emit("data", frame, peerId);
      } catch (error) {
        this.emit("peerError", error, peerId);
        socket.destroy();
      }
    });
    socket.on("close", () => {
      this.sockets.delete(socket);
      this.emit("disconnected", peerId);
    });
    socket.on("error", (error) => this.emit("peerError", error, peerId));
    this.emit("connected", peerId);
  }
}
