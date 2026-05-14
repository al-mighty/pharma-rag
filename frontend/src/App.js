import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Header } from "./components/Layout/Header";
import { ChatPanel } from "./components/Chat/ChatPanel";
import { SourcesPanel } from "./components/Sources/SourcesPanel";
import { useChat } from "./hooks/useChat";
import { MessageSquare, BookOpen } from "lucide-react";
export default function App() {
    const { messages, sources, isStreaming, sendMessage, clearChat } = useChat();
    const [highlightedSource, setHighlightedSource] = useState(null);
    const [mobileTab, setMobileTab] = useState("chat");
    function handleCiteClick(index) {
        setHighlightedSource(index);
        setMobileTab("sources");
        setTimeout(() => {
            document.getElementById(`source-${index}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
        setTimeout(() => setHighlightedSource(null), 2000);
    }
    return (_jsxs("div", { className: "h-screen flex flex-col", children: [_jsx(Header, { onNewChat: clearChat }), _jsxs("div", { className: "flex-1 hidden lg:flex overflow-hidden", children: [_jsx("div", { className: "flex-1 min-w-0", children: _jsx(ChatPanel, { messages: messages, isStreaming: isStreaming, onSend: sendMessage, onCiteClick: handleCiteClick }) }), _jsx("div", { className: "w-80 shrink-0", children: _jsx(SourcesPanel, { sources: sources, highlightedIndex: highlightedSource }) })] }), _jsxs("div", { className: "flex-1 flex flex-col lg:hidden overflow-hidden", children: [_jsx("div", { className: "flex-1 overflow-hidden", children: mobileTab === "chat" ? (_jsx(ChatPanel, { messages: messages, isStreaming: isStreaming, onSend: sendMessage, onCiteClick: handleCiteClick })) : (_jsx(SourcesPanel, { sources: sources, highlightedIndex: highlightedSource })) }), _jsxs("div", { className: "flex border-t border-gray-200 bg-white", children: [_jsxs("button", { onClick: () => setMobileTab("chat"), className: `flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition ${mobileTab === "chat" ? "text-pharma-primary border-t-2 border-pharma-primary" : "text-pharma-muted"}`, children: [_jsx(MessageSquare, { className: "w-4 h-4" }), "\u0427\u0430\u0442"] }), _jsxs("button", { onClick: () => setMobileTab("sources"), className: `flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition relative ${mobileTab === "sources" ? "text-pharma-primary border-t-2 border-pharma-primary" : "text-pharma-muted"}`, children: [_jsx(BookOpen, { className: "w-4 h-4" }), "\u0418\u0441\u0442\u043E\u0447\u043D\u0438\u043A\u0438", sources.length > 0 && mobileTab === "chat" && (_jsx("span", { className: "absolute top-2 right-[calc(50%-30px)] w-2 h-2 bg-pharma-accent rounded-full" }))] })] })] })] }));
}
