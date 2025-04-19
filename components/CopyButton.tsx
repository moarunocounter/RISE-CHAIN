"use client";

export default function CopyButton({ text }: { text: string }) {
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard.writeText(text)}
      className="text-xs text-blue-400 hover:underline"
    >
      copy
    </button>
  );
}
