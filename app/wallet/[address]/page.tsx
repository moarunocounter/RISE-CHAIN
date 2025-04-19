"use client";

import { notFound } from "next/navigation";

const TOKENS = [
  {
    name: "USDC",
    symbol: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
    logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026",
  },
];

async function getBalance(address: string) {
  const rpc = "https://testnet.riselabs.xyz";
  const body = {
    jsonrpc: "2.0",
    method: "eth_getBalance",
    params: [address, "latest"],
    id: 1,
  };

  try {
    const res = await fetch(rpc, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const result = await res.json();
    if (result?.result) {
      return parseFloat((parseInt(result.result, 16) / 1e18).toFixed(6));
    }
    return null;
  } catch {
    return null;
  }
}

async function getRecentTxs(address: string) {
  const rpc = "https://testnet.riselabs.xyz";
  const txs: any[] = [];

  try {
    const latestBlockHex = await fetch(rpc, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_blockNumber",
        params: [],
        id: 1,
      }),
    });

    const latest = parseInt((await latestBlockHex.json()).result, 16);

    for (let i = 0; i < 5; i++) {
      const hex = "0x" + (latest - i).toString(16);
      const res = await fetch(rpc, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_getBlockByNumber",
          params: [hex, true],
          id: 1,
        }),
      });

      const block = (await res.json()).result;
      if (block?.transactions) {
        txs.push(
          ...block.transactions.filter(
            (tx: any) =>
              tx.from.toLowerCase() === address.toLowerCase() ||
              tx.to?.toLowerCase() === address.toLowerCase()
          )
        );
      }
    }

    return txs;
  } catch {
    return [];
  }
}

async function getTokenHoldings(address: string) {
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

    try {
      const res = await fetch(rpc, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
      });
      const json = await res.json();
      const raw = json.result;
      if (raw && raw !== "0x") {
        const amount = parseInt(raw, 16) / 10 ** token.decimals;
        if (amount > 0) {
          results.push({ ...token, amount });
        }
      }
    } catch (err) {
      console.error("token fetch fail", token.symbol);
    }
  }

  return results;
}

export default async function WalletPage({ params }: { params: { address: string } }) {
  const { address } = params;
  if (!address || !address.startsWith("0x")) return notFound();

  const [balance, txs, tokens] = await Promise.all([
    getBalance(address),
    getRecentTxs(address),
    getTokenHoldings(address),
  ]);

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

        {txs.length > 0 ? (
          <div className="bg-gray-800 rounded-2xl p-5 shadow">
            <h2 className="text-pink-400 font-semibold text-base mb-3">📄 Recent Transactions</h2>
            <ul className="text-sm space-y-2">
              {txs.map((tx, i) => (
                <li key={i} className="border-b border-gray-700 pb-2">
                  <div className="text-blue-400 font-mono truncate">
                    <a
                      href={`https://explorer.testnet.riselabs.xyz/tx/${tx.hash}`}
                      target="_blank"
                      className="hover:underline"
                    >
                      {tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}
                    </a>
                  </div>
                  <div className="text-gray-400 text-xs">
                    from <span className="text-white">{tx.from.slice(0, 10)}...</span> to{" "}
                    <span className="text-white">{tx.to?.slice(0, 10) || "0x0"}...</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No recent transactions found. Try checking on{" "}
            <a
              href={`https://explorer.testnet.riselabs.xyz/address/${address}`}
              className="underline text-blue-400"
              target="_blank"
            >
              Rise Explorer
            </a>
          </p>
        )}
      </div>
    </main>
  );
}
