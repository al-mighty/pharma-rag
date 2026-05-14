import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { MessageSquare } from "lucide-react";
export function ChatPanel({ messages, isStreaming, onSend, onCiteClick }) {
    const bottomRef = useRef(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    return (_jsxs("div", { className: "flex flex-col h-full", children: [_jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [messages.length === 0 && (_jsxs("div", { className: "flex flex-col items-center justify-center h-full text-pharma-muted", children: [_jsx(MessageSquare, { className: "w-12 h-12 mb-4 opacity-30" }), _jsx("p", { className: "text-lg font-medium", children: "PharmaRAG" }), _jsx("p", { className: "text-sm mt-1", children: "\u0417\u0430\u0434\u0430\u0439\u0442\u0435 \u0432\u043E\u043F\u0440\u043E\u0441 \u043E \u043B\u0435\u043A\u0430\u0440\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u043C \u043F\u0440\u0435\u043F\u0430\u0440\u0430\u0442\u0435" }), _jsxs("div", { className: "mt-6 grid gap-2 text-xs", children: [_jsx(SuggestionChip, { text: "\u041F\u043E\u043A\u0430\u0437\u0430\u043D\u0438\u044F \u043A \u043F\u0440\u0438\u043C\u0435\u043D\u0435\u043D\u0438\u044E \u0431\u0435\u0432\u0430\u0446\u0438\u0437\u0443\u043C\u0430\u0431\u0430?", onSend: onSend }), _jsx(SuggestionChip, { text: "\u041F\u0440\u043E\u0442\u0438\u0432\u043E\u043F\u043E\u043A\u0430\u0437\u0430\u043D\u0438\u044F \u0440\u0438\u0442\u0443\u043A\u0441\u0438\u043C\u0430\u0431\u0430", onSend: onSend }), _jsx(SuggestionChip, { text: "\u0414\u043E\u0437\u0438\u0440\u043E\u0432\u043A\u0430 \u0442\u0440\u0430\u0441\u0442\u0443\u0437\u0443\u043C\u0430\u0431\u0430 \u043F\u0440\u0438 \u0440\u0430\u043A\u0435 \u043C\u043E\u043B\u043E\u0447\u043D\u043E\u0439 \u0436\u0435\u043B\u0435\u0437\u044B", onSend: onSend })] })] })), messages.map((msg) => (_jsx(MessageBubble, { message: msg, onCiteClick: onCiteClick }, msg.id))), _jsx("div", { ref: bottomRef })] }), _jsx(ChatInput, { onSend: onSend, disabled: isStreaming })] }));
}
function SuggestionChip({ text, onSend }) {
    return (_jsx("button", { onClick: () => onSend(text), className: "px-4 py-2 border border-gray-200 rounded-full text-pharma-muted hover:border-pharma-primary hover:text-pharma-primary transition text-left", children: text }));
}
