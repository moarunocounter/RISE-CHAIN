// app/token/[address]/page.tsx
"use client";
import { notFound } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

const RPC = "https://testnet.riselabs.xyz";

async function fetchTotalSupply(address: string): Promise<string> {
  const body = {
    jsonrpc: "2.0",
    method: "eth_call",
    params: [
      {
        to: address,
        data: "0x18160ddd", // totalSupply()
      },
      "latest",
    ],
    id: 1,
  };

  try {
    const res = await fetch(RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    const raw = json.result;
    if (raw && raw !== "0x") {
      const supply = parseInt(raw, 16);
      return supply.toLocaleString();
    }
  } catch (err) {
    console.error("Failed to fetch supply", err);
  }
  return "Unavailable";
}

function decodeAddress(topic: string): string {
  return "0x" + topic.slice(-40);
}

async function fetchRecentTransfers(address: string): Promise<any[]> {
  const transferTopic = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"; // Transfer()
  const body = {
    jsonrpc: "2.0",
    method: "eth_getLogs",
    params: [
      {
        fromBlock: "0x0",
        toBlock: "latest",
        address,
        topics: [transferTopic],
      },
    ],
    id: 1,
  };

  try {
    const res = await fetch(RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    const logs = json.result;
    const holders = new Set<string>();
    const decodedLogs = logs.slice(-10).map((log: any) => {
      const from = decodeAddress(log.topics[1]);
      const to = decodeAddress(log.topics[2]);
      holders.add(to);
      return {
        hash: log.transactionHash,
        from,
        to,
      };
    });
    return [decodedLogs, holders.size];
  } catch (err) {
    console.error("Failed to fetch logs", err);
    return [[], 0];
  }
}

export default function TokenDetailPage({ params }: { params: { address: string } }) {
  const { address } = params;
  if (!address || !address.startsWith("0x")) return notFound();

  const [supply, setSupply] = useState("Loading...");
  const [logs, setLogs] = useState<any[]>([]);
  const [holders, setHolders] = useState(0);

  useEffect(() => {
    fetchTotalSupply(address).then(setSupply);
    fetchRecentTransfers(address).then(([logList, holderCount]) => {
      setLogs(logList);
      setHolders(holderCount);
    });
  }, [address]);

  const MOCK = {
    name: "TestUSDC",
    symbol: "USDC",
    logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026",
  };

  return (
    <main className="min-h-screen bg-[#0e0f11] text-white p-6">
      <div className="max-w-xl mx-auto space-y-6 text-center">
        <h1 className="text-3xl font-bold text-blue-400">🔍 Token Detail</h1>
        <div className="flex items-center justify-center gap-4">
          <Image src={MOCK.logo} alt={MOCK.symbol} width={48} height={48} className="rounded-full" />
          <div>
            <div className="text-xl font-semibold">{MOCK.name} ({MOCK.symbol})</div>
            <div className="text-xs text-gray-400 flex items-center justify-center gap-2">
              {address}
              <button
                className="text-blue-400 hover:underline text-xs"
                onClick={() => navigator.clipboard.writeText(address)}
              >
                copy
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-4 space-y-3 shadow">
          <p><span className="text-gray-400">Total Supply:</span> {supply}</p>
          <p><span className="text-gray-400">Holders:</span> {holders.toLocaleString()}</p>
          <p><span className="text-gray-400">Recent Transfers:</span> {logs.length}</p>
        </div>

        {logs.length > 0 && (
          <div className="bg-gray-900 rounded-2xl p-4 mt-6 text-left">
            <h2 className="text-pink-400 text-base font-semibold mb-2">📄 Last Transfers</h2>
            <ul className="space-y-2 text-sm">
              {logs.map((tx, i) => (
                <li key={i} className="border-b border-gray-800 pb-2">
                  <div className="text-xs text-gray-400">Tx Hash:</div>
                  <a
                    href={`https://explorer.testnet.riselabs.xyz/tx/${tx.hash}`}
                    target="_blank"
                    className="text-blue-400 hover:underline break-all"
                  >
                    {tx.hash}
                  </a>
                  <div className="text-gray-400 text-xs mt-1">
                    from <span className="text-white">{tx.from.slice(0, 10)}...</span> to <span className="text-white">{tx.to.slice(0, 10)}...</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
