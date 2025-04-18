import { Interface } from "ethers";

export function decodeTx(abi: any[], input: string) {
  try {
    const iface = new Interface(abi);
    const parsed = iface.parseTransaction({ data: input });

    const args = parsed.args.map((arg, i) => ({
      name: parsed.fragment.inputs[i].name,
      value: Array.isArray(arg) ? JSON.stringify(arg) : arg.toString(),
    }));

    return {
      name: parsed.name,
      args,
    };
  } catch (err) {
    console.error("Failed to decode tx", err);
    return null;
  }
}
