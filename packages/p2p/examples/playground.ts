import { P2P } from '../src/index.js';

const peer1 = new P2P({ port: 6001 });
peer1.on('connection', (peer) => {
  console.log(`Peer ${peer.id} connected`);
});
peer1.on('data', (data, peer) => {
  console.log(`Received data from ${peer.id}: ${data.toString()}`);
});

const peer2 = new P2P({ port: 6002 });
peer2.on('connection', (peer) => {
  console.log(`Peer ${peer.id} connected`);
})
peer2.on('data', (data, peer) => {
  console.log(`Received data from ${peer.id}: ${data.toString()}`);
});

// Wait for the Peers to start listening
await Promise.all([
  new Promise((resolve) => peer1.once('listening', resolve)),
  new Promise((resolve) => peer2.once('listening', resolve)),
])

// Wait for the Peers to Discover each other
await Promise.all([
  new Promise((resolve) => peer1.once('connection', resolve)),
  new Promise((resolve) => peer2.once('connection', resolve)),
])

// Send data from peer1 to peer2
peer1.send(peer2.id, Buffer.from('Hello from peer1'));
peer2.send(peer1.id, Buffer.from('Hello from peer2'));

setTimeout(() => {
  peer1.destroy();
  peer2.destroy();
}, 60 * 1000);
