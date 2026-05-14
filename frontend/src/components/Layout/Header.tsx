import { Pill, RotateCcw } from "lucide-react";

export function Header({ onNewChat }: { onNewChat: () => void }) {
  return (
    <header className="bg-pharma-primary text-white px-6 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <Pill className="w-6 h-6" />
        <div>
          <h1 className="text-lg font-semibold leading-tight">PharmaRAG</h1>
          <p className="text-xs text-pharma-light/70 font-mono">AI-ассистент по фармдокументации</p>
        </div>
      </div>
      <button
        onClick={onNewChat}
        className="flex items-center gap-2 px-3 py-1.5 text-sm border border-white/30 rounded hover:bg-white/10 transition"
      >
        <RotateCcw className="w-4 h-4" />
        Новый чат
      </button>
    </header>
  );
}