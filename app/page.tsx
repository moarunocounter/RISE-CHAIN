"use client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [address, setAddress] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (address && address.startsWith("0x")) {
      router.push(`/wallet/${address}`);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0e0f11] text-white p-6">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-4xl font-bold text-blue-400 drop-shadow">
          🌐 Rise Explorer v.0
        </h1>
        <p className="text-sm text-gray-500">Built for Rise Testnet</p>

        <input
          type="text"
          placeholder="Enter wallet address (0x...)"
          className="w-full p-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <button
          onClick={handleSearch}
          disabled={!address.startsWith("0x")}
          className="w-full flex items-center justify-center gap-2 p-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
        >
          🔍 View Wallet <ArrowRight size={18} />
        </button>

        <p className="text-xs text-gray-500 pt-6">
          Made by <Link href="https://github.com/moarunocounter" className="underline">moaru</Link>
        </p>
      </div>
    </main>
  );
}
