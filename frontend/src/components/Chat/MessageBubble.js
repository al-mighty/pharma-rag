import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ReactMarkdown from "react-markdown";
import { Bot, User } from "lucide-react";
export function MessageBubble({ message, onCiteClick }) {
    const isUser = message.role === "user";
    function processCitations(children) {
        if (typeof children === "string") {
            return renderCitations(children, onCiteClick);
        }
        if (Array.isArray(children)) {
            return children.map((child, i) => (_jsx("span", { children: processCitations(child) }, i)));
        }
        return children;
    }
    return (_jsxs("div", { className: `flex gap-3 ${isUser ? "justify-end" : ""}`, children: [!isUser && (_jsx("div", { className: "w-8 h-8 rounded-full bg-pharma-primary/10 flex items-center justify-center shrink-0 mt-1", children: _jsx(Bot, { className: "w-4 h-4 text-pharma-primary" }) })), _jsx("div", { className: `max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser
                    ? "bg-pharma-primary text-white rounded-br-md"
                    : "bg-white border border-gray-200 rounded-bl-md"}`, children: isUser ? (_jsx("p", { className: "whitespace-pre-wrap", children: message.content })) : (_jsx("div", { className: "prose prose-sm max-w-none prose-p:my-1 prose-li:my-0.5 prose-headings:mb-2 prose-headings:mt-3", children: _jsx(ReactMarkdown, { components: {
                            p: ({ children }) => _jsx("p", { children: processCitations(children) }),
                            li: ({ children }) => _jsx("li", { children: processCitations(children) }),
                        }, children: message.content || "●" }) })) }), isUser && (_jsx("div", { className: "w-8 h-8 rounded-full bg-pharma-primary flex items-center justify-center shrink-0 mt-1", children: _jsx(User, { className: "w-4 h-4 text-white" }) }))] }));
}
function renderCitations(text, onCiteClick) {
    const parts = text.split(/(\[\d+\])/g);
    return parts.map((part, i) => {
        const match = part.match(/^\[(\d+)\]$/);
        if (match) {
            const idx = parseInt(match[1], 10);
            return (_jsx("button", { onClick: () => onCiteClick?.(idx - 1), className: "inline-flex items-center justify-center w-5 h-5 text-[10px] font-mono font-bold bg-pharma-source border border-pharma-source-border rounded-full text-amber-800 hover:bg-amber-200 transition mx-0.5 align-text-top cursor-pointer", children: idx }, i));
        }
        return _jsx("span", { children: part }, i);
    });
}
