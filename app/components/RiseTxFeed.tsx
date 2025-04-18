// RiseTxFeed.tsx
"use client";

import { useEffect, useState } from "react";

export default function RiseTxFeed() {
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/risetxs")
      .then((res) => res.json())
      .then((data) => {
        setTxs(data.txs || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch TXs");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-sm text-muted">Loading TXs...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div className="mt-6 p-4 bg-[#1e293b] rounded-xl">
      <h2 className="text-lg font-mono font-bold text-pink-400 mb-3">📄 Latest Rise TXs</h2>
      {txs.length === 0 ? (
        <p className="text-sm text-muted">No transactions found.</p>
      ) : (
        <ul className="space-y-2">
          {txs.slice(0, 10).map((tx: any) => (
            <li key={tx.hash} className="text-sm text-gray-200">
              <span className="text-blue-400">→</span>{" "}
              <span className="font-mono">{tx.hash.slice(0, 10)}...</span>{" "}
              <span className="text-gray-400">from</span>{" "}
              <span className="font-mono">{tx.from.slice(0, 8)}...</span>{" "}
              <span className="text-gray-400">to</span>{" "}
              <span className="font-mono">{tx.to?.slice(0, 8) || "0x0"}...</span>
              {" "}
              <a
                href={`https://explorer.testnet.riselabs.xyz/tx/${tx.hash}`}
                target="_blank"
                className="text-blue-500 hover:underline ml-2"
              >
                View
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
