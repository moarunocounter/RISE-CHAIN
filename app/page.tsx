"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { Interface } from "ethers";

const CHAINS = {
  rise: {
    name: "Rise",
    rpc: "https://testnet.riselabs.xyz",
    explorer: "https://explorer.testnet.riselabs.xyz/tx/",
    supportsTx: false,
  },
  sepolia: {
    name: "Sepolia",
    rpc: "https://rpc.sepolia.org",
    explorer: "https://sepolia.etherscan.io/tx/",
    supportsTx: true,
  },
};

const erc20ABI = [
  "function transfer(address to, uint256 value)",
  "function approve(address spender, uint256 amount)",
  "function transferFrom(address from, address to, uint256 value)"
];
const iface = new Interface(erc20ABI);

export default function Home() {
  const [chain, setChain] = useState("rise");
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [txs, setTxs] = useState([]);
  const [inputData, setInputData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWalletData = async () => {
    if (!address || !CHAINS[chain]) return;
    setLoading(true);
    setError(null);
    try {
      const rpcUrl = CHAINS[chain].rpc;

      const res1 = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_getBalance",
          params: [address, "latest"],
          id: 1,
        }),
      });
      const balanceRaw = (await res1.json()).result;
      setBalance((parseInt(balanceRaw, 16) / 1e18).toFixed(6));

      if (CHAINS[chain].supportsTx) {
        const txRes = await fetch(`/api/txs/${address}`);
        const txData = await txRes.json();
        if (txData.result) {
          setTxs(txData.result.slice(0, 5));
        } else {
          setTxs([]);
        }
      } else {
        setTxs([]);
      }
    } catch (err) {
      setError("Failed to fetch data");
    }
    setLoading(false);
  };

  const decodeInput = (input) => {
    if (!input || input === "0x") return "(no input)";
    try {
      const decoded = iface.parseTransaction({ data: input });
      return `${decoded.name}(${decoded.args.map((arg) => arg.toString()).join(", ")})`;
    } catch (e) {
      return `Hex length: ${input.length - 2}`;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 to-gray-900 text-white flex flex-col items-center p-4 md:p-8 font-mono">
      <Head>
        <title>Rise Explorer v.0</title>
      </Head>

      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-blue-400 text-center">🌐 Rise Explorer v.0</h1>

      <div className="w-full max-w-xl flex flex-col gap-3">
        <select
          value={chain}
          onChange={(e) => setChain(e.target.value)}
          className="bg-gray-800 text-white border border-gray-700 px-4 py-2 rounded text-sm"
        >
          {Object.entries(CHAINS).map(([id, c]) => (
            <option key={id} value={id}>{c.name}</option>
          ))}
        </select>

        <input
          placeholder="Enter address (0x...)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="p-3 rounded bg-gray-800 border border-gray-700 placeholder-gray-400 text-sm"
        />

        <button
          onClick={fetchWalletData}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-sm rounded disabled:opacity-50"
          disabled={loading || !address}
        >
          {loading ? "Fetching..." : "🔍 Get Info"}
        </button>
      </div>

      {error && <p className="text-red-400 mt-4">⚠️ {error}</p>}

      {balance && (
        <div className="bg-gray-800 p-4 rounded-xl w-full max-w-xl mt-6 shadow-md">
          <p className="text-sm">💰 Balance: <span className="text-green-400">{balance} ETH</span></p>
        </div>
      )}

      {CHAINS[chain].supportsTx ? (
        txs.length > 0 && (
          <div className="bg-gray-800 p-4 rounded-xl w-full max-w-xl mt-4 shadow-md">
            <p className="mb-3 text-pink-300 font-semibold text-base flex items-center gap-2">
              🧾 Last Transactions
            </p>
            <ul className="text-sm space-y-4">
              {txs.map((tx, i) => (
                <li key={i} className="border-b border-gray-700 pb-3">
                  <div className="flex justify-between items-center">
                    <a
                      href={`${CHAINS[chain].explorer}${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline truncate max-w-[70%]"
                    >
                      🔗 {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                    </a>
                    <span className="text-xs text-gray-400">{parseFloat(tx.value) / 1e18} ETH</span>
                  </div>
                  <div className="text-xs mt-1 text-gray-300">To: {tx.to}</div>
                  <div className="text-xs text-gray-400">Gas: {tx.gasUsed || "—"}</div>
                  <span
                    onClick={() => setInputData({ ...inputData, [tx.hash]: !inputData[tx.hash] })}
                    className="text-blue-400 cursor-pointer text-xs hover:underline mt-1 inline-block"
                  >
                    {inputData[tx.hash] ? "Hide Input" : "View Input"}
                  </span>
                  {inputData[tx.hash] && (
                    <pre className="bg-gray-900 mt-1 p-2 text-xs rounded break-all whitespace-pre-wrap">{decodeInput(tx.input)}</pre>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )
      ) : (
        <div className="bg-gray-800 p-4 rounded-xl w-full max-w-xl mt-4 shadow-md text-center text-sm text-gray-400">
          🚧 TX history is not available for Rise Testnet (no explorer API yet).
        </div>
      )}

      <footer className="mt-10 text-xs text-gray-500 text-center">
        Built by Moaru • Testnet only
      </footer>
    </main>
  );
}
