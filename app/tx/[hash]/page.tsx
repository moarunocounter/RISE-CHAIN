// app/tx/[hash]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

async function getTx(hash: string) {
  const rpc = "https://testnet.riselabs.xyz";
  const body = {
    jsonrpc: "2.0",
    method: "eth_getTransactionReceipt",
    params: [hash],
    id: 1,
  };

  try {
    const res = await fetch(rpc, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const json = await res.json();
    return json.result;
  } catch {
    return null;
  }
}

export default async function TxPage({ params }: { params: { hash: string } }) {
  const { hash } = params;
  if (!hash || !hash.startsWith("0x")) return notFound();

  const tx = await getTx(hash);
  if (!tx) return notFound();

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0e0f11] text-white p-6">
      <div className="w-full max-w-xl space-y-6 text-center">
        <h1 className="text-3xl font-bold text-blue-400 drop-shadow">📦 Transaction Details</h1>

        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-gray-400 font-mono break-all">{hash}</span>
          <div className="flex gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(hash)}
              className="text-xs bg-gray-700 px-3 py-1 rounded-md hover:bg-gray-600"
            >
              Copy Hash
            </button>
            <a
              href={`https://explorer.testnet.riselabs.xyz/tx/${hash}`}
              target="_blank"
              className="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md"
            >
              Share <ArrowUpRight className="inline-block ml-1 w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-5 shadow space-y-2 text-left">
          <div>
            <span className="text-gray-400">From:</span>{" "}
            <span className="text-white font-mono">{tx.from}</span>
          </div>
          <div>
            <span className="text-gray-400">To:</span>{" "}
            <span className="text-white font-mono">{tx.to}</span>
          </div>
          <div>
            <span className="text-gray-400">Status:</span>{" "}
            <span className={tx.status === "0x1" ? "text-green-400" : "text-red-400"}>
              {tx.status === "0x1" ? "Success" : "Failed"}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Gas Used:</span>{" "}
            <span className="text-white">{parseInt(tx.gasUsed, 16)}</span>
          </div>
          <div>
            <span className="text-gray-400">Block:</span>{" "}
            <span className="text-white">{parseInt(tx.blockNumber, 16)}</span>
          </div>
        </div>

        <Link
          href="/"
          className="text-blue-400 text-sm hover:underline"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
