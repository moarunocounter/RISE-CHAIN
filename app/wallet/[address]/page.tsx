import { notFound } from "next/navigation";

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

export default async function WalletPage({ params }: { params: { address: string } }) {
  const { address } = params;
  if (!address || !address.startsWith("0x")) return notFound();

  const balance = await getBalance(address);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0e0f11] text-white p-6">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-3xl font-bold text-blue-400 drop-shadow">💳 Wallet Overview</h1>

        <div className="flex items-center justify-center gap-2">
          <span className="text-xs text-gray-400 break-all font-mono">{address}</span>
          <button
            type="button"
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
      </div>
    </main>
  );
}
