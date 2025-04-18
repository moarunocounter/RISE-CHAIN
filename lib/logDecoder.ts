// lib/logDecoder.ts
import { Interface } from "ethers";

const iface = new Interface([
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
]);

export function decodeLogs(logs: any[]) {
  const decoded = [];
  for (const log of logs) {
    try {
      const parsed = iface.parseLog(log);
      decoded.push(parsed);
    } catch {
      // skip
    }
  }
  return decoded;
}
