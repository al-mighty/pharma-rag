import { useState } from "react";
import { Header } from "./components/Layout/Header";
import { ChatPanel } from "./components/Chat/ChatPanel";
import { SourcesPanel } from "./components/Sources/SourcesPanel";
import { useChat } from "./hooks/useChat";

export default function App() {
  const { messages, sources, isStreaming, sendMessage, clearChat } = useChat();
  const [highlightedSource, setHighlightedSource] = useState<number | null>(null);

  function handleCiteClick(index: number) {
    setHighlightedSource(index);
    document.getElementById(`source-${index}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => setHighlightedSource(null), 2000);
  }

  return (
    <div className="h-screen flex flex-col">
      <Header onNewChat={clearChat} />
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 min-w-0">
          <ChatPanel
            messages={messages}
            isStreaming={isStreaming}
            onSend={sendMessage}
            onCiteClick={handleCiteClick}
          />
        </div>
        <div className="w-80 hidden lg:block shrink-0">
          <SourcesPanel sources={sources} highlightedIndex={highlightedSource} />
        </div>
      </div>
    </div>
  );
}
