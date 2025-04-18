export async function GET(
  req: Request,
  { params }: { params: { address: string } }
) {
  const { address } = params;

  try {
    const res = await fetch(
      `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&sort=desc&apikey=R4N6DU9VV81266478YYPWNGVXVMUWQGE39`
    );
    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch txs" }), {
      status: 500,
    });
  }
}
