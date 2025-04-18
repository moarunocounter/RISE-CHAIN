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
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0e0f11] text-white">
      <div className="flex flex-col items-center justify-center space-y-4 w-full max-w-md">
        <h1 className="text-4xl font-bold text-blue-400 text-center">🌐 Rise Explorer v.0</h1>

        <select
          className="w-[300px] px-4 py-2 rounded-md bg-gray-800 text-white"
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
          className="w-[300px] px-4 py-2 rounded-md bg-gray-800 text-white"
        />

        <button
          onClick={fetchWalletData}
          className="w-[300px] bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
        >
          🔍 {loading ? "Loading..." : "Get Info"}
        </button>

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        {balance && (
          <div className="w-[300px] p-4 bg-gray-800 rounded text-center">
            💰 <span className="font-bold">Balance:</span> {balance} ETH
          </div>
        )}

        <p className="text-center text-gray-500 text-sm pt-4">
          Built by Moaru • Testnet only
        </p>
      </div>
    </main>
  );
}
