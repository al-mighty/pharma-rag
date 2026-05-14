import { Pill, RotateCcw } from "lucide-react";

export function Header({ onNewChat }: { onNewChat: () => void }) {
  return (
    <header className="bg-pharma-primary text-white px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2 sm:gap-3">
        <Pill className="w-5 h-5 sm:w-6 sm:h-6" />
        <div>
          <h1 className="text-base sm:text-lg font-semibold leading-tight">PharmaRAG</h1>
          <p className="text-[10px] sm:text-xs text-pharma-light/70 font-mono hidden sm:block">AI-ассистент по фармдокументации</p>
        </div>
      </div>
      <button
        onClick={onNewChat}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs sm:text-sm border border-white/30 rounded hover:bg-white/10 transition"
      >
        <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Новый чат</span>
        <span className="sm:hidden">Новый</span>
      </button>
    </header>
  );
}
