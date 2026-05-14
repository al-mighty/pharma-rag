import ReactMarkdown from "react-markdown";
import { Bot, User } from "lucide-react";
import type { ChatMessage } from "../../types";
import type { ReactNode } from "react";

interface Props {
  message: ChatMessage;
  onCiteClick?: (index: number) => void;
}

export function MessageBubble({ message, onCiteClick }: Props) {
  const isUser = message.role === "user";

  function processCitations(children: ReactNode): ReactNode {
    if (typeof children === "string") {
      return renderCitations(children, onCiteClick);
    }
    if (Array.isArray(children)) {
      return children.map((child, i) => (
        <span key={i}>{processCitations(child)}</span>
      ));
    }
    return children;
  }

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-pharma-primary/10 flex items-center justify-center shrink-0 mt-1">
          <Bot className="w-4 h-4 text-pharma-primary" />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-pharma-primary text-white rounded-br-md"
            : "bg-white border border-gray-200 rounded-bl-md"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none prose-p:my-1 prose-li:my-0.5 prose-headings:mb-2 prose-headings:mt-3">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p>{processCitations(children)}</p>,
                li: ({ children }) => <li>{processCitations(children)}</li>,
              }}
            >
              {message.content || "●"}
            </ReactMarkdown>
          </div>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-pharma-primary flex items-center justify-center shrink-0 mt-1">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
}

function renderCitations(text: string, onCiteClick?: (index: number) => void) {
  const parts = text.split(/(\[\d+\])/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[(\d+)\]$/);
    if (match) {
      const idx = parseInt(match[1], 10);
      return (
        <button
          key={i}
          onClick={() => onCiteClick?.(idx - 1)}
          className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-mono font-bold bg-pharma-source border border-pharma-source-border rounded-full text-amber-800 hover:bg-amber-200 transition mx-0.5 align-text-top cursor-pointer"
        >
          {idx}
        </button>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
