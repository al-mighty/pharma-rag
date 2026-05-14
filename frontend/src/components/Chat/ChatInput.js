import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Send } from "lucide-react";
import { useRef, useState } from "react";
export function ChatInput({ onSend, disabled }) {
    const [value, setValue] = useState("");
    const textareaRef = useRef(null);
    function handleSubmit() {
        const trimmed = value.trim();
        if (!trimmed || disabled)
            return;
        onSend(trimmed);
        setValue("");
        if (textareaRef.current)
            textareaRef.current.style.height = "auto";
    }
    function handleKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    }
    function handleInput() {
        const el = textareaRef.current;
        if (el) {
            el.style.height = "auto";
            el.style.height = Math.min(el.scrollHeight, 120) + "px";
        }
    }
    return (_jsx("div", { className: "border-t border-gray-200 bg-white p-4", children: _jsxs("div", { className: "flex items-end gap-3 max-w-3xl mx-auto", children: [_jsx("textarea", { ref: textareaRef, value: value, onChange: (e) => setValue(e.target.value), onKeyDown: handleKeyDown, onInput: handleInput, disabled: disabled, rows: 1, placeholder: "\u0421\u043F\u0440\u043E\u0441\u0438\u0442\u0435 \u043E \u043F\u0440\u0435\u043F\u0430\u0440\u0430\u0442\u0435...", className: "flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-pharma-primary focus:ring-1 focus:ring-pharma-primary disabled:opacity-50 disabled:bg-gray-50" }), _jsx("button", { onClick: handleSubmit, disabled: disabled || !value.trim(), className: "p-2.5 rounded-lg bg-pharma-primary text-white hover:bg-pharma-dark disabled:opacity-40 transition shrink-0", children: _jsx(Send, { className: "w-4 h-4" }) })] }) }));
}
