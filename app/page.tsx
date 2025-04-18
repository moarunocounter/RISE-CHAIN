"use client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [input, setInput] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const trimmed = input.trim();
    if (!trimmed.startsWith("0x")) return;

    if (trimmed.length === 42) {
      router.push(`/wallet/${trimmed}`);
    } else if (trimmed.length === 66) {
      router.push(`/tx/${trimmed}`);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0e0f11] text-white p-6">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-4xl font-bold text-blue-400 drop-shadow">
          🌐 Rise Explorer v.0
        </h1>
        <p className="text-sm text-gray-500">Enter wallet or TX hash</p>

        <input
          type="text"
          placeholder="Paste 0x wallet or transaction hash"
          className="w-full p-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleSearch}
          disabled={!input.startsWith("0x")}
          className="w-full flex items-center justify-center gap-2 p-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
        >
          🔍 Explore <ArrowRight size={18} />
        </button>
      </div>
    </main>
  );
}
