import { useState } from "react";
import { Header } from "./components/Layout/Header";
import { ChatPanel } from "./components/Chat/ChatPanel";
import { SourcesPanel } from "./components/Sources/SourcesPanel";
import { useChat } from "./hooks/useChat";
import { MessageSquare, BookOpen } from "lucide-react";

export default function App() {
  const { messages, sources, isStreaming, sendMessage, clearChat } = useChat();
  const [highlightedSource, setHighlightedSource] = useState<number | null>(null);
  const [mobileTab, setMobileTab] = useState<"chat" | "sources">("chat");

  function handleCiteClick(index: number) {
    setHighlightedSource(index);
    setMobileTab("sources");
    setTimeout(() => {
      document.getElementById(`source-${index}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
    setTimeout(() => setHighlightedSource(null), 2000);
  }

  return (
    <div className="h-screen flex flex-col">
      <Header onNewChat={clearChat} />

      {/* Desktop: side by side */}
      <div className="flex-1 hidden lg:flex overflow-hidden">
        <div className="flex-1 min-w-0">
          <ChatPanel
            messages={messages}
            isStreaming={isStreaming}
            onSend={sendMessage}
            onCiteClick={handleCiteClick}
          />
        </div>
        <div className="w-80 shrink-0">
          <SourcesPanel sources={sources} highlightedIndex={highlightedSource} />
        </div>
      </div>

      {/* Mobile: tabs */}
      <div className="flex-1 flex flex-col lg:hidden overflow-hidden">
        <div className="flex-1 overflow-hidden">
          {mobileTab === "chat" ? (
            <ChatPanel
              messages={messages}
              isStreaming={isStreaming}
              onSend={sendMessage}
              onCiteClick={handleCiteClick}
            />
          ) : (
            <SourcesPanel sources={sources} highlightedIndex={highlightedSource} />
          )}
        </div>
        <div className="flex border-t border-gray-200 bg-white">
          <button
            onClick={() => setMobileTab("chat")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition ${
              mobileTab === "chat" ? "text-pharma-primary border-t-2 border-pharma-primary" : "text-pharma-muted"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Чат
          </button>
          <button
            onClick={() => setMobileTab("sources")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition relative ${
              mobileTab === "sources" ? "text-pharma-primary border-t-2 border-pharma-primary" : "text-pharma-muted"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Источники
            {sources.length > 0 && mobileTab === "chat" && (
              <span className="absolute top-2 right-[calc(50%-30px)] w-2 h-2 bg-pharma-accent rounded-full" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
