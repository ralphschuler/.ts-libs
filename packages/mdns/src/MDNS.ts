import * as mdns from "multicast-dns";
import { DNSRecord, DNSType, DNSTypeMap } from "./types/index.js";

export class MDNS {
  private dns = mdns();
  private announcedRecords: DNSRecord[] = [];
  private recordResolvers: Map<string, Function> = new Map();

  constructor() {
    this.dns.on("query", (query) => this.handleQuery(query));
    this.dns.on("response", (response) => this.handleResponse(response));
  }

  public async query(serviceName: string, type: DNSType): Promise<DNSRecord[]> {
    const queryId = `${serviceName}:${type}:${Date.now()}`;
    this.dns.query({
      questions: [{ name: serviceName, type }],
      additionals: [{ name: "queryId", type: "TXT", data: queryId }],
    });

    return new Promise((resolve, reject) => {
      this.recordResolvers.set(queryId, resolve);

      setTimeout(() => {
        this.recordResolvers.delete(queryId);
        reject(new Error("Query timed out"));
      }, 5000);
    });
  }

  public announce(
    serviceName: string,
    type: DNSType,
    ttl: number,
    data: any,
  ): void {
    const record: DNSRecord = { name: serviceName, type, ttl, data };
    this.announcedRecords.push(record);
  }

  private handleQuery(query: { questions: DNSRecord[] }): void {
    const answers = query.questions.flatMap((question) =>
      this.announcedRecords.filter(
        (record) =>
          record.name === question.name &&
          (record.type === question.type || question.type === "ANY"),
      ),
    );

    if (answers.length) {
      this.dns.respond({ answers }).catch(console.error);
    }
  }

  private handleResponse(response: any): void {
    const queryId = response.additionals?.find(
      (additional) => additional.type === "TXT",
    )?.data;
    if (!queryId || !this.recordResolvers.has(queryId)) return;

    const answers = response.answers as DNSRecord[];
    const resolve = this.recordResolvers.get(queryId);
    resolve?.(answers);

    this.recordResolvers.delete(queryId);
  }

  public async destroy(): Promise<void> {
    try {
      await this.dns.destroy();
    } catch (err) {
      console.error(err);
    }
  }
}
