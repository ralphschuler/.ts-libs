import { DNSType } from "./dnsType.type.ts";
import { DNSTypeMap } from "./dnsTypeMap.type.ts";

export interface DNSRecord {
  name: string;
  type: DNSType;
  ttl: number;
  data: DNSTypeMap[DNSType];
}
