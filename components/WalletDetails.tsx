// components/WalletDetails.tsx
"use client";

import { useEffect, useState } from "react";

const TOKENS = [
  {
    name: "USDC",
    symbol: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
    logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026",
  },
];

async function fetchBalance(address: string) {
  const rpc = "https://testnet.riselabs.xyz";
  const body = {
    jsonrpc: "2.0",
    method: "eth_getBalance",
    params: [address, "latest"],
    id: 1,
  };
  const res = await fetch(rpc, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await res.json();
  return parseFloat((parseInt(result.result, 16) / 1e18).toFixed(6));
}

async function fetchTokenHoldings(address: string) {
  const rpc = "https://testnet.riselabs.xyz";
  const results = [];
  for (const token of TOKENS) {
    const data = "0x70a08231" + address.replace("0x", "").padStart(64, "0");
    const body = {
      jsonrpc: "2.0",
      method: "eth_call",
      params: [
        {
          to: token.address,
          data,
        },
        "latest",
      ],
      id: 1,
    };
    const res = await fetch(rpc, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    const raw = json.result;
    const amount = parseInt(raw, 16) / 10 ** token.decimals;
    if (amount > 0) results.push({ ...token, amount });
  }
  return results;
}

export default function WalletDetails({ address }: { address: string }) {
  const [balance, setBalance] = useState<number | null>(null);
  const [tokens, setTokens] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [b, t] = await Promise.all([
          fetchBalance(address),
          fetchTokenHoldings(address),
        ]);
        setBalance(b);
        setTokens(t);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [address]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0e0f11] text-white p-6">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-3xl font-bold text-blue-400 drop-shadow">💳 Wallet Overview</h1>

        <div className="flex items-center justify-center gap-2">
          <span className="text-xs text-gray-400 break-all font-mono">{address}</span>
          <button
            onClick={() => navigator.clipboard.writeText(address)}
            className="text-xs text-blue-400 hover:underline"
          >
            copy
          </button>
        </div>

        <div className="bg-gray-800 rounded-2xl p-5 shadow-md space-y-3">
          <span className="text-xs px-2 py-1 bg-blue-600 rounded-full uppercase tracking-wider">Rise Testnet</span>
          <p className="text-sm">
            <span className="text-gray-400">Balance:</span>{" "}
            <span className="text-green-400 font-mono">
              {balance !== null ? `${balance} ETH` : "Unavailable"}
            </span>
          </p>
        </div>

        {tokens.length > 0 && (
          <div className="bg-gray-800 rounded-2xl p-5 shadow space-y-2">
            <h2 className="text-yellow-300 font-semibold text-base mb-2">🏦 Token Holdings</h2>
            <ul className="text-sm space-y-2">
              {tokens.map((t, i) => (
                <li key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={t.logo} alt={t.symbol} className="w-5 h-5 rounded-full" />
                    <span className="text-white font-semibold">{t.symbol}</span>
                  </div>
                  <span className="text-green-400 font-mono">{t.amount}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <a
          href={`https://explorer.testnet.riselabs.xyz/address/${address}`}
          target="_blank"
          className="text-blue-500 hover:underline text-sm"
        >
          🔗 View on Rise Explorer
        </a>
      </div>
    </main>
  );
}
