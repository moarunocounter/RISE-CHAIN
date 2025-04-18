// Rise Explorer v.0 - Next.js (App Router + Tailwind)
// MVP: Input address → fetch balance + last tx + basic RPC info

"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const providerUrl = "https://ethereum-sepolia.publicnode.com";

  const fetchWalletData = async () => {
    if (!address) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=R4N6DU9VV81266478YYPWNGVXVMUWQGE39`
      );
      const data = await res.json();
      if (data.result) {
        setBalance((parseInt(data.result) / 1e18).toFixed(4));
      } else {
        setError("Balance not found");
      }

      const txRes = await fetch(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&sort=desc&apikey=R4N6DU9VV81266478YYPWNGVXVMUWQGE39`
      );
      const txData = await txRes.json();
      if (txData.result) {
        setTxs(txData.result.slice(0, 5));
      } else {
        setTxs([]);
      }
    } catch (err) {
      setError("Failed to fetch data");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-start p-6">
      <h1 className="text-3xl font-bold mb-6">🧠 Wallet Intel Lite</h1>

      <input
        placeholder="Enter wallet address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full max-w-md p-2 rounded bg-gray-900 border border-gray-700 mb-4"
      />

      <button
        onClick={fetchWalletData}
        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 mb-6"
        disabled={loading || !address}
      >
        {loading ? "Fetching..." : "Get Info"}
      </button>

      {error && <p className="text-red-400">{error}</p>}

      {balance && (
        <div className="bg-gray-800 p-4 rounded-xl w-full max-w-md mb-4">
          <p><strong>Balance:</strong> {balance} ETH</p>
        </div>
      )}

      {txs.length > 0 && (
        <div className="bg-gray-800 p-4 rounded-xl w-full max-w-md">
          <p className="mb-2 font-semibold">📑 Last Transactions</p>
          <ul className="text-sm space-y-1">
            {txs.map((tx) => (
              <li key={tx.hash} className="truncate">
                {tx?.from?.toLowerCase?.() === address?.toLowerCase?.()
                  ? "→ Sent"
                  : "← Received"} {parseFloat(tx.value || 0) / 1e18} ETH
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}

