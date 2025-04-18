"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [address, setAddress] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.startsWith("0x") && address.length === 42) {
      router.push(`/wallet/${address}`);
    } else {
      alert("Invalid address");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0e0f11] text-white p-6">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-4xl font-bold text-blue-400">🌐 Rise Explorer</h1>
        <p className="text-gray-400">Enter a wallet address to explore</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="0x..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 text-white font-mono"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded text-white font-semibold"
          >
            🔎 View Wallet
          </button>
        </form>

        <p className="text-sm text-gray-500 pt-4">Built by Moaru • Testnet only</p>
      </div>
    </main>
  );
}
