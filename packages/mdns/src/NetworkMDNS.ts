import multicast from "multicast-dns";
import { EventEmitter } from "node:events";
import type { DNSRecord, DNSType } from "./types/index.js";

export interface MulticastTransport {
  on(event: string, listener: (packet: any) => void): unknown;
  off(event: string, listener: (packet: any) => void): unknown;
  query(packet: any): unknown;
  respond(packet: any): unknown;
  destroy(callback: () => void): unknown;
}
type Pending = {
  name: string;
  type: DNSType;
  records: Map<string, DNSRecord>;
  finish: () => void;
  reject: (error: unknown) => void;
  timer: ReturnType<typeof setTimeout>;
};
const key = (record: DNSRecord) =>
  JSON.stringify([record.name, record.type, record.data]);
const toWire = (record: DNSRecord) => {
  const { type, data } = record;
  const payload = data as any;
  return {
    ...record,
    data:
      type === "A" || type === "AAAA"
        ? payload.address
        : ["CNAME", "NS", "TXT"].includes(type)
          ? payload.data
          : payload,
  };
};
const fromWire = (record: any): DNSRecord | null => {
  const { name, type, ttl } = record;
  if (typeof name !== "string" || !Number.isFinite(ttl) || ttl < 0) return null;
  let data: any;
  if (type === "A" || type === "AAAA") {
    if (typeof record.data !== "string") return null;
    data = { address: record.data };
  } else if (type === "CNAME" || type === "NS") {
    if (typeof record.data !== "string") return null;
    data = { data: record.data };
  } else if (type === "TXT")
    data = {
      data: Array.isArray(record.data)
        ? record.data.map((part: any) => String(part)).join("")
        : String(record.data),
    };
  else if (type === "SRV") {
    if (
      !record.data ||
      !Number.isInteger(record.data.port) ||
      typeof record.data.target !== "string"
    )
      return null;
    data = {
      priority: record.data.priority ?? 0,
      weight: record.data.weight ?? 0,
      port: record.data.port,
      target: record.data.target,
    };
  } else if (type === "MX") data = record.data;
  else return null;
  return { name, type, ttl, data };
};

/** Real multicast adapter; no socket is opened until start is called. */
export class NetworkMDNS extends EventEmitter {
  private transport: MulticastTransport | undefined;
  private readonly records = new Map<
    string,
    { record: DNSRecord; expires: number }
  >();
  private readonly pending = new Set<Pending>();
  constructor(
    private readonly factory: () => MulticastTransport = () =>
      multicast() as unknown as MulticastTransport,
    private readonly queryWindowMs = 250,
  ) {
    super();
    if (!Number.isFinite(queryWindowMs) || queryWindowMs < 1)
      throw new RangeError("queryWindowMs must be positive");
  }
  start(): void {
    if (this.transport) return;
    this.transport = this.factory();
    this.transport.on("query", this.onQuery);
    this.transport.on("response", this.onResponse);
    this.transport.on("error", this.onError);
    for (const { record } of this.records.values())
      this.transport.respond({ answers: [toWire(record)] });
  }
  announce(
    name: string,
    type: Exclude<DNSType, "ANY">,
    ttl: number,
    data: DNSRecord["data"],
  ): void {
    if (!Number.isFinite(ttl) || ttl < 0)
      throw new RangeError("ttl must be non-negative");
    const record: DNSRecord = { name, type, ttl, data: structuredClone(data) };
    if (ttl === 0) this.records.delete(key(record));
    else
      this.records.set(key(record), {
        record,
        expires: Date.now() + ttl * 1000,
      });
    this.transport?.respond({ answers: [toWire(record)] });
  }
  query(name: string, type: DNSType): Promise<DNSRecord[]> {
    const transport = this.transport;
    if (!transport)
      return Promise.reject(new Error("Call start before network queries"));
    return new Promise((resolve, reject) => {
      const entry = {} as Pending;
      entry.name = name;
      entry.type = type;
      entry.records = new Map();
      entry.reject = reject;
      entry.finish = () => {
        clearTimeout(entry.timer);
        this.pending.delete(entry);
        resolve(
          [...entry.records.values()].map((record) => structuredClone(record)),
        );
      };
      entry.timer = setTimeout(entry.finish, this.queryWindowMs);
      this.pending.add(entry);
      try {
        transport.query({ questions: [{ name, type }] });
      } catch (error) {
        clearTimeout(entry.timer);
        this.pending.delete(entry);
        reject(error);
      }
    });
  }
  private readonly onQuery = (packet: any): void => {
    for (const [id, value] of this.records)
      if (value.expires <= Date.now()) this.records.delete(id);
    const answers = [...this.records.values()]
      .filter(({ record }) =>
        (packet.questions ?? []).some(
          (question: any) =>
            question.name === record.name &&
            (question.type === "ANY" || question.type === record.type),
        ),
      )
      .map(({ record }) => toWire(record));
    if (answers.length) this.transport?.respond({ answers });
  };
  private readonly onResponse = (packet: any): void => {
    for (const wire of [
      ...(packet.answers ?? []),
      ...(packet.additionals ?? []),
    ]) {
      const record = fromWire(wire);
      if (!record) continue;
      for (const pending of this.pending) {
        if (
          pending.name !== record.name ||
          (pending.type !== "ANY" && pending.type !== record.type)
        )
          continue;
        if (record.ttl === 0) pending.records.delete(key(record));
        else pending.records.set(key(record), record);
      }
    }
  };
  private readonly onError = (error: unknown): void => {
    for (const pending of this.pending) {
      clearTimeout(pending.timer);
      pending.reject(error);
    }
    this.pending.clear();
    this.emit("transportError", error);
  };
  async destroy(): Promise<void> {
    for (const pending of [...this.pending]) pending.finish();
    const transport = this.transport;
    this.transport = undefined;
    if (!transport) {
      this.records.clear();
      return;
    }
    for (const { record } of this.records.values())
      transport.respond({ answers: [toWire({ ...record, ttl: 0 })] });
    transport.off("query", this.onQuery);
    transport.off("response", this.onResponse);
    transport.off("error", this.onError);
    this.records.clear();
    await new Promise<void>((resolve) => transport.destroy(resolve));
  }
}
