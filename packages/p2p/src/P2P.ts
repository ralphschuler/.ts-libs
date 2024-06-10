import { MDNS } from "@ralphschuler/mdns";
import { EventEmitter } from "events";
import * as net from 'net'
import { PeerInfo } from "./types/index.js"
import { Peer } from "./Peer.js"
import { KeyPairEncryption } from "./KeyPairEncryption.js"

export class P2P extends EventEmitter {
  private mdns: MDNS;
  private server: net.Server | null = null;
  private peers: Map<string, Peer> = new Map();
  private annotations: { [key: string]: string };
  private keyPairEncryption: KeyPairEncryption;
  private port: number;

  constructor(port: number, annotations?: { [key: string]: string }) {
    super();
    this.port = port;
    this.annotations = annotations || {};
    this.keyPairEncryption = new KeyPairEncryption();
    this.mdns = new MDNS();
    this.initializeServer();
    this.announceService();
    this.discoverPeers();
  }

  private initializeServer(): void {
    this.server = net.createServer((socket) => {
      const peerId = `${socket.remoteAddress}:${socket.remotePort}`
      const peer = this.peers.get(peerId);

      if (!peer) {
        console.error(`Peer ${peerId} not found`);
        return;
      }

      socket.on('data', (data) => {
        const decryptedData = this.keyPairEncryption.decrypt(data);
        const verifiedData = this.keyPairEncryption.verify(data, peer.info.publicKey)
        
        this.emit('data', verifiedData, peer);
      });

      socket.on('close', () => {
        this.peers.delete(peerId)
        this.emit('disconnected', peerId);
      });
      
      this.emit('connection', peer)
    });

    this.server.on('error', (err) => {
      this.emit('error', err);
    });

    this.server.listen(this.port, () => {
      this.emit('listening', this.port)
    });
  }

  private announceService(): void {
    this.mdns.announce('_p2plib._tcp.local', 'SRV', 120, { priority: 0, weight: 0, port: this.port, target: 'localhost' });
    Object.entries(this.annotations).forEach(([key, value]) => {
      this.mdns.announce('_p2plib._tcp.local', 'TXT', 120, `${key}=${value}`);
    });
    this.mdns.announce('_p2plib._tcp.local', 'TXT', 120, `publicKey:${this.keyPairEncryption.getPublicKey()}`);
  }

  private async discoverPeers(): Promise<void> {
    setInterval(async () => {
      try {
        const srvRecords = await this.mdns.query('_p2plib._tcp.local', 'SRV');
        srvRecords.forEach(async (srvRecord) => {
          const txtRecords = await this.mdns.query(srvRecord.name, 'TXT');
          const annotations = txtRecords.reduce((acc, txtRecord) => {
            const [key, value] = txtRecord.data.split('=');
            acc[key] = value;
            return acc;
          }, {});

          const publicKey = annotations['publicKey']
          delete annotations['publicKey']
          const peerInfo: PeerInfo = {
            id: `${srvRecord.data.target}:${srvRecord.data.port}`,
            hostname: srvRecord.data.target,
            port: srvRecord.data.port,
            publicKey,
            annotations
          };

          const peer: Peer = new Peer(peerInfo, this.keyPairEncryption);
          this.peers.set(peerInfo.id, peer)
        });
      } catch (error) {
        console.error('Error discovering peers:', error);
      }
    }, 10000);
  }

  public send(data: Buffer, peerId: string): void {
    const peer = this.peers.get(peerId);
    if (!peer) {
      console.error(`Peer ${peerId} not found`);
      return;
    }

    peer.send(data);
  }

  public broadcast(data: Buffer): void {
    this.peers.forEach((peer) => peer.send(data));
  }

  public destroy(): void {
    this.server?.close();
    this.peers.forEach((peer) => peer.disconnect());
    this.mdns.destroy
  }
}

