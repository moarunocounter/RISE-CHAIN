// app/tx/[hash]/page.tsx
'use client';

import { notFound } from "next/navigation";
import { decodeInputData } from "@/lib/abiDecoder";
import { decodeLogs } from "@/lib/logDecoder";
import { useState } from "react";

async function getTx(hash: string) {
  const rpc = "https://testnet.riselabs.xyz";
  const res = await fetch(rpc, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_getTransactionByHash",
      params: [hash],
      id: 1,
    }),
    cache: "no-store",
  });
  const json = await res.json();
  return json.result;
}

async function getReceipt(hash: string) {
  const rpc = "https://testnet.riselabs.xyz";
  const res = await fetch(rpc, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_getTransactionReceipt",
      params: [hash],
      id: 1,
    }),
    cache: "no-store",
  });
  const json = await res.json();
  return json.result;
}

export default async function TxPage({ params }: { params: { hash: string } }) {
  const tx = await getTx(params.hash);
  const receipt = await getReceipt(params.hash);
  if (!tx || !receipt) return notFound();

  const decoded = decodeInputData(tx.input);
  const logs = decodeLogs(receipt.logs);
  const shareUrl = `https://rise-explorer.vercel.app/tx/${tx.hash}`;

  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0e0f11] text-white p-6">
      <div className="w-full max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold text-blue-400">📦 Transaction Details</h1>

        <div className="bg-gray-800 p-4 rounded shadow space-y-3 text-sm font-mono">
          <div className="flex items-center justify-between">
            <p><span className="text-gray-400">Hash:</span> {tx.hash}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleCopy(tx.hash, "Hash copied!")}
                className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
              >
                📋 Copy
              </button>
              <button
                onClick={() => handleCopy(shareUrl, "Link copied!")}
                className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
              >
                🔗 Share
              </button>
            </div>
          </div>
          {copied && (
            <p className="text-green-400 text-xs text-right">✅ {copied}</p>
          )}
          <p><span className="text-gray-400">Status:</span> {receipt.status === "0x1" ? "✅ Success" : "❌ Failed"}</p>
          <p><span className="text-gray-400">From:</span> {tx.from}</p>
          <p><span className="text-gray-400">To:</span> {tx.to}</p>
          <p><span className="text-gray-400">Value:</span> {parseInt(tx.value, 16) / 1e18} ETH</p>
          <p><span className="text-gray-400">Gas Price:</span> {parseInt(tx.gasPrice, 16) / 1e9} Gwei</p>
          <p><span className="text-gray-400">Gas Used:</span> {parseInt(receipt.gasUsed, 16)}</p>
          <p><span className="text-gray-400">Block:</span> {parseInt(receipt.blockNumber, 16)}</p>
          <p><span className="text-gray-400">Tx Index:</span> {parseInt(receipt.transactionIndex, 16)}</p>

          {decoded ? (
            <div>
              <p className="text-gray-400">Decoded Input:</p>
              <div className="bg-gray-900 p-3 rounded text-xs space-y-1">
                <p className="text-lime-400 font-semibold">{decoded.name}()</p>
                {decoded.args.map((arg, idx) => (
                  <p key={idx}><span className="text-gray-500">{arg.name}:</span> {arg.value}</p>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-400">Input:</p>
              <pre className="bg-gray-900 p-2 rounded text-xs overflow-x-auto">{tx.input === "0x" ? "—" : tx.input}</pre>
            </div>
          )}

          {logs.length > 0 && (
            <div>
              <p className="text-gray-400 pt-4">Event Logs:</p>
              <div className="bg-gray-900 p-3 rounded text-xs space-y-3">
                {logs.map((log, i) => (
                  <div key={i} className="border-b border-gray-700 pb-2">
                    <p className="text-pink-400 font-semibold">{log.name}</p>
                    {log.args.map((arg, idx) => (
                      <p key={idx}>
                        <span className="text-gray-500">{log.eventFragment.inputs[idx].name}:</span> {arg.toString()}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <a
          href={`https://explorer.testnet.riselabs.xyz/tx/${tx.hash}`}
          target="_blank"
          className="text-blue-500 hover:underline text-sm"
        >
          🔗 View on Rise Explorer
        </a>
      </div>
    </main>
  );
}
