"use client";
import { useState } from "react";
import { Globe } from "lucide-react";

export default function Home() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
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
      setBalance(parseFloat(eth.toFixed(6)));
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0e0f11] text-white">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-4xl font-bold text-blue-400 flex items-center justify-center gap-2">
          🌐 Rise Explorer v.0
        </h1>

        <select
          className="w-full px-4 py-3 rounded bg-gray-800 text-white mx-auto"
          value={chain}
          onChange={(e) => setChain(e.target.value)}
        >
          <option value="rise">Rise</option>
        </select>

        <input
          type="text"
          placeholder="0x..."
          className="w-full px-4 py-3 rounded bg-gray-800 text-white mx-auto"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <button
          onClick={fetchWalletData}
          disabled={loading}
          className="w-full px-4 py-3 rounded bg-blue-600 hover:bg-blue-700 transition mx-auto"
        >
          🔍 {loading ? "Loading..." : "Get Info"}
        </button>

        {balance !== null && (
          <div className="bg-gray-800 p-4 rounded mt-4 mx-auto w-full text-center">
            <p className="text-xl">
              <span className="text-yellow-400">💰 Balance:</span>{" "}
              <span className="text-green-400">{balance} ETH</span>
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-800 p-4 rounded mt-4 mx-auto w-full text-center">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        <p className="text-gray-500 text-sm pt-8">Built by Moaru • Testnet only</p>
      </div>
    </main>
  );
}
