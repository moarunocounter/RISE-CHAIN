export async function GET() {
  const rpc = "https://testnet.riselabs.xyz";
  const txs = [];
  let latestBlock = 0;

  try {
    const blockNumberRes = await fetch(rpc, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_blockNumber",
        params: [],
        id: 1,
      }),
    });
    const blockHex = (await blockNumberRes.json()).result;
    latestBlock = parseInt(blockHex, 16);

    for (let i = 0; i < 5; i++) {
      const blockNumber = latestBlock - i;
      const blockRes = await fetch(rpc, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_getBlockByNumber",
          params: ["0x" + blockNumber.toString(16), true],
          id: 1,
        }),
      });
      const blockData = await blockRes.json();
      const block = blockData.result;
      if (block?.transactions?.length > 0) {
        txs.push(...block.transactions);
      }
    }

    return Response.json({ latestBlock, txs });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch transactions" }), {
      status: 500,
    });
  }
}
