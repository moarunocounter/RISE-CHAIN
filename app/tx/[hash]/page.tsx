// app/tx/[hash]/page.tsx
import { notFound } from "next/navigation";

async function getTx(hash: string) {
  const rpc = "https://testnet.riselabs.xyz";
  const res = await fetch(rpc, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_getTransactionByHash",
      params: [hash],
      id: 1,
    }),
    cache: "no-store",
  });
  const json = await res.json();
  return json.result;
}

export default async function TxPage({ params }: { params: { hash: string } }) {
  const tx = await getTx(params.hash);
  if (!tx) return notFound();

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0e0f11] text-white p-6">
      <div className="w-full max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold text-blue-400">📦 Transaction Details</h1>

        <div className="bg-gray-800 p-4 rounded shadow space-y-3 text-sm font-mono">
          <p><span className="text-gray-400">Hash:</span> {tx.hash}</p>
          <p><span className="text-gray-400">From:</span> {tx.from}</p>
          <p><span className="text-gray-400">To:</span> {tx.to}</p>
          <p><span className="text-gray-400">Value:</span> {parseInt(tx.value, 16) / 1e18} ETH</p>
          <p><span className="text-gray-400">Nonce:</span> {parseInt(tx.nonce)}</p>
          <p><span className="text-gray-400">Gas Price:</span> {parseInt(tx.gasPrice, 16) / 1e9} Gwei</p>
          <div>
            <p className="text-gray-400">Input:</p>
            <pre className="bg-gray-900 p-2 rounded text-xs overflow-x-auto">{tx.input === "0x" ? "—" : tx.input}</pre>
          </div>
        </div>

        <a
          href={`https://explorer.testnet.riselabs.xyz/tx/${tx.hash}`}
          target="_blank"
          className="text-blue-500 hover:underline text-sm"
        >
          🔗 View on Rise Explorer
        </a>
      </div>
    </main>
  );
}
