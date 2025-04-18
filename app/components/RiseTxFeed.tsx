// RiseTxFeed.tsx
"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

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
      .catch(() => {
        setError("Failed to fetch TXs");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-sm text-muted">Loading TXs...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div className="mt-6 p-4 bg-[#1e293b] rounded-xl border border-[#334155]">
      <h2 className="text-lg font-mono font-bold text-blue-400 mb-3">📄 Latest Rise TXs</h2>
      {txs.length === 0 ? (
        <p className="text-sm text-muted">No transactions found.</p>
      ) : (
        <ul className="space-y-3">
          {txs.slice(0, 10).map((tx: any) => {
            const shortHash = tx.hash.slice(0, 10) + "...";
            const shortFrom = tx.from.slice(0, 8) + "...";
            const shortTo = tx.to ? tx.to.slice(0, 8) + "..." : "0x0";
            const value = parseInt(tx.value || "0x0", 16) / 1e18;

            return (
              <li key={tx.hash} className="text-sm bg-[#0f172a] rounded-md p-3 hover:bg-[#1e293b]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div>
                    <span className="text-blue-400 font-mono">{shortHash}</span>
                    <span className="text-gray-400 mx-2">→</span>
                    <span className="text-pink-400 font-mono">{value.toFixed(4)} ETH</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    <span className="mr-2">from <span className="text-white font-mono">{shortFrom}</span></span>
                    <span>to <span className="text-white font-mono">{shortTo}</span></span>
                  </div>
                </div>
                <a
                  href={`https://explorer.testnet.riselabs.xyz/tx/${tx.hash}`}
                  target="_blank"
                  className="text-blue-500 inline-flex items-center gap-1 text-xs mt-1 hover:underline"
                >
                  View in explorer <ArrowUpRight size={14} />
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
