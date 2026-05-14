import { FileText } from "lucide-react";
import type { Source } from "../../types";

interface Props {
  source: Source;
  index: number;
  highlighted: boolean;
}

export function SourceCard({ source, index, highlighted }: Props) {
  return (
    <div
      id={`source-${index}`}
      className={`border rounded-lg p-3 transition-all ${
        highlighted
          ? "border-pharma-source-border bg-pharma-source/50 shadow-sm"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-2 mb-2">
        <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-mono font-bold bg-pharma-source border border-pharma-source-border rounded-full text-amber-800 shrink-0 mt-0.5">
          {index + 1}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-pharma-text truncate">{source.drug_name}</p>
          <div className="flex items-center gap-1.5 text-xs text-pharma-muted mt-0.5">
            <FileText className="w-3 h-3" />
            <span className="truncate">{source.filename}</span>
            {source.page_number && <span>· стр. {source.page_number}</span>}
            <span className="ml-auto font-mono text-pharma-primary">{Math.round(source.score * 100)}%</span>
          </div>
        </div>
      </div>
      <p className="text-xs text-pharma-muted leading-relaxed line-clamp-4">{source.content}</p>
    </div>
  );
}
