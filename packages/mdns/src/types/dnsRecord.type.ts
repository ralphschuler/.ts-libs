import { DNSType } from "./dnsType.type.js";
import { DNSTypeMap } from "./dnsTypeMap.type.js";

export interface DNSRecord {
  name: string;
  type: DNSType;
  ttl: number;
  data: Exclude<DNSTypeMap[DNSType], never>;
}
