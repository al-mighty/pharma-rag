import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Header } from "./components/Layout/Header";
import { ChatPanel } from "./components/Chat/ChatPanel";
import { SourcesPanel } from "./components/Sources/SourcesPanel";
import { useChat } from "./hooks/useChat";
export default function App() {
    const { messages, sources, isStreaming, sendMessage, clearChat } = useChat();
    const [highlightedSource, setHighlightedSource] = useState(null);
    function handleCiteClick(index) {
        setHighlightedSource(index);
        document.getElementById(`source-${index}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => setHighlightedSource(null), 2000);
    }
    return (_jsxs("div", { className: "h-screen flex flex-col", children: [_jsx(Header, { onNewChat: clearChat }), _jsxs("div", { className: "flex-1 flex overflow-hidden", children: [_jsx("div", { className: "flex-1 min-w-0", children: _jsx(ChatPanel, { messages: messages, isStreaming: isStreaming, onSend: sendMessage, onCiteClick: handleCiteClick }) }), _jsx("div", { className: "w-80 hidden lg:block shrink-0", children: _jsx(SourcesPanel, { sources: sources, highlightedIndex: highlightedSource }) })] })] }));
}
