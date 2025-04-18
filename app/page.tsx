"use client";
import { useState } from "react";

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
      setError("⚠️ Failed to fetch data");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0e0f11] text-white p-6">
      <div className="w-full max-w-md flex flex-col items-center space-y-6">
        <h1 className="text-4xl font-bold text-blue-400 text-center">
          🌐 Rise Explorer v.0
        </h1>

        <select
          className="w-full px-4 py-3 rounded bg-gray-800 text-white"
          value={chain}
          onChange={(e) => setChain(e.target.value)}
        >
          <option value="rise">Rise</option>
        </select>

        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter wallet address"
          className="w-full px-4 py-3 rounded bg-gray-800 text-white"
        />

        <button
          onClick={fetchWalletData}
          disabled={loading}
          className="w-full px-4 py-3 rounded bg-blue-600 hover:bg-blue-700 transition"
        >
          🔍 {loading ? "Loading..." : "Get Info"}
        </button>

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        {balance && (
          <div className="w-full px-4 py-4 bg-gray-800 rounded text-center text-lg">
            💰 <span className="font-semibold">Balance:</span>{" "}
            <span className="text-green-400">{balance} ETH</span>
          </div>
        )}

        <p className="text-gray-500 text-sm pt-4 text-center">
          Built by Moaru • Testnet only
        </p>
      </div>
    </main>
  );
}
