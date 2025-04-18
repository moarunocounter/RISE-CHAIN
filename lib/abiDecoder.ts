// lib/abiDecoder.ts
import { Interface } from "ethers";

const iface = new Interface([
  "function transfer(address to, uint256 amount)",
  "function approve(address spender, uint256 amount)",
  "function swapExactETHForTokens(uint amountOutMin, address[] path, address to, uint deadline)",
  "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] path, address to, uint deadline)",
]);

export function decodeInputData(data: string) {
  try {
    const parsed = iface.parseTransaction({ data });
    return {
      name: parsed.name,
      args: parsed.args.map((arg, i) => ({
        name: parsed.functionFragment.inputs[i].name,
        value: Array.isArray(arg) ? JSON.stringify(arg) : arg.toString(),
      })),
    };
  } catch {
    return null;
  }
}
