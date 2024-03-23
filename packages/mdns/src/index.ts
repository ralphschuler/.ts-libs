import * as mdns from 'multicast-dns';

interface DNSTypeMap {
  A: { address: string };
  AAAA: { address: string };
  CNAME: { cname: string };
  MX: { priority: number; exchange: string };
  NS: { ns: string };
  SRV: { port: number; target: string };
  TXT: { [key: string]: string };
  ANY: DNSTypeMap['A'] | DNSTypeMap['AAAA'] | DNSTypeMap['CNAME'] | DNSTypeMap['MX'] | DNSTypeMap['NS'] | DNSTypeMap['SRV'] | DNSTypeMap['TXT'];
}

interface DNSQuery<T extends keyof DNSTypeMap> {
  name: string;
  type: T;
  ttl: number;
  data: DNSTypeMap[T];
}

class MDNS {
  private dns = mdns();
  private announcedEntries: DNSQuery<keyof DNSTypeMap>[] = [];
  private queryResolvers: Map<string, (value: DNSQuery<keyof DNSTypeMap>[] | PromiseLike<DNSQuery<keyof DNSTypeMap>[]>) => void> = new Map();
  private serviceListeners: Map<string, (service: DNSQuery<'SRV'>) => void> = new Map();

  constructor() {
    this.dns.on('query', (query) => this.handleQuery(query));
    this.dns.on('response', (response) => this.handleResponse(response));
  }

  public query<T extends keyof DNSTypeMap>(serviceName: string, type: T): Promise<DNSQuery<T>[]> {
    const queryId = `${serviceName}:${type}:${Date.now()}`;
    this.dns.query({ questions: [{ name: serviceName, type }], additionals: [{ name: 'queryId', type: 'TXT', data: queryId }] });

    return new Promise((resolve, reject) => {
      this.queryResolvers.set(queryId, resolve);

      setTimeout(() => {
        this.queryResolvers.delete(queryId);
        reject(new Error('Query timed out'));
      }, 5000);
    });
  }

  public announce<T extends keyof DNSTypeMap>(serviceName: string, type: T, ttl: number, data: DNSTypeMap[T]): void {
    const announcement: DNSQuery<T> = { name: serviceName, type, ttl, data };
    this.announcedEntries.push(announcement);
    this.notifyListeners(serviceName, announcement as unknown as DNSQuery<'SRV'>); // Simplified for SRV announcements
  }

  private notifyListeners(serviceName: string, service: DNSQuery<'SRV'>): void {
    this.serviceListeners.forEach((callback, key) => {
      if (serviceName === key) {
        callback(service);
      }
    });
  }

  public onServiceAnnouncement(serviceName: string, callback: (service: DNSQuery<'SRV'>) => void): void {
    this.serviceListeners.set(serviceName, callback);
  }

  private handleQuery(query: { questions: DNSQuery<keyof DNSTypeMap>[] }): void {
    const answers = query.questions.flatMap(question =>
      this.announcedEntries.filter(entry =>
        entry.name === question.name && (entry.type === question.type || question.type === 'ANY')
      )
    );

    if (answers.length) {
      this.dns.respond({ answers }).catch(console.error);
    }
  }

  private handleResponse(response: any): void {
    const queryId = response.additionals?.find(additional => additional.type === 'TXT')?.data;
    if (!queryId || !this.queryResolvers.has(queryId)) return;

    const answers = response.answers as DNSQuery<keyof DNSTypeMap>[];
    const resolve = this.queryResolvers.get(queryId);
    resolve?.(answers);

    this.queryResolvers.delete(queryId);
  }

  public async destroy(): Promise<void> {
    try {
      await this.dns.destroy();
    } catch (err) {
      console.error(err);
    }
  }
}