export type DNSTypeMap = {
  A: { address: string };
  AAAA: { address: string };
  CNAME: { data: string };
  MX: { priority: number; exchange: string };
  NS: { data: string };
  SRV: { priority: number; weight: number; port: number; target: string };
  TXT: { data: string };
};
