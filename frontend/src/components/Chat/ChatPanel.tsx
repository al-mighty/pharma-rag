import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { MessageSquare } from "lucide-react";
import type { ChatMessage } from "../../types";

interface Props {
  messages: ChatMessage[];
  isStreaming: boolean;
  onSend: (message: string) => void;
  onCiteClick?: (index: number) => void;
}

export function ChatPanel({ messages, isStreaming, onSend, onCiteClick }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-pharma-muted">
            <MessageSquare className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-lg font-medium">PharmaRAG</p>
            <p className="text-sm mt-1">Задайте вопрос о лекарственном препарате</p>
            <div className="mt-6 grid gap-2 text-xs">
              <SuggestionChip text="Показания к применению бевацизумаба?" onSend={onSend} />
              <SuggestionChip text="Противопоказания ритуксимаба" onSend={onSend} />
              <SuggestionChip text="Дозировка трастузумаба при раке молочной железы" onSend={onSend} />
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} onCiteClick={onCiteClick} />
        ))}
        <div ref={bottomRef} />
      </div>
      <ChatInput onSend={onSend} disabled={isStreaming} />
    </div>
  );
}

function SuggestionChip({ text, onSend }: { text: string; onSend: (t: string) => void }) {
  return (
    <button
      onClick={() => onSend(text)}
      className="px-4 py-2 border border-gray-200 rounded-full text-pharma-muted hover:border-pharma-primary hover:text-pharma-primary transition text-left"
    >
      {text}
    </button>
  );
}
