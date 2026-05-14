import { BookOpen } from "lucide-react";
import { SourceCard } from "./SourceCard";
import type { Source } from "../../types";

interface Props {
  sources: Source[];
  highlightedIndex: number | null;
}

export function SourcesPanel({ sources, highlightedIndex }: Props) {
  return (
    <div className="flex flex-col h-full border-l border-gray-200 bg-pharma-bg">
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-pharma-primary" />
          <h2 className="text-sm font-semibold">Источники</h2>
          {sources.length > 0 && (
            <span className="text-xs font-mono text-pharma-muted">({sources.length})</span>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {sources.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-pharma-muted text-xs">
            <BookOpen className="w-8 h-8 mb-2 opacity-20" />
            <p>Источники появятся здесь</p>
          </div>
        ) : (
          sources.map((src, i) => (
            <SourceCard
              key={src.chunk_id}
              source={src}
              index={i}
              highlighted={highlightedIndex === i}
            />
          ))
        )}
      </div>
    </div>
  );
}
