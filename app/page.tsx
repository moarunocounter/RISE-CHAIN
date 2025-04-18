"use client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chain, setChain] = useState("rise");

  const fetchWalletData = async () => {
    if (!address) return;
    setLoading(true);
    setError("");

    try {
      const rpc = "https://testnet.riselabs.xyz";
      const data = {
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [address, "latest"],
        id: 1,
      };

      const res = await fetch(rpc, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      const eth = parseInt(result.result, 16) / 1e18;
      setBalance(eth.toFixed(6));
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0e0f11] text-white">
      <div className="w-full max-w-xl space-y-6">
        <h1 className="text-4xl font-bold text-center text-blue-400 flex items-center justify-center gap-2">
          🌐 Rise Explorer v.0
        </h1>

        <select
          className="w-full bg-gray-800 text-white p-2 rounded"
          value={chain}
          onChange={(e) => setChain(e.target.value)}
        >
          <option value="rise">Rise</option>
        </select>

        <input
          type="text"
          placeholder="0x..."
          className="w-full p-2 bg-gray-800 rounded"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <button
          className="w-full p-3 bg-blue-600 rounded hover:bg-blue-700 transition"
          onClick={fetchWalletData}
          disabled={loading}
        >
          🔍 {loading ? "Loading..." : "Get Info"}
        </button>

        {error && (
          <div className="p-3 bg-red-800 text-red-200 rounded">
            ⚠️ {error}
          </div>
        )}

        {balance && (
          <div className="p-4 bg-gray-800 rounded text-center text-lg font-mono">
            💰 <strong>Balance:</strong>{" "}
            <span className="text-green-400">{balance} ETH</span>
          </div>
        )}

        <div className="p-4 bg-gray-800 rounded text-center text-sm text-yellow-400">
          🪄 TX history is not available for Rise Testnet (no explorer API yet).
        </div>

        <p className="text-center text-gray-500 text-sm pt-4">
          Built by Moaru • Testnet only
        </p>
      </div>
    </main>
  );
}
