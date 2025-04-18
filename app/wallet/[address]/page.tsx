// potongan dalam return
<main className="min-h-screen flex items-center justify-center bg-[#0e0f11] text-white p-6">
  <div className="w-full max-w-md space-y-6 text-center">
    <h1 className="text-3xl font-bold text-blue-400 drop-shadow">💳 Wallet Overview</h1>

    <div className="flex items-center justify-center gap-2">
      <span className="text-xs text-gray-400 break-all font-mono">{address}</span>
      <button
        onClick={() => navigator.clipboard.writeText(address)}
        className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded"
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
