"use client";

import { useEffect, useState } from "react";
import Head from "next/head";

export default function Home() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [nonce, setNonce] = useState(null);
  const [code, setCode] = useState(null);
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWalletData = async () => {
    if (!address) return;
    setLoading(true);
    setError(null);
    try {
      const rpcUrl = "https://testnet.riselabs.xyz";

      const fetchRPC = async (method, params = []) => {
        const res = await fetch(rpcUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jsonrpc: "2.0", method, params, id: 1 }),
        });
        const data = await res.json();
        return data.result;
      };

      const [rawBalance, rawNonce, rawCode] = await Promise.all([
        fetchRPC("eth_getBalance", [address, "latest"]),
        fetchRPC("eth_getTransactionCount", [address, "latest"]),
        fetchRPC("eth_getCode", [address, "latest"]),
      ]);

      setBalance((parseInt(rawBalance, 16) / 1e18).toFixed(6));
      setNonce(parseInt(rawNonce, 16));
      setCode(rawCode);

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
    <main className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex flex-col items-center p-6 font-mono">
      <Head>
        <title>Rise Explorer v.0</title>
        <meta name="description" content="Check your wallet balance & tx on Rise testnet." />
        <meta property="og:title" content="Rise Explorer v.0" />
        <meta property="og:description" content="Explore wallet info on Rise testnet." />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <h1 className="text-4xl font-extrabold mb-4 text-pink-400 flex items-center gap-2">
        <span>🚀</span> Rise Explorer v.0
      </h1>

      <input
        placeholder="Paste wallet address (0x...)"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full max-w-md p-3 rounded bg-gray-800 border border-gray-600 mb-4 placeholder-gray-400 text-sm"
      />

      <button
        onClick={fetchWalletData}
        className="px-5 py-2.5 bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        disabled={loading || !address}
      >
        {loading ? "Fetching..." : "🔍 Get Info"}
      </button>

      {error && <p className="text-red-400 mt-4">⚠️ {error}</p>}

      {(balance || nonce !== null || code !== null) && (
        <div className="bg-gray-800 p-4 rounded-xl w-full max-w-md mt-6 shadow-md space-y-2">
          {balance && (
            <p><strong>💰 Balance:</strong> <span className="text-green-400">{balance} ETH</span></p>
          )}
          {nonce !== null && (
            <p><strong>📊 Nonce:</strong> {nonce}</p>
          )}
          {code !== null && (
            <p><strong>🧬 Type:</strong> {code === "0x" ? "EOA" : "Smart Contract"}</p>
          )}
        </div>
      )}

      {txs.length > 0 && (
        <div className="bg-gray-800 p-4 rounded-xl w-full max-w-md mt-4 shadow-md">
          <p className="mb-3 text-pink-300 font-semibold text-lg flex items-center gap-2">
            🧾 Last Transactions
          </p>
          <ul className="text-sm space-y-2">
            {txs.map((tx, index) => (
              <li
                key={tx.hash || index}
                className="truncate border-b border-gray-700 pb-2"
                title={`TX Hash: ${tx.hash}`}
              >
                {tx?.from?.toLowerCase?.() === address?.toLowerCase?.()
                  ? "→ Sent"
                  : "← Received"}{" "}
                <span className="text-blue-400">
                  {tx?.value ? (parseFloat(tx.value) / 1e18).toFixed(6) : "0"} ETH
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <footer className="mt-10 text-xs text-gray-500">
        Built by Moaru • Testnet only
      </footer>
    </main>
  );
}
