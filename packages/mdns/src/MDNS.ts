import { DNSRecord, DNSType } from "./types/index.js";

/**
 * A deterministic in-process mDNS discovery model.
 *
 * It intentionally models announcement, lookup, and lifecycle without opening
 * multicast sockets. A network transport can be added behind this contract
 * without making unit tests depend on a local network.
 */
export class MDNS {
  private static readonly records = new Map<DNSRecord, number>();
  private readonly announcedRecords = new Set<DNSRecord>();
  constructor(private readonly clock: () => number = Date.now) {}

  public async query(serviceName: string, type: DNSType): Promise<DNSRecord[]> {
    for (const [record, expires] of MDNS.records)
      if (expires <= this.clock()) MDNS.records.delete(record);
    return [...MDNS.records.keys()]
      .filter(
        (record) =>
          record.name === serviceName &&
          (type === "ANY" || record.type === type),
      )
      .map((record) => structuredClone(record));
  }

  public announce(
    serviceName: string,
    type: Exclude<DNSType, "ANY">,
    ttl: number,
    data: DNSRecord["data"],
  ): void {
    if (!Number.isFinite(ttl) || ttl < 0)
      throw new RangeError("ttl must be a non-negative number");
    const record: DNSRecord = {
      name: serviceName,
      type,
      ttl,
      data: structuredClone(data),
    };
    this.announcedRecords.add(record);
    MDNS.records.set(record, this.clock() + ttl * 1000);
  }

  public async destroy(): Promise<void> {
    for (const record of this.announcedRecords) MDNS.records.delete(record);
    this.announcedRecords.clear();
  }
}
